-- Impostazioni globali del sito (riga singola, id sempre = 1)
CREATE TABLE site_settings
(
    id                       BIGINT PRIMARY KEY,
    brand_name               VARCHAR(180) NOT NULL,
    brand_handle             VARCHAR(180),
    brand_role               VARCHAR(180),
    brand_city               VARCHAR(180),
    brand_payoff             VARCHAR(500),
    logo_url                 VARCHAR(500),
    favicon_url              VARCHAR(500),
    contact_email            VARCHAR(180),
    whatsapp_number          VARCHAR(60),
    whatsapp_link            VARCHAR(300),
    contact_area             VARCHAR(255),
    instagram_url            VARCHAR(300),
    facebook_url             VARCHAR(300),
    tiktok_url               VARCHAR(300),
    threads_url              VARCHAR(300),
    hero_title               VARCHAR(300),
    hero_subtitle            VARCHAR(600),
    hero_image_url           VARCHAR(500),
    about_intro              TEXT,
    about_paragraph_1        TEXT,
    about_paragraph_2        TEXT,
    about_image_url          VARCHAR(500),
    stat_years_value         VARCHAR(40),
    stat_years_label         VARCHAR(120),
    stat_events_value        VARCHAR(40),
    stat_events_label        VARCHAR(120),
    stat_ingredients_value   VARCHAR(40),
    stat_ingredients_label   VARCHAR(120),
    updated_at               TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Servizi offerti (chef a domicilio, eventi privati, consulenza...)
CREATE TABLE service_offerings
(
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(180) NOT NULL,
    tagline     VARCHAR(255),
    description TEXT,
    icon        VARCHAR(60),
    image_url   VARCHAR(500),
    sort_order  INT       NOT NULL DEFAULT 0,
    published   BOOLEAN   NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Piatti del ricettario
CREATE TABLE dishes
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(180) NOT NULL,
    category    VARCHAR(40)  NOT NULL,
    description TEXT,
    image_url   VARCHAR(500),
    sort_order  INT       NOT NULL DEFAULT 0,
    published   BOOLEAN   NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE dish_tags
(
    dish_id   BIGINT       NOT NULL REFERENCES dishes (id) ON DELETE CASCADE,
    tag       VARCHAR(60)  NOT NULL,
    tag_order INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_dish_tags_dish_id ON dish_tags (dish_id);

-- Tipologie di eventi (privati, aziendali, catering, cooking class...)
CREATE TABLE event_types
(
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(180) NOT NULL,
    description TEXT,
    icon        VARCHAR(60),
    image_url   VARCHAR(500),
    sort_order  INT       NOT NULL DEFAULT 0,
    published   BOOLEAN   NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE event_type_details
(
    event_type_id BIGINT       NOT NULL REFERENCES event_types (id) ON DELETE CASCADE,
    detail        VARCHAR(255) NOT NULL,
    detail_order  INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_event_type_details_event_type_id ON event_type_details (event_type_id);

-- Recensioni / testimonianze clienti
CREATE TABLE testimonials
(
    id         BIGSERIAL PRIMARY KEY,
    author     VARCHAR(180) NOT NULL,
    role       VARCHAR(180),
    quote      TEXT         NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0,
    published  BOOLEAN   NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tappe del percorso professionale (pagina "Chi siamo")
CREATE TABLE milestones
(
    id         BIGSERIAL PRIMARY KEY,
    year       VARCHAR(40) NOT NULL,
    text       TEXT        NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Principi/valori della cucina (pagina "Chi siamo")
CREATE TABLE core_values
(
    id         BIGSERIAL PRIMARY KEY,
    title      VARCHAR(180) NOT NULL,
    text       TEXT         NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Messaggi dal form di contatto pubblico
CREATE TABLE contact_messages
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(180) NOT NULL,
    email      VARCHAR(180) NOT NULL,
    phone      VARCHAR(60),
    subject    VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    read       BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at);

-- Iscritti alla newsletter
CREATE TABLE newsletter_subscribers
(
    id             BIGSERIAL PRIMARY KEY,
    email          VARCHAR(180) NOT NULL UNIQUE,
    subscribed_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers (email);
