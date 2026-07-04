-- Video (mp4) opzionale associato a una tipologia di evento, mostrato
-- nella pagina pubblica "Eventi" insieme (o al posto) dell'immagine.
ALTER TABLE event_types
    ADD COLUMN video_url VARCHAR(500);
