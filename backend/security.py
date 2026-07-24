"""
Equivalente di JwtService + JwtAuthenticationFilter + SecurityConfig.

Con JWT stateless non serve un filtro custom come in Spring: usiamo una
dependency FastAPI (get_current_user) che estrae e valida il Bearer token
su ogni richiesta protetta, esattamente come faceva il filtro Java.
"""
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import AdminUser, AdminRole

bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Usa la libreria bcrypt direttamente (invece di passlib.CryptContext,
    che ha un bug di compatibilità con le versioni recenti di bcrypt)."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        # bcrypt rifiuta input oltre 72 byte: trattiamo come credenziali
        # non valide invece di far esplodere la richiesta con un 500.
        return False


def create_access_token(email: str, role: AdminRole) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.jwt_expiration_minutes)
    payload = {
        "sub": email,
        "role": f"ROLE_{role.value}",
        "iss": settings.jwt_issuer,
        "iat": now,
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def expiration_seconds() -> int:
    return settings.jwt_expiration_minutes * 60


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Estrae l'utente dal Bearer token. Equivalente del JwtAuthenticationFilter
    + CustomUserDetailsService: valida firma/scadenza, poi ricarica l'utente
    dal DB e verifica che sia ancora abilitato (un account disabilitato nel
    frattempo da un SUPERADMIN non deve poter continuare ad operare)."""
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token mancante")

    try:
        payload = decode_token(credentials.credentials)
        email = payload.get("sub")
        if email is None:
            raise JWTError("Token senza subject")
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token non valido o scaduto")

    user = db.query(AdminUser).filter(AdminUser.email.ilike(email)).first()
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Utente non trovato")
    if not user.enabled:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Account disabilitato")

    return user


def require_roles(*allowed_roles: AdminRole):
    """Dependency factory, equivalente di @PreAuthorize("hasAnyRole(...)").
    Uso: Depends(require_roles(AdminRole.ADMIN, AdminRole.SUPERADMIN))"""

    def _checker(user: AdminUser = Depends(get_current_user)) -> AdminUser:
        if user.role not in allowed_roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accesso non consentito")
        return user

    return _checker


# Qualunque ruolo admin valido: equivalente di
# .requestMatchers("/api/admin/**").hasAnyRole("EDITOR", "ADMIN", "SUPERADMIN")
require_any_admin = require_roles(AdminRole.EDITOR, AdminRole.ADMIN, AdminRole.SUPERADMIN)

# ADMIN o SUPERADMIN: usato per site-settings, contact-messages, newsletter-subscribers
require_admin_or_superadmin = require_roles(AdminRole.ADMIN, AdminRole.SUPERADMIN)

# Solo SUPERADMIN: usato per la gestione degli account
require_superadmin = require_roles(AdminRole.SUPERADMIN)
