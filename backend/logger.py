"""
logger.py — Logging centralizzato per andreamoiochef-backend.

Fornisce:
  - log applicativo JSONL su logs/app.log (append, rotazione a 5MB)
  - audit log JSONL su logs/audit.log (append, rotazione a 5MB), un evento
    per OGNI richiesta dell'applicazione (non solo /api/admin/**)

Politica di rotazione: quando un file supera 5MB, viene compresso in
{nome}_{timestamp-rotazione}.log.zip e si riparte con un file vuoto.
I file compressi NON vengono mai cancellati automaticamente da questo
modulo — se in futuro serve un limite di retention (es. "cancella zip più
vecchi di 90 giorni"), va aggiunto un cron/job separato, deliberatamente
tenuto fuori da qui per non perdere tracce di audit senza un'azione esplicita.
"""
import json
import logging
import os
import time
import uuid
import zipfile
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler
from typing import Optional

LOG_DIR = os.environ.get("LOG_DIR", "logs")
MAX_LOG_BYTES = 5 * 1024 * 1024  # 5MB, come richiesto


class ZippedRotatingFileHandler(RotatingFileHandler):
    """RotatingFileHandler che, invece di rinominare in .1/.2/.3, comprime
    il file appena chiuso in un .zip con timestamp univoco nel nome, e non
    ne limita il numero (nessuna cancellazione automatica dei vecchi archivi)."""

    def __init__(self, filename: str, maxBytes: int):
        # backupCount=1 è necessario solo per ABILITARE la rotazione in
        # RotatingFileHandler (con 0 non ruota mai); il numero non ha altro
        # effetto qui perché namer/rotator sono completamente sovrascritti.
        super().__init__(filename, mode="a", maxBytes=maxBytes, backupCount=1, encoding="utf-8")
        base, ext = os.path.splitext(filename)
        self._base = base
        self._ext = ext or ".log"
        self.namer = self._namer
        self.rotator = self._rotator

    def _namer(self, default_name: str) -> str:
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S_%f")
        return f"{self._base}_{timestamp}{self._ext}.zip"

    def _rotator(self, source: str, dest: str) -> None:
        if not os.path.exists(source):
            return
        arcname = os.path.basename(dest)[:-4]  # tolgo ".zip" per il nome dentro l'archivio
        with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.write(source, arcname=arcname)
        os.remove(source)


# ─────────────────────────────────────────────────────────────────
# LOG APPLICATIVO — JSONL, logs/app.log
# ─────────────────────────────────────────────────────────────────
class JsonlFormatter(logging.Formatter):
    """Formatter che produce una riga JSON per ogni log record."""

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)


def setup_logger(name: str = "andreamoiochef") -> logging.Logger:
    """Configura (una sola volta) e restituisce il logger applicativo JSONL,
    che scrive sia su console che su logs/app.log (append, rotazione 5MB)."""
    os.makedirs(LOG_DIR, exist_ok=True)
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger
    logger.setLevel(logging.INFO)

    fmt = JsonlFormatter()

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(fmt)
    logger.addHandler(console_handler)

    file_handler = ZippedRotatingFileHandler(os.path.join(LOG_DIR, "app.log"), maxBytes=MAX_LOG_BYTES)
    file_handler.setFormatter(fmt)
    logger.addHandler(file_handler)

    return logger


app_logger = setup_logger()


# ─────────────────────────────────────────────────────────────────
# AUDIT LOG — JSONL, logs/audit.log — copre TUTTA l'applicazione
# (ogni richiesta HTTP, non solo le scritture sotto /api/admin/**)
# ─────────────────────────────────────────────────────────────────
class _PassthroughFormatter(logging.Formatter):
    """L'evento arriva già come stringa JSON completa (AuditEvent.to_jsonl()):
    qui non aggiungiamo altro, scriviamo il messaggio così com'è."""

    def format(self, record: logging.LogRecord) -> str:
        return record.getMessage()


def _setup_audit_logger(name: str = "andreamoiochef.audit") -> logging.Logger:
    os.makedirs(LOG_DIR, exist_ok=True)
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger
    logger.setLevel(logging.INFO)
    logger.propagate = False  # non deve finire anche in app.log

    file_handler = ZippedRotatingFileHandler(os.path.join(LOG_DIR, "audit.log"), maxBytes=MAX_LOG_BYTES)
    file_handler.setFormatter(_PassthroughFormatter())
    logger.addHandler(file_handler)

    return logger


_audit_logger = _setup_audit_logger()


class AuditEvent:
    """
    Un singolo evento di audit. Campi (deliberatamente SENZA indirizzo IP):

    {
        "event_id": "uuid",
        "timestamp": "2026-07-23T22:49:11Z",
        "actor_email": "admin@andreamoiochef.it",   # null se richiesta anonima
        "actor_role": "SUPERADMIN",                  # null se richiesta anonima
        "action": "UPDATE",          # READ | CREATE | UPDATE | DELETE |
                                      # LOGIN | LOGIN_FAILED |
                                      # PASSWORD_RESET_REQUESTED | PASSWORD_RESET_COMPLETED |
                                      # PASSWORD_RESET_FAILED
        "scope": "admin",            # admin | public | auth
        "resource_type": "dishes",   # ricavato dal path
        "resource_id": "7",          # ricavato dal path, se presente
        "outcome": "OK",             # OK | ERROR
        "http_status": 200,
        "latency_ms": 42
    }
    """

    def __init__(
        self,
        action: str,
        resource_type: str,
        scope: str = "",
        actor_email: Optional[str] = None,
        actor_role: Optional[str] = None,
        resource_id: Optional[str] = None,
    ):
        self.event_id = str(uuid.uuid4())
        self.action = action
        self.scope = scope
        self.resource_type = resource_type
        self.actor_email = actor_email
        self.actor_role = actor_role
        self.resource_id = resource_id
        self._start_ms: Optional[float] = None
        self.outcome = "OK"
        self.http_status = 200

    def start(self) -> "AuditEvent":
        self._start_ms = time.time() * 1000
        return self

    @property
    def latency_ms(self) -> Optional[int]:
        if self._start_ms is None:
            return None
        return int(time.time() * 1000 - self._start_ms)

    def to_dict(self) -> dict:
        return {
            "event_id": self.event_id,
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "actor_email": self.actor_email,
            "actor_role": self.actor_role,
            "action": self.action,
            "scope": self.scope,
            "resource_type": self.resource_type,
            "resource_id": self.resource_id,
            "outcome": self.outcome,
            "http_status": self.http_status,
            "latency_ms": self.latency_ms,
        }

    def to_jsonl(self) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False)


def write_audit_event(event: AuditEvent) -> None:
    """Scrive un evento di audit in append su logs/audit.log (una riga JSON)."""
    _audit_logger.info(event.to_jsonl())
