"""
Schemi Pydantic (request/response), equivalenti dei DTO/Request Java,
tutti in un unico file.
"""
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field, field_validator


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="L'email è obbligatoria")
    password: str = Field(..., min_length=1, description="La password è obbligatoria")


class AdminUserDto(BaseModel):
    id: int
    email: str
    fullName: str
    role: str
    enabled: bool
    createdAt: datetime
    lastLoginAt: datetime | None = None

    model_config = {"from_attributes": True}

    @classmethod
    def from_entity(cls, user) -> "AdminUserDto":
        return cls(
            id=user.id,
            email=user.email,
            fullName=user.full_name,
            role=user.role.value,
            enabled=user.enabled,
            createdAt=user.created_at,
            lastLoginAt=user.last_login_at,
        )


class LoginResponse(BaseModel):
    accessToken: str
    tokenType: str = "Bearer"
    expiresInSeconds: int
    user: AdminUserDto


class ChangeOwnPasswordRequest(BaseModel):
    currentPassword: str = Field(..., min_length=1)
    newPassword: str = Field(..., min_length=8, max_length=72)


class CreateAdminUserRequest(BaseModel):
    email: EmailStr
    fullName: str = Field(..., min_length=1, max_length=180)
    password: str = Field(..., min_length=8, max_length=72)
    role: str

    @field_validator("fullName")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Il nome è obbligatorio")
        return v


class UpdateAdminRoleRequest(BaseModel):
    role: str


class UpdateAdminStatusRequest(BaseModel):
    enabled: bool


class AdminResetPasswordRequest(BaseModel):
    newPassword: str = Field(..., min_length=8, max_length=72)


# --- Reorder (drag-and-drop) ------------------------------------------------

class ReorderRequest(BaseModel):
    orderedIds: list[int] = Field(..., min_length=1)


# --- Core values -------------------------------------------------------------

class CoreValueRequest(BaseModel):
    title: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)


class CoreValueDto(BaseModel):
    id: int
    title: str
    text: str
    sortOrder: int

    model_config = {"from_attributes": True}

    @classmethod
    def from_entity(cls, v) -> "CoreValueDto":
        return cls(id=v.id, title=v.title, text=v.text, sortOrder=v.sort_order)


# --- Milestones ----------------------------------------------------------

class MilestoneRequest(BaseModel):
    year: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)


class MilestoneDto(BaseModel):
    id: int
    year: str
    text: str
    sortOrder: int

    @classmethod
    def from_entity(cls, m) -> "MilestoneDto":
        return cls(id=m.id, year=m.year, text=m.text, sortOrder=m.sort_order)


class AboutPageDto(BaseModel):
    milestones: list[MilestoneDto]
    values: list[CoreValueDto]


# --- Dishes ----------------------------------------------------------------

class DishRequest(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    description: str | None = None
    imageUrl: str | None = None
    tags: list[str] | None = None
    published: bool | None = None


class DishDto(BaseModel):
    id: int
    name: str
    category: str
    description: str | None
    imageUrl: str | None
    tags: list[str]
    sortOrder: int
    published: bool

    @classmethod
    def from_entity(cls, d) -> "DishDto":
        return cls(
            id=d.id, name=d.name, category=d.category, description=d.description,
            imageUrl=d.image_url, tags=list(d.tags or []), sortOrder=d.sort_order, published=d.published,
        )


# --- Event types ----------------------------------------------------------

class EventTypeRequest(BaseModel):
    title: str = Field(..., min_length=1)
    slug: str | None = None
    description: str | None = None
    bodyContent: str | None = None
    icon: str | None = None
    imageUrl: str | None = None
    videoUrl: str | None = None
    details: list[str] | None = None
    galleryImageUrls: list[str] | None = None
    published: bool | None = None


class EventTypeDto(BaseModel):
    id: int
    title: str
    slug: str
    description: str | None
    bodyContent: str | None
    icon: str | None
    imageUrl: str | None
    videoUrl: str | None
    details: list[str]
    galleryImageUrls: list[str]
    sortOrder: int
    published: bool

    @classmethod
    def from_entity(cls, e) -> "EventTypeDto":
        return cls(
            id=e.id, title=e.title, slug=e.slug, description=e.description, bodyContent=e.body_content,
            icon=e.icon, imageUrl=e.image_url, videoUrl=e.video_url,
            details=list(e.details or []), galleryImageUrls=list(e.gallery_image_urls or []),
            sortOrder=e.sort_order, published=e.published,
        )


# --- Service offerings ------------------------------------------------------

class ServiceOfferingRequest(BaseModel):
    title: str = Field(..., min_length=1)
    slug: str | None = None
    tagline: str | None = None
    description: str | None = None
    bodyContent: str | None = None
    icon: str | None = None
    imageUrl: str | None = None
    videoUrl: str | None = None
    galleryImageUrls: list[str] | None = None
    published: bool | None = None


class ServiceOfferingDto(BaseModel):
    id: int
    title: str
    slug: str
    tagline: str | None
    description: str | None
    bodyContent: str | None
    icon: str | None
    imageUrl: str | None
    videoUrl: str | None
    galleryImageUrls: list[str]
    sortOrder: int
    published: bool

    @classmethod
    def from_entity(cls, s) -> "ServiceOfferingDto":
        return cls(
            id=s.id, title=s.title, slug=s.slug, tagline=s.tagline, description=s.description,
            bodyContent=s.body_content, icon=s.icon, imageUrl=s.image_url, videoUrl=s.video_url,
            galleryImageUrls=list(s.gallery_image_urls or []), sortOrder=s.sort_order, published=s.published,
        )


# --- Testimonials --------------------------------------------------------

class TestimonialRequest(BaseModel):
    author: str = Field(..., min_length=1)
    role: str | None = None
    quote: str = Field(..., min_length=1)
    published: bool | None = None


class TestimonialDto(BaseModel):
    id: int
    author: str
    role: str | None
    quote: str
    sortOrder: int
    published: bool

    @classmethod
    def from_entity(cls, t) -> "TestimonialDto":
        return cls(
            id=t.id, author=t.author, role=t.role, quote=t.quote,
            sortOrder=t.sort_order, published=t.published,
        )


# --- Menus & menu items ------------------------------------------------------

class MenuRequest(BaseModel):
    name: str = Field(..., min_length=1)
    type: str | None = None
    description: str | None = None
    active: bool | None = None


class MenuItemRequest(BaseModel):
    name: str = Field(..., min_length=1)
    category: str | None = None
    description: str | None = None
    imageUrl: str | None = None
    price: Decimal = Field(...)

    @field_validator("price")
    @classmethod
    def price_not_negative(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("Il prezzo non può essere negativo")
        return v


class MenuItemDto(BaseModel):
    id: int
    name: str
    category: str | None
    description: str | None
    imageUrl: str | None
    price: Decimal
    sortOrder: int

    @classmethod
    def from_entity(cls, item) -> "MenuItemDto":
        return cls(
            id=item.id, name=item.name, category=item.category, description=item.description,
            imageUrl=item.image_url, price=item.price, sortOrder=item.sort_order,
        )


class MenuDto(BaseModel):
    id: int
    name: str
    type: str
    description: str | None
    active: bool
    sortOrder: int
    items: list[MenuItemDto]

    @classmethod
    def from_entity(cls, menu, items: list[MenuItemDto]) -> "MenuDto":
        return cls(
            id=menu.id, name=menu.name, type=menu.type, description=menu.description,
            active=menu.active, sortOrder=menu.sort_order, items=items,
        )


# --- Site settings -----------------------------------------------------------

class SiteSettingsDto(BaseModel):
    brandName: str | None = None
    brandHandle: str | None = None
    brandRole: str | None = None
    brandCity: str | None = None
    brandPayoff: str | None = None
    logoUrl: str | None = None
    faviconUrl: str | None = None
    contactEmail: str | None = None
    whatsappNumber: str | None = None
    whatsappLink: str | None = None
    contactArea: str | None = None
    mapAddress: str | None = None
    instagramUrl: str | None = None
    facebookUrl: str | None = None
    tiktokUrl: str | None = None
    threadsUrl: str | None = None
    heroTitle: str | None = None
    heroSubtitle: str | None = None
    heroImageUrl: str | None = None
    aboutIntro: str | None = None
    aboutParagraph1: str | None = None
    aboutParagraph2: str | None = None
    aboutImageUrl: str | None = None
    statYearsValue: str | None = None
    statYearsLabel: str | None = None
    statEventsValue: str | None = None
    statEventsLabel: str | None = None
    statIngredientsValue: str | None = None
    statIngredientsLabel: str | None = None

    @classmethod
    def from_entity(cls, s) -> "SiteSettingsDto":
        return cls(
            brandName=s.brand_name, brandHandle=s.brand_handle, brandRole=s.brand_role, brandCity=s.brand_city,
            brandPayoff=s.brand_payoff, logoUrl=s.logo_url, faviconUrl=s.favicon_url,
            contactEmail=s.contact_email, whatsappNumber=s.whatsapp_number, whatsappLink=s.whatsapp_link,
            contactArea=s.contact_area, mapAddress=s.map_address,
            instagramUrl=s.instagram_url, facebookUrl=s.facebook_url, tiktokUrl=s.tiktok_url, threadsUrl=s.threads_url,
            heroTitle=s.hero_title, heroSubtitle=s.hero_subtitle, heroImageUrl=s.hero_image_url,
            aboutIntro=s.about_intro, aboutParagraph1=s.about_paragraph_1, aboutParagraph2=s.about_paragraph_2,
            aboutImageUrl=s.about_image_url,
            statYearsValue=s.stat_years_value, statYearsLabel=s.stat_years_label,
            statEventsValue=s.stat_events_value, statEventsLabel=s.stat_events_label,
            statIngredientsValue=s.stat_ingredients_value, statIngredientsLabel=s.stat_ingredients_label,
        )

    def apply_to(self, s) -> None:
        s.brand_name = self.brandName
        s.brand_handle = self.brandHandle
        s.brand_role = self.brandRole
        s.brand_city = self.brandCity
        s.brand_payoff = self.brandPayoff
        s.logo_url = self.logoUrl
        s.favicon_url = self.faviconUrl
        s.contact_email = self.contactEmail
        s.whatsapp_number = self.whatsappNumber
        s.whatsapp_link = self.whatsappLink
        s.contact_area = self.contactArea
        s.map_address = self.mapAddress
        s.instagram_url = self.instagramUrl
        s.facebook_url = self.facebookUrl
        s.tiktok_url = self.tiktokUrl
        s.threads_url = self.threadsUrl
        s.hero_title = self.heroTitle
        s.hero_subtitle = self.heroSubtitle
        s.hero_image_url = self.heroImageUrl
        s.about_intro = self.aboutIntro
        s.about_paragraph_1 = self.aboutParagraph1
        s.about_paragraph_2 = self.aboutParagraph2
        s.about_image_url = self.aboutImageUrl
        s.stat_years_value = self.statYearsValue
        s.stat_years_label = self.statYearsLabel
        s.stat_events_value = self.statEventsValue
        s.stat_events_label = self.statEventsLabel
        s.stat_ingredients_value = self.statIngredientsValue
        s.stat_ingredients_label = self.statIngredientsLabel


# --- Site texts -----------------------------------------------------------

class SiteTextRequest(BaseModel):
    value: str


class SiteTextDto(BaseModel):
    key: str
    value: str
    category: str
    label: str

    @classmethod
    def from_entity(cls, t) -> "SiteTextDto":
        return cls(key=t.key, value=t.value, category=t.category, label=t.label)


class ContactMessageRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str | None = None
    subject: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)


class ContactMessageDto(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    subject: str
    message: str
    read: bool
    createdAt: datetime

    @classmethod
    def from_entity(cls, m) -> "ContactMessageDto":
        return cls(
            id=m.id, name=m.name, email=m.email, phone=m.phone, subject=m.subject,
            message=m.message, read=m.read, createdAt=m.created_at,
        )


class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr


class NewsletterSubscriberDto(BaseModel):
    id: int
    email: str
    subscribedAt: datetime

    @classmethod
    def from_entity(cls, s) -> "NewsletterSubscriberDto":
        return cls(id=s.id, email=s.email, subscribedAt=s.subscribed_at)


class GoogleReviewDto(BaseModel):
    authorName: str
    authorPhotoUrl: str | None
    profileUrl: str | None
    rating: int
    relativeTime: str
    text: str
    timestamp: int


class GoogleReviewsResponseDto(BaseModel):
    configured: bool
    placeName: str | None = None
    rating: float | None = None
    totalReviews: int | None = None
    mapsUrl: str | None = None
    reviews: list[GoogleReviewDto] = []

    @classmethod
    def not_configured(cls) -> "GoogleReviewsResponseDto":
        return cls(configured=False, reviews=[])


class UploadResponse(BaseModel):
    url: str

