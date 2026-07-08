package it.andreamoiochef.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Credenziali e parametri per l'integrazione con la Google Places API,
 * usata per mostrare le recensioni Google reali al posto delle
 * testimonianze inserite a mano.
 * <p>
 * {@code apiKey} è un segreto: arriva SOLO dalla variabile d'ambiente
 * {@code GOOGLE_PLACES_API_KEY} (vedi application.yml), non va mai
 * committata nel repository né loggata, e non deve mai comparire in
 * nessuna risposta HTTP verso il frontend. Il backend la usa
 * esclusivamente per autenticare le chiamate server-to-server verso
 * Google (vedi {@link it.andreamoiochef.backend.reviews.GooglePlacesService}).
 */
@ConfigurationProperties(prefix = "app.google-places")
public record GooglePlacesProperties(
        String apiKey,
        String placeId,
        long cacheMinutes,
        int maxReviews
) {
    /** true solo se sono state impostate sia la chiave che il Place ID. */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && placeId != null && !placeId.isBlank();
    }
}
