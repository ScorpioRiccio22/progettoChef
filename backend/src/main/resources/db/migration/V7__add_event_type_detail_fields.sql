ALTER TABLE event_types
    ADD COLUMN slug         VARCHAR(180),
    ADD COLUMN body_content TEXT;

-- Backfill: alle righe già esistenti serve comunque uno slug valido prima
-- di poter rendere la colonna NOT NULL e aggiungere il vincolo di unicità.
UPDATE event_types SET slug = 'evento-' || id WHERE slug IS NULL;

ALTER TABLE event_types
    ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX uq_event_types_slug ON event_types (slug);

-- Galleria di immagini aggiuntive per la landing page dell'evento.
CREATE TABLE event_type_gallery_images
(
    event_type_id BIGINT       NOT NULL REFERENCES event_types (id) ON DELETE CASCADE,
    image_url     VARCHAR(500) NOT NULL,
    image_order   INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_event_type_gallery_images_event_type_id ON event_type_gallery_images (event_type_id);
