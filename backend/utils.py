"""
Funzioni di utilità varie: generazione slug, riordino drag-and-drop,
upload/eliminazione file (equivalenti di SlugUtil.java e FileStorageService.java).
"""
import re
import unicodedata
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from config import settings
from exceptions import BadRequestException


_NON_ALPHANUMERIC = re.compile(r"[^a-z0-9\s-]")
_MULTIPLE_SEPARATORS = re.compile(r"[\s-]+")


def slugify(value: str | None) -> str:
    """Genera uno slug URL-friendly (minuscolo, senza accenti, separati da
    trattini) da un testo libero. Equivalente di SlugUtil.slugify()."""
    if not value:
        return ""
    no_accents = unicodedata.normalize("NFD", value)
    no_accents = "".join(c for c in no_accents if unicodedata.category(c) != "Mn")
    lower = no_accents.lower().strip()
    cleaned = _NON_ALPHANUMERIC.sub("", lower)
    hyphenated = _MULTIPLE_SEPARATORS.sub("-", cleaned)
    return hyphenated.strip("-")


def apply_reorder(db: Session, model, ordered_ids: list[int]) -> None:
    """Applica un nuovo sort_order in base all'ordine della lista di id
    ricevuta dal frontend (drag-and-drop). Equivalente del metodo reorder()
    ripetuto in ciascun *Service.java."""
    rows = db.query(model).filter(model.id.in_(ordered_ids)).all()
    by_id = {row.id: row for row in rows}

    for order, entity_id in enumerate(ordered_ids):
        entity = by_id.get(entity_id)
        if entity is not None:
            entity.sort_order = order
            db.add(entity)


ALLOWED_IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024  # 8 MB

ALLOWED_VIDEO_CONTENT_TYPES = {"video/mp4"}
MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024  # 200 MB
VIDEO_SUBDIR = "videos"


def _extract_extension(original_filename: str | None) -> str:
    if not original_filename or "." not in original_filename:
        return ""
    ext = original_filename.rsplit(".", 1)[-1].lower()
    ext = "".join(c for c in ext if c.isalnum())
    return f".{ext}" if ext else ""


def _normalized_prefix() -> str:
    prefix = settings.upload_public_url_prefix
    return prefix[:-1] if prefix.endswith("/") else prefix


async def _store_internal(
    file: UploadFile,
    allowed_content_types: set[str],
    max_size_bytes: int,
    subdir: str | None,
    content_type_error_message: str,
    max_size_label: str,
) -> str:
    content = await file.read()

    if not content:
        raise BadRequestException("Il file è vuoto o non è stato inviato")
    if len(content) > max_size_bytes:
        raise BadRequestException(f"Il file supera la dimensione massima di {max_size_label}")
    if file.content_type not in allowed_content_types:
        raise BadRequestException(content_type_error_message)

    extension = _extract_extension(file.filename)
    filename = f"{uuid.uuid4()}{extension}"

    upload_path = Path(settings.upload_dir)
    target_dir = upload_path / subdir if subdir else upload_path
    target_dir.mkdir(parents=True, exist_ok=True)

    destination = (target_dir / filename).resolve()
    if not str(destination).startswith(str(upload_path.resolve())):
        raise BadRequestException("Nome file non valido")

    destination.write_bytes(content)

    relative_path = f"{subdir}/{filename}" if subdir else filename
    return f"{_normalized_prefix()}/{relative_path}"


async def store_image(file: UploadFile) -> str:
    """Salva un'immagine su disco con nome univoco e ne restituisce l'URL pubblico."""
    return await _store_internal(
        file,
        ALLOWED_IMAGE_CONTENT_TYPES,
        MAX_IMAGE_SIZE_BYTES,
        None,
        "Formato immagine non supportato (consentiti: JPG, PNG, WEBP, GIF, SVG)",
        "8MB",
    )


async def store_video(file: UploadFile) -> str:
    """Salva un video mp4 in una sottocartella dedicata e ne restituisce l'URL pubblico."""
    return await _store_internal(
        file,
        ALLOWED_VIDEO_CONTENT_TYPES,
        MAX_VIDEO_SIZE_BYTES,
        VIDEO_SUBDIR,
        "Formato video non supportato (è consentito solo MP4)",
        "200MB",
    )


def delete_if_managed(public_url: str | None) -> None:
    """Elimina un file precedentemente caricato dato il suo URL pubblico.
    Ignora URL esterni o non gestiti da questo storage (best-effort)."""
    if not public_url:
        return
    prefix = _normalized_prefix()
    if not public_url.startswith(prefix):
        return
    relative_path = public_url[len(prefix):].lstrip("/")
    if not relative_path:
        return
    try:
        upload_path = Path(settings.upload_dir).resolve()
        target = (upload_path / relative_path).resolve()
        if not str(target).startswith(str(upload_path)):
            return  # path traversal: ignorato
        target.unlink(missing_ok=True)
    except OSError:
        pass  # best-effort: un file orfano non blocca l'operazione principale

