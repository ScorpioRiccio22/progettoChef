"""
Configurazione centrale dell'app, equivalente di application.yml +
le classi @ConfigurationProperties del backend Spring (JwtProperties,
CorsProperties, AdminSeedProperties, StorageProperties, GooglePlacesProperties).

Tutti i valori arrivano da variabili d'ambiente. I segreti critici
(JWT_SECRET, ADMIN_SEED_PASSWORD, DB_PASSWORD) sono OBBLIGATORI: l'app
si rifiuta di avviarsi se mancano o sono palesemente deboli, invece di
partire silenziosamente con un valore di comodo da sviluppo.
"""
from functools import lru_cache

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Placeholder noti che NON devono mai finire in staging/produzione: se
# qualcuno copia-incolla il .env.example senza modificarlo, l'app blocca
# l'avvio invece di partire con un segreto pubblico (è nel codice open-source).
_KNOWN_PLACEHOLDER_SECRETS = {
    "changeit-dev-secret-please-override-in-prod-min-32-chars",
    "admin123",
    "andreamoiochef",
    "changeme",
    "password",
}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Database ---------------------------------------------------------
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "andreamoiochef"
    db_username: str = "andreamoiochef"
    db_password: str  # OBBLIGATORIA, nessun default

    @property
    def sqlalchemy_database_uri(self) -> str:
        return (
            f"postgresql+psycopg2://{self.db_username}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    # --- CORS ---------------------------------------------------------------
    cors_allowed_origins: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]

    # --- JWT ------------------------------------------------------------
    jwt_secret: str  # OBBLIGATORIA, nessun default, minimo 32 caratteri (vedi validator)
    jwt_expiration_minutes: int = 480
    jwt_issuer: str = "andreamoiochef-backend"

    # --- Admin seed -----------------------------------------------------
    admin_seed_enabled: bool = True
    admin_seed_email: str = "admin@andreamoiochef.it"
    admin_seed_password: str  # OBBLIGATORIA, nessun default
    admin_seed_full_name: str = "Andrea Moio"

    # --- Storage --------------------------------------------------------
    upload_dir: str = "/app/uploads"
    upload_public_url_prefix: str = "/uploads"

    # --- Google Places ----------------------------------------------------
    google_places_api_key: str = ""
    google_places_place_id: str = ""
    google_places_cache_minutes: int = 180
    google_places_max_reviews: int = 6

    # --- Multipart (limiti upload) ----------------------------------------
    multipart_max_file_size: str = "210MB"
    multipart_max_request_size: str = "210MB"

    # --- Email (SMTP, es. Brevo) --------------------------------------------
    # Opzionali: se non impostate, l'invio email è disabilitato (log di
    # avviso invece di crash) — utile in sviluppo locale senza un vero
    # provider SMTP configurato.
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_sender_email: str = "noreply@andreamoiochef.it"
    smtp_sender_name: str = "Andrea Moio Chef"

    @property
    def smtp_configured(self) -> bool:
        return bool(self.smtp_host and self.smtp_username and self.smtp_password)

    # --- Frontend (per i link nelle email: reset password, unsubscribe) ------
    # SEGNAPOSTO: da aggiornare quando il dominio definitivo sarà collegato.
    frontend_base_url: str = "https://staging.andreamoiochef.it"

    # --- Recupero password ------------------------------------------------
    password_reset_token_expiration_minutes: int = 30

    @field_validator("jwt_secret")
    @classmethod
    def _jwt_secret_must_be_strong(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError(
                "JWT_SECRET deve essere lungo almeno 32 caratteri. "
                "Generane uno con: openssl rand -base64 48"
            )
        if v in _KNOWN_PLACEHOLDER_SECRETS:
            raise ValueError(
                "JWT_SECRET è ancora il valore segnaposto di esempio: cambialo "
                "con un valore casuale, es: openssl rand -base64 48"
            )
        return v

    @field_validator("admin_seed_password", "db_password")
    @classmethod
    def _password_must_not_be_placeholder(cls, v: str) -> str:
        if not v or v in _KNOWN_PLACEHOLDER_SECRETS:
            raise ValueError(
                "Questa password è vuota o è ancora un valore segnaposto di "
                "esempio: impostane una robusta, es: openssl rand -base64 24"
            )
        return v

    @model_validator(mode="after")
    def _warn_if_smtp_partially_configured(self) -> "Settings":
        smtp_fields_set = [bool(self.smtp_host), bool(self.smtp_username), bool(self.smtp_password)]
        if any(smtp_fields_set) and not all(smtp_fields_set):
            raise ValueError(
                "Configurazione SMTP incompleta: se imposti una delle variabili "
                "SMTP_HOST/SMTP_USERNAME/SMTP_PASSWORD, vanno impostate tutte e tre."
            )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

