from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from exceptions import register_exception_handlers
from database import Base, engine, SessionLocal
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
