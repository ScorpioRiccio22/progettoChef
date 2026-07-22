ALTER TABLE service_offerings
    ADD COLUMN slug         VARCHAR(180),
    ADD COLUMN video_url    VARCHAR(500),
    ADD COLUMN body_content TEXT;

-- Backfill: alle righe già esistenti serve comunque uno slug valido prima
-- di poter rendere la colonna NOT NULL e aggiungere il vincolo di unicità.
UPDATE service_offerings SET slug = 'servizio-' || id WHERE slug IS NULL;

ALTER TABLE service_offerings
    ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX uq_service_offerings_slug ON service_offerings (slug);

-- Galleria di immagini aggiuntive mostrate nella pagina di dettaglio del servizio.
CREATE TABLE service_offering_gallery_images
(
    service_offering_id BIGINT       NOT NULL REFERENCES service_offerings (id) ON DELETE CASCADE,
    image_url            VARCHAR(500) NOT NULL,
    image_order           INT          NOT NULL DEFAULT 0
);

CREATE INDEX idx_service_gallery_images_service_id ON service_offering_gallery_images (service_offering_id);
