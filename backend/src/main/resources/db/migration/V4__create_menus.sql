-- Menu "A Modo Mio": liste curate di piatti (esistenti o nuovi) con un
-- prezzo dedicato al menu. Un menu alla volta può essere marcato come
-- "attivo": è quello mostrato in vetrina per il negozio fisico.
CREATE TABLE menus
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(180) NOT NULL,
    description TEXT,
    active      BOOLEAN   NOT NULL DEFAULT FALSE,
    sort_order  INT       NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Voci del menu: possono ricalcare un piatto del catalogo (copiandone i
-- valori) oppure essere del tutto nuove. Ogni voce ha un proprio prezzo,
-- perché lo stesso piatto può avere un prezzo diverso da menu a menu.
CREATE TABLE menu_items
(
    id          BIGSERIAL PRIMARY KEY,
    menu_id     BIGINT        NOT NULL REFERENCES menus (id) ON DELETE CASCADE,
    name        VARCHAR(180)  NOT NULL,
    category    VARCHAR(40),
    description TEXT,
    image_url   VARCHAR(500),
    price       NUMERIC(8, 2) NOT NULL DEFAULT 0,
    sort_order  INT           NOT NULL DEFAULT 0
);

CREATE INDEX idx_menu_items_menu_id ON menu_items (menu_id);

-- Vincolo di sicurezza a livello DB: al massimo un menu può essere attivo
-- contemporaneamente (oltre al controllo già fatto lato applicazione).
CREATE UNIQUE INDEX uq_menus_single_active ON menus (active) WHERE active = TRUE;
