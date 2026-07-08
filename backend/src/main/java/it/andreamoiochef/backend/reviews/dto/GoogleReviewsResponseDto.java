package it.andreamoiochef.backend.reviews.dto;

import java.util.List;

/**
 * Risposta pubblica dell'endpoint recensioni Google. {@code configured}
 * distingue "nessuna recensione trovata" da "integrazione non ancora
 * impostata", così il frontend può mostrare le testimonianze manuali come
 * fallback senza far sembrare un errore.
 */
public record GoogleReviewsResponseDto(
        boolean configured,
        String placeName,
        Double rating,
        Integer totalReviews,
        String mapsUrl,
        List<GoogleReviewDto> reviews
) {
    public static GoogleReviewsResponseDto notConfigured() {
        return new GoogleReviewsResponseDto(false, null, null, null, null, List.of());
    }
}
