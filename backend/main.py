from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from config import settings
from exceptions import register_exception_handlers
from database import Base, engine, SessionLocal
from logger import AuditEvent, write_audit_event, app_logger
from security import decode_token
from seed import seed_default_admin, seed_content
import models  # noqa: F401  (importato per registrare le tabelle su Base.metadata)

import routes

app = FastAPI(title="andreamoiochef-backend", version="1.0.0")

# --- CORS -------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# --- Audit logging (copre TUTTA l'applicazione: ogni richiesta /api/**) -----
_ACTION_BY_METHOD = {
    "GET": "READ", "POST": "CREATE", "PUT": "UPDATE", "PATCH": "UPDATE", "DELETE": "DELETE",
}
# Esclusi dal middleware generico: file statici (/uploads/**, non è
# "applicativo" ma distribuzione di asset), le richieste OPTIONS di
# preflight CORS (puro rumore di protocollo), e i pochi endpoint che
# scrivono GIÀ un evento di audit più preciso (login/reset password: qui
# vogliamo "LOGIN_FAILED" invece di un generico "CREATE" con errore, e
# vogliamo l'email del tentativo anche senza un token Bearer presente).
_EXCLUDED_PREFIXES = (settings.upload_public_url_prefix,)
_EXCLUDED_EXACT_PATHS = {"/api/auth/login", "/api/auth/forgot-password", "/api/auth/reset-password"}


def _try_decode_actor(request: Request) -> tuple[str | None, str | None]:
    """Prova a estrarre email/ruolo dal Bearer token, senza mai far fallire
    la richiesta: qui serve solo per arricchire il log, la vera validazione
    del token resta compito delle dependency di sicurezza sugli endpoint.
    Per richieste anonime (es. GET pubblici) restituisce (None, None)."""
    auth_header = request.headers.get("authorization", "")
    if not auth_header.lower().startswith("bearer "):
        return None, None
    token = auth_header[7:]
    try:
        payload = decode_token(token)
        email = payload.get("sub")
        role = (payload.get("role") or "").removeprefix("ROLE_")
        return email, role or None
    except Exception:
        return None, None


def _resource_info_from_path(path: str) -> tuple[str, str, str | None]:
    """Deriva scope/resource_type/resource_id dal path, es.
    /api/admin/dishes/7 -> ('admin', 'dishes', '7')
    /api/public/dishes   -> ('public', 'dishes', None)
    /api/auth/login      -> ('auth', 'login', None)
    """
    parts = [p for p in path.removeprefix("/api/").split("/") if p]
    scope = parts[0] if parts else "unknown"
    resource_type = parts[1] if len(parts) > 1 else scope
    resource_id = parts[2] if len(parts) > 2 and parts[2].isdigit() else None
    return scope, resource_type, resource_id


class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        is_audited = (
            path.startswith("/api/")
            and request.method != "OPTIONS"
            and path not in _EXCLUDED_EXACT_PATHS
            and not any(path.startswith(p) for p in _EXCLUDED_PREFIXES)
        )
        if not is_audited:
            return await call_next(request)

        actor_email, actor_role = _try_decode_actor(request)
        scope, resource_type, resource_id = _resource_info_from_path(path)
        event = AuditEvent(
            action=_ACTION_BY_METHOD.get(request.method, request.method),
            scope=scope,
            resource_type=resource_type,
            resource_id=resource_id,
            actor_email=actor_email,
            actor_role=actor_role,
        ).start()

        try:
            response = await call_next(request)
            event.http_status = response.status_code
            event.outcome = "OK" if response.status_code < 400 else "ERROR"
            return response
        except Exception:
            event.http_status = 500
            event.outcome = "ERROR"
            raise
        finally:
            write_audit_event(event)


app.add_middleware(AuditMiddleware)

register_exception_handlers(app)

# --- File statici (immagini/video caricati) ----------------------------------
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount(settings.upload_public_url_prefix, StaticFiles(directory=settings.upload_dir), name="uploads")

# --- Router (tutti definiti in routes.py) ------------------------------------
app.include_router(routes.auth_router)
app.include_router(routes.accounts_router)
app.include_router(routes.dishes_admin_router)
app.include_router(routes.dishes_public_router)
app.include_router(routes.event_types_admin_router)
app.include_router(routes.event_types_public_router)
app.include_router(routes.services_admin_router)
app.include_router(routes.services_public_router)
app.include_router(routes.testimonials_admin_router)
app.include_router(routes.testimonials_public_router)
app.include_router(routes.milestones_router)
app.include_router(routes.core_values_router)
app.include_router(routes.menus_admin_router)
app.include_router(routes.menus_public_router)
app.include_router(routes.site_settings_admin_router)
app.include_router(routes.site_settings_public_router)
app.include_router(routes.site_texts_admin_router)
app.include_router(routes.site_texts_public_router)
app.include_router(routes.about_router)
app.include_router(routes.contact_admin_router)
app.include_router(routes.contact_public_router)
app.include_router(routes.newsletter_admin_router)
app.include_router(routes.newsletter_public_router)
app.include_router(routes.reviews_router)
app.include_router(routes.uploads_router)
app.include_router(routes.health_router)


@app.on_event("startup")
def on_startup() -> None:
    """Crea le tabelle (se non esistono) e popola i dati demo al primo avvio."""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_default_admin(db)
        seed_content(db)
    finally:
        db.close()
