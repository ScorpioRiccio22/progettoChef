"""
Modelli SQLAlchemy: tutte le tabelle del database in un unico file
(equivalente delle entity JPA sparse in auth/, content/, leads/ nel
progetto Java originale).
"""
import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey, Numeric, func, Enum as SAEnum
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class AdminRole(str, enum.Enum):
    """Ruoli dell'area amministrativa, in ordine crescente di privilegio:
    EDITOR -> solo contenuti "grafici" (piatti, servizi, eventi, testimonianze, chi siamo).
    ADMIN -> accesso completo a contenuti, messaggi, impostazioni (non gli account).
    SUPERADMIN -> come ADMIN, con in più la gestione degli account admin."""
    EDITOR = "EDITOR"
    ADMIN = "ADMIN"
    SUPERADMIN = "SUPERADMIN"


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(180), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(180), nullable=False)
    role: Mapped[AdminRole] = mapped_column(
        SAEnum(AdminRole, name="admin_role", native_enum=False, length=40),
        nullable=False,
        default=AdminRole.ADMIN,
    )
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


# --- Contenuti del sito -----------------------------------------------------
# Nota di design: le collezioni ordinate che in Java erano modellate come
# tabelle @ElementCollection separate (dish_tags, event_type_details,
# event_type_gallery_images, service_offering_gallery_images) qui sono
# colonne ARRAY(Text) di Postgres: stesso comportamento visto dall'API
# (liste ordinate di stringhe), schema più semplice in un progetto nuovo.

class ServiceOffering(Base):
    __tablename__ = "service_offerings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    slug: Mapped[str] = mapped_column(String(180), nullable=False, unique=True)
    tagline: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    body_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(60), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    gallery_image_urls: Mapped[list[str]] = mapped_column(ARRAY(String(500)), nullable=False, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class Dish(Base):
    __tablename__ = "dishes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    category: Mapped[str] = mapped_column(String(40), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String(60)), nullable=False, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class EventType(Base):
    __tablename__ = "event_types"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    slug: Mapped[str] = mapped_column(String(180), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    body_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(60), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    details: Mapped[list[str]] = mapped_column(ARRAY(String(255)), nullable=False, default=list)
    gallery_image_urls: Mapped[list[str]] = mapped_column(ARRAY(String(500)), nullable=False, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class Menu(Base):
    __tablename__ = "menus"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False, default="SHOP")  # SHOP | EVENTS
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    items: Mapped[list["MenuItem"]] = relationship(back_populates="menu", cascade="all, delete-orphan")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    menu_id: Mapped[int] = mapped_column(ForeignKey("menus.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    category: Mapped[str | None] = mapped_column(String(40), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(8, 2), nullable=False, default=0)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    menu: Mapped["Menu"] = relationship(back_populates="items")


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    author: Mapped[str] = mapped_column(String(180), nullable=False)
    role: Mapped[str | None] = mapped_column(String(180), nullable=True)
    quote: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    year: Mapped[str] = mapped_column(String(40), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class CoreValue(Base):
    __tablename__ = "core_values"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class SiteSettings(Base):
    """Riga singola (id sempre 1) con le impostazioni globali del sito."""
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(primary_key=True, default=1)

    brand_name: Mapped[str] = mapped_column(String(180), nullable=False, default="Andrea Moio")
    brand_handle: Mapped[str | None] = mapped_column(String(180), nullable=True)
    brand_role: Mapped[str | None] = mapped_column(String(180), nullable=True)
    brand_city: Mapped[str | None] = mapped_column(String(180), nullable=True)
    brand_payoff: Mapped[str | None] = mapped_column(String(500), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    favicon_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    contact_email: Mapped[str | None] = mapped_column(String(180), nullable=True)
    whatsapp_number: Mapped[str | None] = mapped_column(String(60), nullable=True)
    whatsapp_link: Mapped[str | None] = mapped_column(String(300), nullable=True)
    contact_area: Mapped[str | None] = mapped_column(String(255), nullable=True)
    map_address: Mapped[str | None] = mapped_column(String(500), nullable=True)

    instagram_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    facebook_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    tiktok_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    threads_url: Mapped[str | None] = mapped_column(String(300), nullable=True)

    hero_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    hero_subtitle: Mapped[str | None] = mapped_column(String(600), nullable=True)
    hero_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    about_intro: Mapped[str | None] = mapped_column(Text, nullable=True)
    about_paragraph_1: Mapped[str | None] = mapped_column(Text, nullable=True)
    about_paragraph_2: Mapped[str | None] = mapped_column(Text, nullable=True)
    about_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    stat_years_value: Mapped[str | None] = mapped_column(String(40), nullable=True)
    stat_years_label: Mapped[str | None] = mapped_column(String(120), nullable=True)
    stat_events_value: Mapped[str | None] = mapped_column(String(40), nullable=True)
    stat_events_label: Mapped[str | None] = mapped_column(String(120), nullable=True)
    stat_ingredients_value: Mapped[str | None] = mapped_column(String(40), nullable=True)
    stat_ingredients_label: Mapped[str | None] = mapped_column(String(120), nullable=True)

    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class SiteText(Base):
    __tablename__ = "site_texts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column("text_key", String(120), nullable=False, unique=True)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    email: Mapped[str] = mapped_column(String(180), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(60), nullable=True)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(180), nullable=False, unique=True)
    subscribed_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())


