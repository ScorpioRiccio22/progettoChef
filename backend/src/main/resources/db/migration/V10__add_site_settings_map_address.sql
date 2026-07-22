-- Indirizzo fisico mostrato nella mini mappa della pagina "Contatti".
-- Viene geocodificato lato frontend (Nominatim/OpenStreetMap) a partire da
-- questa stringa: deve quindi essere un indirizzo il più possibile completo
-- e "standard" (via, numero civico, CAP, città), non solo il nome della zona.
ALTER TABLE site_settings
    ADD COLUMN map_address VARCHAR(500);
