"""
Configurazione centrale dell'app, equivalente di application.yml +
le classi @ConfigurationProperties del backend Spring (JwtProperties,
CorsProperties, AdminSeedProperties, StorageProperties, GooglePlacesProperties).

Tutti i valori arrivano da variabili d'ambiente, con gli stessi default
usati lato Java, per restare compatibili con lo stesso docker-compose.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- Database ---------------------------------------------------------
    # Formato compatibile con l'URL jdbc: costruiamo noi la connection string
    # SQLAlchemy a partire dagli stessi pezzi usati in application.yml.
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "andreamoiochef"
    db_username: str = "andreamoiochef"
    db_password: str = "andreamoiochef"

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
    jwt_secret: str = "changeit-dev-secret-please-override-in-prod-min-32-chars"
    jwt_expiration_minutes: int = 480
    jwt_issuer: str = "andreamoiochef-backend"

    # --- Admin seed -----------------------------------------------------
    admin_seed_enabled: bool = True
    admin_seed_email: str = "admin@andreamoiochef.it"
    admin_seed_password: str = "admin123"
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


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
