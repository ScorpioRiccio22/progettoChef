"""
Tutti gli endpoint dell'API in un unico file, organizzati per risorsa con
commenti di sezione. Equivalente di tutti i *Controller.java del progetto
originale, qui riuniti invece che sparsi in package/file separati.
"""
import csv
import io
import threading
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Depends, File, Query, Response, UploadFile, status
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from exceptions import BadRequestException, ConflictException, InvalidCredentialsException, NotFoundException
from models import (
    AdminRole,
    AdminUser,
    ContactMessage,
    CoreValue,
    Dish,
    EventType,
    Menu,
    MenuItem,
    Milestone,
    NewsletterSubscriber,
    ServiceOffering,
    SiteSettings,
    SiteText,
    Testimonial,
)
from schemas import (
    AboutPageDto,
    AdminResetPasswordRequest,
    AdminUserDto,
    ChangeOwnPasswordRequest,
    ContactMessageDto,
    ContactMessageRequest,
    CoreValueDto,
    CoreValueRequest,
    CreateAdminUserRequest,
    DishDto,
    DishRequest,
    EventTypeDto,
    EventTypeRequest,
    GoogleReviewDto,
    GoogleReviewsResponseDto,
    LoginRequest,
    LoginResponse,
    MenuDto,
    MenuItemDto,
    MenuItemRequest,
    MenuRequest,
    MilestoneDto,
    MilestoneRequest,
    NewsletterSubscribeRequest,
    NewsletterSubscriberDto,
    ReorderRequest,
    ServiceOfferingDto,
    ServiceOfferingRequest,
    SiteSettingsDto,
    SiteTextDto,
    SiteTextRequest,
    TestimonialDto,
    TestimonialRequest,
    UpdateAdminRoleRequest,
    UpdateAdminStatusRequest,
    UploadResponse,
)
from security import (
    create_access_token,
    expiration_seconds,
    get_current_user,
    hash_password,
    require_admin_or_superadmin,
    require_any_admin,
    require_superadmin,
    verify_password,
)
from utils import apply_reorder, delete_if_managed, slugify, store_image, store_video


# ============================================================================
# auth.py
# ============================================================================
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


@auth_router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    """Login per l'area admin. Pubblico (non richiede token)."""
    user = db.query(AdminUser).filter(AdminUser.email.ilike(request.email)).first()
    if user is None or not verify_password(request.password, user.password_hash):
        raise InvalidCredentialsException("Email o password non corretti")
    if not user.enabled:
        raise InvalidCredentialsException("Email o password non corretti")

    user.last_login_at = datetime.now(timezone.utc)
    db.add(user)
    db.flush()

    token = create_access_token(user.email, user.role)
    return LoginResponse(
        accessToken=token,
        expiresInSeconds=expiration_seconds(),
        user=AdminUserDto.from_entity(user),
    )


@auth_router.get("/me", response_model=AdminUserDto)
def me(current_user: AdminUser = Depends(get_current_user)) -> AdminUserDto:
    """Utente correntemente autenticato, in base al token JWT inviato."""
    return AdminUserDto.from_entity(current_user)


@auth_router.patch("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_own_password(
    request: ChangeOwnPasswordRequest,
    current_user: AdminUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Cambio password personale, disponibile per qualunque admin autenticato,
    previa verifica della password attuale."""
    if not verify_password(request.currentPassword, current_user.password_hash):
        raise InvalidCredentialsException("La password attuale non è corretta")
    current_user.password_hash = hash_password(request.newPassword)
    db.add(current_user)


@auth_router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout() -> None:
    """Con JWT stateless non c'è nulla da invalidare lato server: il
    frontend scarta semplicemente il token."""
    return None



# ============================================================================
# admin_accounts.py
# ============================================================================
accounts_router = APIRouter(
    prefix="/api/admin/accounts",
    tags=["admin-accounts"],
    dependencies=[Depends(require_superadmin)],
)


def _accounts_parse_role(raw_role: str) -> AdminRole:
    try:
        return AdminRole(raw_role.strip().upper())
    except ValueError:
        raise BadRequestException(f"Ruolo non valido: {raw_role}")


def _accounts_find_or_404(db: Session, user_id: int) -> AdminUser:
    user = db.get(AdminUser, user_id)
    if user is None:
        raise NotFoundException("Account non trovato")
    return user


def _accounts_is_last_active_superadmin(db: Session, target: AdminUser) -> bool:
    active_superadmins = (
        db.query(AdminUser)
        .filter(AdminUser.role == AdminRole.SUPERADMIN, AdminUser.enabled.is_(True))
        .count()
    )
    return target.enabled and active_superadmins <= 1


@accounts_router.get("", response_model=list[AdminUserDto])
def list_accounts(db: Session = Depends(get_db)) -> list[AdminUserDto]:
    users = db.query(AdminUser).order_by(AdminUser.created_at.asc()).all()
    return [AdminUserDto.from_entity(u) for u in users]


@accounts_router.post("", response_model=AdminUserDto)
def create_account(request: CreateAdminUserRequest, db: Session = Depends(get_db)) -> AdminUserDto:
    email = request.email.strip().lower()
    exists = db.query(AdminUser).filter(AdminUser.email.ilike(email)).first()
    if exists is not None:
        raise ConflictException("Esiste già un account con questa email")

    role = _accounts_parse_role(request.role)
    user = AdminUser(
        email=email,
        password_hash=hash_password(request.password),
        full_name=request.fullName.strip(),
        role=role,
        enabled=True,
    )
    db.add(user)
    db.flush()
    return AdminUserDto.from_entity(user)


@accounts_router.patch("/{account_id}/role", response_model=AdminUserDto)
def update_role(account_id: int, request: UpdateAdminRoleRequest, db: Session = Depends(get_db)) -> AdminUserDto:
    target = _accounts_find_or_404(db, account_id)
    new_role = _accounts_parse_role(request.role)

    if target.role == AdminRole.SUPERADMIN and new_role != AdminRole.SUPERADMIN and _accounts_is_last_active_superadmin(db, target):
        raise BadRequestException("Non è possibile degradare l'ultimo SUPERADMIN attivo")

    target.role = new_role
    db.add(target)
    db.flush()
    return AdminUserDto.from_entity(target)


@accounts_router.patch("/{account_id}/status", response_model=AdminUserDto)
def update_status(
    account_id: int,
    request: UpdateAdminStatusRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_superadmin),
) -> AdminUserDto:
    target = _accounts_find_or_404(db, account_id)

    if not request.enabled:
        if target.email.lower() == current_user.email.lower():
            raise BadRequestException("Non puoi disabilitare il tuo stesso account")
        if target.role == AdminRole.SUPERADMIN and _accounts_is_last_active_superadmin(db, target):
            raise BadRequestException("Non è possibile disabilitare l'ultimo SUPERADMIN attivo")

    target.enabled = request.enabled
    db.add(target)
    db.flush()
    return AdminUserDto.from_entity(target)


@accounts_router.post("/{account_id}/reset-password", status_code=status.HTTP_204_NO_CONTENT)
def reset_password(account_id: int, request: AdminResetPasswordRequest, db: Session = Depends(get_db)) -> None:
    target = _accounts_find_or_404(db, account_id)
    target.password_hash = hash_password(request.newPassword)
    db.add(target)


@accounts_router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(require_superadmin),
) -> None:
    target = _accounts_find_or_404(db, account_id)

    if target.email.lower() == current_user.email.lower():
        raise BadRequestException("Non puoi eliminare il tuo stesso account")
    if target.role == AdminRole.SUPERADMIN and _accounts_is_last_active_superadmin(db, target):
        raise BadRequestException("Non è possibile eliminare l'ultimo SUPERADMIN attivo")

    db.delete(target)



# ============================================================================
# dishes.py
# ============================================================================
dishes_admin_router = APIRouter(
    prefix="/api/admin/dishes", tags=["admin-dishes"], dependencies=[Depends(require_any_admin)]
)
dishes_public_router = APIRouter(prefix="/api/public/dishes", tags=["public-dishes"])


def _dish_find_or_404(db: Session, dish_id: int) -> Dish:
    dish = db.get(Dish, dish_id)
    if dish is None:
        raise NotFoundException(f"Piatto non trovato (id {dish_id})")
    return dish


def _dish_next_sort_order(db: Session) -> int:
    return db.query(Dish).count()


def _dish_apply_request(entity: Dish, request: DishRequest) -> None:
    entity.name = request.name
    entity.category = request.category
    entity.description = request.description
    entity.image_url = request.imageUrl
    entity.tags = list(request.tags) if request.tags else []
    entity.published = request.published if request.published is not None else True


@dishes_admin_router.get("", response_model=list[DishDto])
def list_all(db: Session = Depends(get_db)) -> list[DishDto]:
    dishes = db.query(Dish).order_by(Dish.sort_order.asc()).all()
    return [DishDto.from_entity(d) for d in dishes]


@dishes_admin_router.post("", response_model=DishDto)
def create(request: DishRequest, db: Session = Depends(get_db)) -> DishDto:
    entity = Dish()
    _dish_apply_request(entity, request)
    entity.sort_order = _dish_next_sort_order(db)
    db.add(entity)
    db.flush()
    return DishDto.from_entity(entity)


@dishes_admin_router.put("/{dish_id}", response_model=DishDto)
def update(dish_id: int, request: DishRequest, db: Session = Depends(get_db)) -> DishDto:
    entity = _dish_find_or_404(db, dish_id)
    _dish_apply_request(entity, request)
    db.add(entity)
    db.flush()
    return DishDto.from_entity(entity)


@dishes_admin_router.delete("/{dish_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(dish_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_dish_find_or_404(db, dish_id))


@dishes_admin_router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder(request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    apply_reorder(db, Dish, request.orderedIds)


@dishes_public_router.get("", response_model=list[DishDto])
def list_published(db: Session = Depends(get_db)) -> list[DishDto]:
    dishes = (
        db.query(Dish)
        .filter(Dish.published.is_(True))
        .order_by(Dish.sort_order.asc())
        .all()
    )
    return [DishDto.from_entity(d) for d in dishes]



# ============================================================================
# event_types.py
# ============================================================================
event_types_admin_router = APIRouter(
    prefix="/api/admin/event-types", tags=["admin-event-types"], dependencies=[Depends(require_any_admin)]
)
event_types_public_router = APIRouter(prefix="/api/public/event-types", tags=["public-event-types"])


def _event_type_find_or_404(db: Session, entity_id: int) -> EventType:
    entity = db.get(EventType, entity_id)
    if entity is None:
        raise NotFoundException(f"Tipologia di evento non trovata (id {entity_id})")
    return entity


def _event_type_is_slug_taken(db: Session, slug: str, current_id: int | None) -> bool:
    existing = db.query(EventType).filter(EventType.slug == slug).first()
    return existing is not None and existing.id != current_id


def _event_type_resolve_slug(db: Session, requested_slug: str | None, title: str, current_id: int | None) -> str:
    base = slugify(requested_slug) if requested_slug else slugify(title)
    if not base:
        base = "evento"
    candidate = base
    suffix = 2
    while _event_type_is_slug_taken(db, candidate, current_id):
        candidate = f"{base}-{suffix}"
        suffix += 1
    return candidate


def _event_type_apply_request(db: Session, entity: EventType, request: EventTypeRequest, current_id: int | None) -> None:
    entity.title = request.title
    entity.description = request.description
    entity.body_content = request.bodyContent
    entity.icon = request.icon
    entity.image_url = request.imageUrl
    entity.video_url = request.videoUrl
    entity.details = list(request.details) if request.details else []
    entity.gallery_image_urls = list(request.galleryImageUrls) if request.galleryImageUrls else []
    entity.published = request.published if request.published is not None else True
    entity.slug = _event_type_resolve_slug(db, request.slug, request.title, current_id)


@event_types_admin_router.get("", response_model=list[EventTypeDto])
def list_all(db: Session = Depends(get_db)) -> list[EventTypeDto]:
    rows = db.query(EventType).order_by(EventType.sort_order.asc()).all()
    return [EventTypeDto.from_entity(e) for e in rows]


@event_types_admin_router.post("", response_model=EventTypeDto)
def create(request: EventTypeRequest, db: Session = Depends(get_db)) -> EventTypeDto:
    entity = EventType()
    _event_type_apply_request(db, entity, request, None)
    entity.sort_order = db.query(EventType).count()
    db.add(entity)
    db.flush()
    return EventTypeDto.from_entity(entity)


@event_types_admin_router.put("/{entity_id}", response_model=EventTypeDto)
def update(entity_id: int, request: EventTypeRequest, db: Session = Depends(get_db)) -> EventTypeDto:
    entity = _event_type_find_or_404(db, entity_id)
    previous_video_url = entity.video_url
    _event_type_apply_request(db, entity, request, entity_id)
    db.add(entity)
    db.flush()
    dto = EventTypeDto.from_entity(entity)

    # Il video è pesante: se è stato sostituito o rimosso, ripuliamo il file precedente.
    if previous_video_url and previous_video_url != entity.video_url:
        delete_if_managed(previous_video_url)
    return dto


@event_types_admin_router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(entity_id: int, db: Session = Depends(get_db)) -> None:
    entity = _event_type_find_or_404(db, entity_id)
    video_url = entity.video_url
    db.delete(entity)
    db.flush()
    delete_if_managed(video_url)


@event_types_admin_router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder(request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    apply_reorder(db, EventType, request.orderedIds)


@event_types_public_router.get("", response_model=list[EventTypeDto])
def list_published(db: Session = Depends(get_db)) -> list[EventTypeDto]:
    rows = (
        db.query(EventType)
        .filter(EventType.published.is_(True))
        .order_by(EventType.sort_order.asc())
        .all()
    )
    return [EventTypeDto.from_entity(e) for e in rows]


@event_types_public_router.get("/{slug}", response_model=EventTypeDto)
def get_by_slug(slug: str, db: Session = Depends(get_db)) -> EventTypeDto:
    entity = (
        db.query(EventType)
        .filter(EventType.slug == slug, EventType.published.is_(True))
        .first()
    )
    if entity is None:
        raise NotFoundException(f"Evento non trovato: {slug}")
    return EventTypeDto.from_entity(entity)



# ============================================================================
# services.py
# ============================================================================
services_admin_router = APIRouter(
    prefix="/api/admin/services", tags=["admin-services"], dependencies=[Depends(require_any_admin)]
)
services_public_router = APIRouter(prefix="/api/public/services", tags=["public-services"])


def _service_find_or_404(db: Session, entity_id: int) -> ServiceOffering:
    entity = db.get(ServiceOffering, entity_id)
    if entity is None:
        raise NotFoundException(f"Servizio non trovato (id {entity_id})")
    return entity


def _service_is_slug_taken(db: Session, slug: str, current_id: int | None) -> bool:
    existing = db.query(ServiceOffering).filter(ServiceOffering.slug == slug).first()
    return existing is not None and existing.id != current_id


def _service_resolve_slug(db: Session, requested_slug: str | None, title: str, current_id: int | None) -> str:
    base = slugify(requested_slug) if requested_slug else slugify(title)
    if not base:
        base = "servizio"
    candidate = base
    suffix = 2
    while _service_is_slug_taken(db, candidate, current_id):
        candidate = f"{base}-{suffix}"
        suffix += 1
    return candidate


def _service_apply_request(db: Session, entity: ServiceOffering, request: ServiceOfferingRequest, current_id: int | None) -> None:
    entity.title = request.title
    entity.tagline = request.tagline
    entity.description = request.description
    entity.body_content = request.bodyContent
    entity.icon = request.icon
    entity.image_url = request.imageUrl
    entity.video_url = request.videoUrl
    entity.gallery_image_urls = list(request.galleryImageUrls) if request.galleryImageUrls else []
    entity.published = request.published if request.published is not None else True
    entity.slug = _service_resolve_slug(db, request.slug, request.title, current_id)


@services_admin_router.get("", response_model=list[ServiceOfferingDto])
def list_all(db: Session = Depends(get_db)) -> list[ServiceOfferingDto]:
    rows = db.query(ServiceOffering).order_by(ServiceOffering.sort_order.asc()).all()
    return [ServiceOfferingDto.from_entity(s) for s in rows]


@services_admin_router.post("", response_model=ServiceOfferingDto)
def create(request: ServiceOfferingRequest, db: Session = Depends(get_db)) -> ServiceOfferingDto:
    entity = ServiceOffering()
    _service_apply_request(db, entity, request, None)
    entity.sort_order = db.query(ServiceOffering).count()
    db.add(entity)
    db.flush()
    return ServiceOfferingDto.from_entity(entity)


@services_admin_router.put("/{entity_id}", response_model=ServiceOfferingDto)
def update(entity_id: int, request: ServiceOfferingRequest, db: Session = Depends(get_db)) -> ServiceOfferingDto:
    entity = _service_find_or_404(db, entity_id)
    previous_video_url = entity.video_url
    _service_apply_request(db, entity, request, entity_id)
    db.add(entity)
    db.flush()
    dto = ServiceOfferingDto.from_entity(entity)

    if previous_video_url and previous_video_url != entity.video_url:
        delete_if_managed(previous_video_url)
    return dto


@services_admin_router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(entity_id: int, db: Session = Depends(get_db)) -> None:
    entity = _service_find_or_404(db, entity_id)
    video_url = entity.video_url
    db.delete(entity)
    db.flush()
    delete_if_managed(video_url)


@services_admin_router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder(request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    apply_reorder(db, ServiceOffering, request.orderedIds)


@services_public_router.get("", response_model=list[ServiceOfferingDto])
def list_published(db: Session = Depends(get_db)) -> list[ServiceOfferingDto]:
    rows = (
        db.query(ServiceOffering)
        .filter(ServiceOffering.published.is_(True))
        .order_by(ServiceOffering.sort_order.asc())
        .all()
    )
    return [ServiceOfferingDto.from_entity(s) for s in rows]


@services_public_router.get("/{slug}", response_model=ServiceOfferingDto)
def get_by_slug(slug: str, db: Session = Depends(get_db)) -> ServiceOfferingDto:
    entity = (
        db.query(ServiceOffering)
        .filter(ServiceOffering.slug == slug, ServiceOffering.published.is_(True))
        .first()
    )
    if entity is None:
        raise NotFoundException(f"Servizio non trovato: {slug}")
    return ServiceOfferingDto.from_entity(entity)



# ============================================================================
# testimonials.py
# ============================================================================
testimonials_admin_router = APIRouter(
    prefix="/api/admin/testimonials", tags=["admin-testimonials"], dependencies=[Depends(require_any_admin)]
)
testimonials_public_router = APIRouter(prefix="/api/public/testimonials", tags=["public-testimonials"])


def _testimonial_find_or_404(db: Session, entity_id: int) -> Testimonial:
    entity = db.get(Testimonial, entity_id)
    if entity is None:
        raise NotFoundException(f"Recensione non trovata (id {entity_id})")
    return entity


def _testimonial_apply_request(entity: Testimonial, request: TestimonialRequest) -> None:
    entity.author = request.author
    entity.role = request.role
    entity.quote = request.quote
    entity.published = request.published if request.published is not None else True


@testimonials_admin_router.get("", response_model=list[TestimonialDto])
def list_all(db: Session = Depends(get_db)) -> list[TestimonialDto]:
    rows = db.query(Testimonial).order_by(Testimonial.sort_order.asc()).all()
    return [TestimonialDto.from_entity(t) for t in rows]


@testimonials_admin_router.post("", response_model=TestimonialDto)
def create(request: TestimonialRequest, db: Session = Depends(get_db)) -> TestimonialDto:
    entity = Testimonial()
    _testimonial_apply_request(entity, request)
    entity.sort_order = db.query(Testimonial).count()
    db.add(entity)
    db.flush()
    return TestimonialDto.from_entity(entity)


@testimonials_admin_router.put("/{entity_id}", response_model=TestimonialDto)
def update(entity_id: int, request: TestimonialRequest, db: Session = Depends(get_db)) -> TestimonialDto:
    entity = _testimonial_find_or_404(db, entity_id)
    _testimonial_apply_request(entity, request)
    db.add(entity)
    db.flush()
    return TestimonialDto.from_entity(entity)


@testimonials_admin_router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(entity_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_testimonial_find_or_404(db, entity_id))


@testimonials_admin_router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder(request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    apply_reorder(db, Testimonial, request.orderedIds)


@testimonials_public_router.get("", response_model=list[TestimonialDto])
def list_published(db: Session = Depends(get_db)) -> list[TestimonialDto]:
    rows = (
        db.query(Testimonial)
        .filter(Testimonial.published.is_(True))
        .order_by(Testimonial.sort_order.asc())
        .all()
    )
    return [TestimonialDto.from_entity(t) for t in rows]



# ============================================================================
# milestones.py
# ============================================================================
milestones_router = APIRouter(
    prefix="/api/admin/milestones", tags=["admin-milestones"], dependencies=[Depends(require_any_admin)]
)


def _milestone_find_or_404(db: Session, entity_id: int) -> Milestone:
    entity = db.get(Milestone, entity_id)
    if entity is None:
        raise NotFoundException(f"Tappa non trovata (id {entity_id})")
    return entity


@milestones_router.get("", response_model=list[MilestoneDto])
def list_all(db: Session = Depends(get_db)) -> list[MilestoneDto]:
    rows = db.query(Milestone).order_by(Milestone.sort_order.asc()).all()
    return [MilestoneDto.from_entity(m) for m in rows]


@milestones_router.post("", response_model=MilestoneDto)
def create(request: MilestoneRequest, db: Session = Depends(get_db)) -> MilestoneDto:
    entity = Milestone(year=request.year, text=request.text, sort_order=db.query(Milestone).count())
    db.add(entity)
    db.flush()
    return MilestoneDto.from_entity(entity)


@milestones_router.put("/{entity_id}", response_model=MilestoneDto)
def update(entity_id: int, request: MilestoneRequest, db: Session = Depends(get_db)) -> MilestoneDto:
    entity = _milestone_find_or_404(db, entity_id)
    entity.year = request.year
    entity.text = request.text
    db.add(entity)
    db.flush()
    return MilestoneDto.from_entity(entity)


@milestones_router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(entity_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_milestone_find_or_404(db, entity_id))


@milestones_router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder(request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    apply_reorder(db, Milestone, request.orderedIds)



# ============================================================================
# core_values.py
# ============================================================================
core_values_router = APIRouter(
    prefix="/api/admin/core-values", tags=["admin-core-values"], dependencies=[Depends(require_any_admin)]
)


def _core_value_find_or_404(db: Session, entity_id: int) -> CoreValue:
    entity = db.get(CoreValue, entity_id)
    if entity is None:
        raise NotFoundException(f"Valore non trovato (id {entity_id})")
    return entity


@core_values_router.get("", response_model=list[CoreValueDto])
def list_all(db: Session = Depends(get_db)) -> list[CoreValueDto]:
    rows = db.query(CoreValue).order_by(CoreValue.sort_order.asc()).all()
    return [CoreValueDto.from_entity(v) for v in rows]


@core_values_router.post("", response_model=CoreValueDto)
def create(request: CoreValueRequest, db: Session = Depends(get_db)) -> CoreValueDto:
    entity = CoreValue(title=request.title, text=request.text, sort_order=db.query(CoreValue).count())
    db.add(entity)
    db.flush()
    return CoreValueDto.from_entity(entity)


@core_values_router.put("/{entity_id}", response_model=CoreValueDto)
def update(entity_id: int, request: CoreValueRequest, db: Session = Depends(get_db)) -> CoreValueDto:
    entity = _core_value_find_or_404(db, entity_id)
    entity.title = request.title
    entity.text = request.text
    db.add(entity)
    db.flush()
    return CoreValueDto.from_entity(entity)


@core_values_router.delete("/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(entity_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_core_value_find_or_404(db, entity_id))


@core_values_router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder(request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    apply_reorder(db, CoreValue, request.orderedIds)



# ============================================================================
# menus.py
# ============================================================================
menus_admin_router = APIRouter(
    prefix="/api/admin/menus", tags=["admin-menus"], dependencies=[Depends(require_any_admin)]
)
menus_public_router = APIRouter(prefix="/api/public/menus", tags=["public-menus"])

DEFAULT_TYPE = "SHOP"
VALID_TYPES = {"SHOP", "EVENTS"}


def _menu_normalize_type(raw_type: str | None) -> str:
    if not raw_type or not raw_type.strip():
        return DEFAULT_TYPE
    normalized = raw_type.strip().upper()
    if normalized not in VALID_TYPES:
        raise BadRequestException(f"Tipo di menu non valido: {raw_type}")
    return normalized


def _menu_find_or_404(db: Session, menu_id: int) -> Menu:
    menu = db.get(Menu, menu_id)
    if menu is None:
        raise NotFoundException(f"Menu non trovato (id {menu_id})")
    return menu


def _menu_find_item_or_404(db: Session, menu_id: int, item_id: int) -> MenuItem:
    item = db.get(MenuItem, item_id)
    if item is None or item.menu_id != menu_id:
        raise NotFoundException(f"Voce di menu non trovata (id {item_id})")
    return item


def _menu_to_dto(db: Session, menu: Menu) -> MenuDto:
    items = (
        db.query(MenuItem)
        .filter(MenuItem.menu_id == menu.id)
        .order_by(MenuItem.sort_order.asc())
        .all()
    )
    return MenuDto.from_entity(menu, [MenuItemDto.from_entity(i) for i in items])


def _menu_activate(db: Session, menu_id: int) -> MenuDto:
    """Rende questo l'unico menu attivo per il suo tipo, disattivando gli altri dello stesso tipo."""
    target = _menu_find_or_404(db, menu_id)
    current_active = (
        db.query(Menu)
        .filter(Menu.type == target.type, Menu.active.is_(True), Menu.id != menu_id)
        .first()
    )
    if current_active is not None:
        current_active.active = False
        db.add(current_active)

    target.active = True
    db.add(target)
    db.flush()
    return _menu_to_dto(db, target)


@menus_admin_router.get("", response_model=list[MenuDto])
def list_all(type: str = Query(default="SHOP"), db: Session = Depends(get_db)) -> list[MenuDto]:
    menu_type = _menu_normalize_type(type)
    rows = db.query(Menu).filter(Menu.type == menu_type).order_by(Menu.sort_order.asc()).all()
    return [_menu_to_dto(db, m) for m in rows]


@menus_admin_router.post("", response_model=MenuDto)
def create(request: MenuRequest, db: Session = Depends(get_db)) -> MenuDto:
    menu_type = _menu_normalize_type(request.type)
    entity = Menu(
        name=request.name,
        type=menu_type,
        description=request.description,
        sort_order=db.query(Menu).filter(Menu.type == menu_type).count(),
    )
    db.add(entity)
    db.flush()

    if request.active is True:
        return _menu_activate(db, entity.id)
    return _menu_to_dto(db, entity)


@menus_admin_router.put("/{menu_id}", response_model=MenuDto)
def update(menu_id: int, request: MenuRequest, db: Session = Depends(get_db)) -> MenuDto:
    entity = _menu_find_or_404(db, menu_id)
    entity.name = request.name
    entity.description = request.description
    db.add(entity)
    db.flush()

    if request.active is True and not entity.active:
        return _menu_activate(db, entity.id)
    if request.active is False and entity.active:
        entity.active = False
        db.add(entity)
        db.flush()

    return _menu_to_dto(db, entity)


@menus_admin_router.put("/{menu_id}/activate", response_model=MenuDto)
def activate(menu_id: int, db: Session = Depends(get_db)) -> MenuDto:
    return _menu_activate(db, menu_id)


@menus_admin_router.put("/{menu_id}/deactivate", status_code=status.HTTP_204_NO_CONTENT)
def deactivate(menu_id: int, db: Session = Depends(get_db)) -> None:
    entity = _menu_find_or_404(db, menu_id)
    entity.active = False
    db.add(entity)


@menus_admin_router.delete("/{menu_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(menu_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_menu_find_or_404(db, menu_id))


@menus_admin_router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder(request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    rows = db.query(Menu).filter(Menu.id.in_(request.orderedIds)).all()
    by_id = {m.id: m for m in rows}
    for order, menu_id in enumerate(request.orderedIds):
        menu = by_id.get(menu_id)
        if menu is not None:
            menu.sort_order = order
            db.add(menu)


# --- Voci del menu (piatti + prezzo) -----------------------------------------

@menus_admin_router.post("/{menu_id}/items", response_model=MenuItemDto)
def add_item(menu_id: int, request: MenuItemRequest, db: Session = Depends(get_db)) -> MenuItemDto:
    _menu_find_or_404(db, menu_id)  # valida che il menu esista
    next_order = db.query(MenuItem).filter(MenuItem.menu_id == menu_id).count()
    item = MenuItem(
        menu_id=menu_id,
        name=request.name,
        category=request.category,
        description=request.description,
        image_url=request.imageUrl,
        price=request.price,
        sort_order=next_order,
    )
    db.add(item)
    db.flush()
    return MenuItemDto.from_entity(item)


@menus_admin_router.put("/{menu_id}/items/{item_id}", response_model=MenuItemDto)
def update_item(menu_id: int, item_id: int, request: MenuItemRequest, db: Session = Depends(get_db)) -> MenuItemDto:
    item = _menu_find_item_or_404(db, menu_id, item_id)
    item.name = request.name
    item.category = request.category
    item.description = request.description
    item.image_url = request.imageUrl
    item.price = request.price
    db.add(item)
    db.flush()
    return MenuItemDto.from_entity(item)


@menus_admin_router.delete("/{menu_id}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(menu_id: int, item_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_menu_find_item_or_404(db, menu_id, item_id))


@menus_admin_router.put("/{menu_id}/items/reorder", status_code=status.HTTP_204_NO_CONTENT)
def reorder_items(menu_id: int, request: ReorderRequest, db: Session = Depends(get_db)) -> None:
    rows = (
        db.query(MenuItem)
        .filter(MenuItem.id.in_(request.orderedIds), MenuItem.menu_id == menu_id)
        .all()
    )
    by_id = {i.id: i for i in rows}
    for order, item_id in enumerate(request.orderedIds):
        item = by_id.get(item_id)
        if item is not None:
            item.sort_order = order
            db.add(item)


# --- Endpoint pubblico ------------------------------------------------------

@menus_public_router.get("/active", response_model=MenuDto | None)
def active(type: str = Query(default="SHOP"), db: Session = Depends(get_db)):
    """Il menu attualmente "in vetrina" per il tipo indicato (SHOP o EVENTS)."""
    menu_type = _menu_normalize_type(type)
    menu = db.query(Menu).filter(Menu.type == menu_type, Menu.active.is_(True)).first()
    if menu is None:
        return None
    return _menu_to_dto(db, menu)



# ============================================================================
# site_settings.py
# ============================================================================
site_settings_admin_router = APIRouter(
    prefix="/api/admin/site-settings",
    tags=["admin-site-settings"],
    dependencies=[Depends(require_admin_or_superadmin)],
)
site_settings_public_router = APIRouter(prefix="/api/public/site-settings", tags=["public-site-settings"])


def _site_settings_create_default(db: Session) -> SiteSettings:
    settings = SiteSettings(
        id=1,
        brand_name="Andrea Moio",
        brand_handle="@chefandreamoio",
        brand_role="Chef",
        brand_city="Napoli",
        brand_payoff="Tradizione napoletana, su misura per i tuoi eventi",
        contact_email="info@andreamoiochef.it",
        whatsapp_number="+39 000 000 0000",
        whatsapp_link="https://wa.me/390000000000",
        contact_area="Napoli e provincia",
        # Placeholder: da sostituire con l'indirizzo reale dal pannello admin.
        # Finché resta vuoto, la mini mappa nella pagina Contatti non viene mostrata.
        map_address=None,
        instagram_url="https://instagram.com/chefandreamoio",
        facebook_url="https://facebook.com/Chefmoioandrea",
        tiktok_url="https://tiktok.com/@chefandreamoio",
        threads_url="https://threads.net/@chefandreamoio",
        hero_title="La cucina napoletana, portata a casa tua.",
        hero_subtitle=(
            "Chef a domicilio per cene private, eventi e nuove attività "
            "che vogliono partire con il piede giusto in cucina."
        ),
        about_intro=(
            "Cresciuto tra i fornelli di casa e le cucine professionali di Napoli, "
            "porto la tradizione partenopea dove serve davvero: sulla tua tavola."
        ),
        stat_years_value="8+",
        stat_years_label="anni di esperienza",
        stat_events_value="150+",
        stat_events_label="eventi curati",
        stat_ingredients_value="100%",
        stat_ingredients_label="materie prime locali",
    )
    db.add(settings)
    db.flush()
    return settings


def _site_settings_get_or_create(db: Session) -> SiteSettings:
    """Restituisce l'unica riga di impostazioni, creandola con valori di
    default se non esiste ancora (prima richiesta dopo il deploy)."""
    settings = db.get(SiteSettings, 1)
    if settings is None:
        settings = _site_settings_create_default(db)
    return settings


@site_settings_admin_router.get("", response_model=SiteSettingsDto)
def get_admin(db: Session = Depends(get_db)) -> SiteSettingsDto:
    return SiteSettingsDto.from_entity(_site_settings_get_or_create(db))


@site_settings_admin_router.put("", response_model=SiteSettingsDto)
def update(request: SiteSettingsDto, db: Session = Depends(get_db)) -> SiteSettingsDto:
    settings = _site_settings_get_or_create(db)
    request.apply_to(settings)
    db.add(settings)
    db.flush()
    return SiteSettingsDto.from_entity(settings)


@site_settings_public_router.get("", response_model=SiteSettingsDto)
def get_public(db: Session = Depends(get_db)) -> SiteSettingsDto:
    return SiteSettingsDto.from_entity(_site_settings_get_or_create(db))



# ============================================================================
# site_texts.py
# ============================================================================
site_texts_admin_router = APIRouter(
    prefix="/api/admin/site-texts", tags=["admin-site-texts"], dependencies=[Depends(require_any_admin)]
)
site_texts_public_router = APIRouter(prefix="/api/public/site-texts", tags=["public-site-texts"])


@site_texts_admin_router.get("", response_model=list[SiteTextDto])
def list_all(db: Session = Depends(get_db)) -> list[SiteTextDto]:
    rows = db.query(SiteText).order_by(SiteText.category.asc(), SiteText.sort_order.asc()).all()
    return [SiteTextDto.from_entity(t) for t in rows]


@site_texts_admin_router.put("/{key}", response_model=SiteTextDto)
def update(key: str, request: SiteTextRequest, db: Session = Depends(get_db)) -> SiteTextDto:
    entity = db.query(SiteText).filter(SiteText.key == key).first()
    if entity is None:
        raise NotFoundException(f"Testo non trovato: {key}")
    entity.value = request.value
    db.add(entity)
    db.flush()
    return SiteTextDto.from_entity(entity)


@site_texts_public_router.get("", response_model=dict[str, str])
def get_all_as_map(db: Session = Depends(get_db)) -> dict[str, str]:
    """Tutti i testi come mappa chiave -> valore, per un singolo fetch
    efficiente dal sito pubblico."""
    rows = db.query(SiteText).all()
    return {t.key: t.value for t in rows}



# ============================================================================
# about.py
# ============================================================================
about_router = APIRouter(prefix="/api/public/about", tags=["public-about"])


@about_router.get("", response_model=AboutPageDto)
def get(db: Session = Depends(get_db)) -> AboutPageDto:
    milestones = db.query(Milestone).order_by(Milestone.sort_order.asc()).all()
    values = db.query(CoreValue).order_by(CoreValue.sort_order.asc()).all()
    return AboutPageDto(
        milestones=[MilestoneDto.from_entity(m) for m in milestones],
        values=[CoreValueDto.from_entity(v) for v in values],
    )



# ============================================================================
# contact.py
# ============================================================================
contact_admin_router = APIRouter(
    prefix="/api/admin/contact-messages",
    tags=["admin-contact-messages"],
    dependencies=[Depends(require_admin_or_superadmin)],
)
contact_public_router = APIRouter(prefix="/api/public/contact", tags=["public-contact"])


def _contact_find_or_404(db: Session, message_id: int) -> ContactMessage:
    entity = db.get(ContactMessage, message_id)
    if entity is None:
        raise NotFoundException(f"Messaggio non trovato (id {message_id})")
    return entity


@contact_admin_router.get("", response_model=list[ContactMessageDto])
def list_all(db: Session = Depends(get_db)) -> list[ContactMessageDto]:
    rows = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [ContactMessageDto.from_entity(m) for m in rows]


@contact_admin_router.get("/unread-count", response_model=dict[str, int])
def unread_count(db: Session = Depends(get_db)) -> dict[str, int]:
    count = db.query(ContactMessage).filter(ContactMessage.read.is_(False)).count()
    return {"count": count}


@contact_admin_router.patch("/{message_id}/read", response_model=ContactMessageDto)
def mark_read(message_id: int, read: bool = Query(default=True), db: Session = Depends(get_db)) -> ContactMessageDto:
    message = _contact_find_or_404(db, message_id)
    message.read = read
    db.add(message)
    db.flush()
    return ContactMessageDto.from_entity(message)


@contact_admin_router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(message_id: int, db: Session = Depends(get_db)) -> None:
    db.delete(_contact_find_or_404(db, message_id))


@contact_admin_router.get("/export")
def export(db: Session = Depends(get_db)) -> Response:
    rows = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer, quoting=csv.QUOTE_ALL)
    writer.writerow(["Data", "Nome", "Email", "Telefono", "Oggetto", "Messaggio", "Letto"])
    for m in rows:
        writer.writerow([
            m.created_at.strftime("%d/%m/%Y %H:%M"),
            m.name, m.email, m.phone or "", m.subject, m.message,
            "Sì" if m.read else "No",
        ])

    return Response(
        content=buffer.getvalue(),
        media_type="text/csv; charset=UTF-8",
        headers={"Content-Disposition": 'attachment; filename="messaggi-contatto.csv"'},
    )


@contact_public_router.post("", status_code=status.HTTP_204_NO_CONTENT)
def submit(request: ContactMessageRequest, db: Session = Depends(get_db)) -> None:
    message = ContactMessage(
        name=request.name, email=request.email, phone=request.phone,
        subject=request.subject, message=request.message,
    )
    db.add(message)



# ============================================================================
# newsletter.py
# ============================================================================
newsletter_admin_router = APIRouter(
    prefix="/api/admin/newsletter-subscribers",
    tags=["admin-newsletter-subscribers"],
    dependencies=[Depends(require_admin_or_superadmin)],
)
newsletter_public_router = APIRouter(prefix="/api/public/newsletter", tags=["public-newsletter"])


@newsletter_admin_router.get("", response_model=list[NewsletterSubscriberDto])
def list_all(db: Session = Depends(get_db)) -> list[NewsletterSubscriberDto]:
    rows = db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.subscribed_at.desc()).all()
    return [NewsletterSubscriberDto.from_entity(s) for s in rows]


@newsletter_admin_router.delete("/{subscriber_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(subscriber_id: int, db: Session = Depends(get_db)) -> None:
    subscriber = db.get(NewsletterSubscriber, subscriber_id)
    if subscriber is None:
        raise NotFoundException(f"Iscritto non trovato (id {subscriber_id})")
    db.delete(subscriber)


@newsletter_admin_router.get("/export")
def export(db: Session = Depends(get_db)) -> Response:
    rows = db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.subscribed_at.desc()).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer, quoting=csv.QUOTE_ALL)
    writer.writerow(["Email", "Iscritto il"])
    for s in rows:
        writer.writerow([s.email, s.subscribed_at.strftime("%d/%m/%Y %H:%M")])

    return Response(
        content=buffer.getvalue(),
        media_type="text/csv; charset=UTF-8",
        headers={"Content-Disposition": 'attachment; filename="iscritti-newsletter.csv"'},
    )


@newsletter_public_router.post("", status_code=status.HTTP_204_NO_CONTENT)
def subscribe(request: NewsletterSubscribeRequest, db: Session = Depends(get_db)) -> None:
    """Iscrive un'email alla newsletter. Idempotente: se già iscritta, non fallisce e non duplica."""
    exists = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email.ilike(request.email)).first()
    if exists is not None:
        return None
    db.add(NewsletterSubscriber(email=request.email))



# ============================================================================
# reviews.py
# ============================================================================
reviews_router = APIRouter(prefix="/api/public/google-reviews", tags=["public-google-reviews"])

_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
_FIELDS = "name,rating,user_ratings_total,url,reviews"

_lock = threading.Lock()
_cached: GoogleReviewsResponseDto | None = None
_cached_at: datetime | None = None


def _reviews_is_configured() -> bool:
    return bool(settings.google_places_api_key) and bool(settings.google_places_place_id)


def _reviews_is_cache_fresh() -> bool:
    if _cached is None or _cached_at is None:
        return False
    return datetime.now(timezone.utc) - _cached_at < timedelta(minutes=settings.google_places_cache_minutes)


def _reviews_fetch_from_google() -> GoogleReviewsResponseDto:
    global _cached
    try:
        response = httpx.get(
            _PLACE_DETAILS_URL,
            params={
                "place_id": settings.google_places_place_id,
                "fields": _FIELDS,
                "language": "it",
                "key": settings.google_places_api_key,
            },
            timeout=10.0,
        )
        data = response.json()
        api_status = data.get("status", "")
        if api_status != "OK":
            # In caso di errore non blocchiamo il sito: torniamo l'ultima cache
            # valida se esiste, altrimenti una risposta "non configurata".
            return _cached if _cached is not None else GoogleReviewsResponseDto.not_configured()

        result = data.get("result", {})
        reviews_raw = result.get("reviews", [])
        reviews = [
            GoogleReviewDto(
                authorName=r.get("author_name", "Cliente Google"),
                authorPhotoUrl=r.get("profile_photo_url"),
                profileUrl=r.get("author_url"),
                rating=r.get("rating", 5),
                relativeTime=r.get("relative_time_description", ""),
                text=r.get("text", ""),
                timestamp=r.get("time", 0),
            )
            for r in reviews_raw
        ]
        reviews.sort(key=lambda r: r.timestamp, reverse=True)
        limited = reviews[: max(settings.google_places_max_reviews, 1)]

        return GoogleReviewsResponseDto(
            configured=True,
            placeName=result.get("name"),
            rating=result.get("rating"),
            totalReviews=result.get("user_ratings_total"),
            mapsUrl=result.get("url"),
            reviews=limited,
        )
    except (httpx.HTTPError, ValueError):
        return _cached if _cached is not None else GoogleReviewsResponseDto.not_configured()


@reviews_router.get("", response_model=GoogleReviewsResponseDto)
def get_reviews() -> GoogleReviewsResponseDto:
    global _cached, _cached_at

    if not _reviews_is_configured():
        return GoogleReviewsResponseDto.not_configured()

    if _reviews_is_cache_fresh():
        return _cached

    with _lock:
        if _reviews_is_cache_fresh():
            return _cached
        fresh = _reviews_fetch_from_google()
        _cached = fresh
        _cached_at = datetime.now(timezone.utc)
        return fresh



# ============================================================================
# uploads.py
# ============================================================================
uploads_router = APIRouter(
    prefix="/api/admin/uploads", tags=["admin-uploads"], dependencies=[Depends(require_any_admin)]
)


@uploads_router.post("", response_model=UploadResponse)
async def upload(file: UploadFile = File(...)) -> UploadResponse:
    """Carica un'immagine (loghi, foto piatti, foto eventi...) e restituisce
    l'URL pubblico da salvare nel campo imageUrl della risorsa corrispondente."""
    url = await store_image(file)
    return UploadResponse(url=url)


@uploads_router.post("/video", response_model=UploadResponse)
async def upload_video(file: UploadFile = File(...)) -> UploadResponse:
    """Carica un video MP4 (usato per le tipologie di evento/servizi) e
    restituisce l'URL pubblico da salvare nel campo videoUrl."""
    url = await store_video(file)
    return UploadResponse(url=url)



# ============================================================================
# health.py
# ============================================================================
health_router = APIRouter(prefix="/api/public", tags=["health"])


@health_router.get("/ping")
def ping() -> dict:
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "andreamoiochef-backend",
    }
