-- Testi liberi di ogni pagina/sezione del sito (titoli, descrizioni, testo dei
-- pulsanti...), editabili da backend senza toccare il codice. Ogni testo ha una
-- chiave stabile usata dal frontend (text_key) e un valore modificabile in admin.
CREATE TABLE site_texts
(
    id         BIGSERIAL PRIMARY KEY,
    text_key   VARCHAR(120) NOT NULL,
    value      TEXT         NOT NULL,
    category   VARCHAR(60)  NOT NULL,
    label      VARCHAR(200) NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_site_texts_key ON site_texts (text_key);
CREATE INDEX idx_site_texts_category ON site_texts (category);
