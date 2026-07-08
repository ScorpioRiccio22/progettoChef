package it.andreamoiochef.backend.reviews;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.andreamoiochef.backend.config.GooglePlacesProperties;
import it.andreamoiochef.backend.reviews.dto.GoogleReviewDto;
import it.andreamoiochef.backend.reviews.dto.GoogleReviewsResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Recupera le recensioni Google del locale tramite la Google Places API
 * (Place Details), usando la chiave API solo lato server: la chiave non
 * viene mai passata al frontend né inclusa nella risposta pubblica.
 * <p>
 * Il risultato viene tenuto in cache in memoria per {@code cacheMinutes}
 * minuti (di default alcune ore) per non consumare inutilmente la quota
 * a pagamento della API a ogni visita al sito.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GooglePlacesService {

    private static final String PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
    private static final String FIELDS = "name,rating,user_ratings_total,url,reviews";

    private final GooglePlacesProperties properties;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestClient restClient = RestClient.create();
    private final ReentrantLock lock = new ReentrantLock();

    private volatile GoogleReviewsResponseDto cached;
    private volatile Instant cachedAt;

    public GoogleReviewsResponseDto getReviews() {
        if (!properties.isConfigured()) {
            return GoogleReviewsResponseDto.notConfigured();
        }

        if (isCacheFresh()) {
            return cached;
        }

        lock.lock();
        try {
            // Un'altra richiesta potrebbe aver già rinfrescato la cache mentre aspettavamo il lock
            if (isCacheFresh()) {
                return cached;
            }
            GoogleReviewsResponseDto fresh = fetchFromGoogle();
            cached = fresh;
            cachedAt = Instant.now();
            return fresh;
        } finally {
            lock.unlock();
        }
    }

    private boolean isCacheFresh() {
        return cached != null && cachedAt != null
                && Duration.between(cachedAt, Instant.now()).toMinutes() < properties.cacheMinutes();
    }

    private GoogleReviewsResponseDto fetchFromGoogle() {
        try {
            String body = restClient.get()
                    .uri(PLACE_DETAILS_URL + "?place_id={placeId}&fields={fields}&language=it&key={apiKey}",
                            properties.placeId(), FIELDS, properties.apiKey())
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(body);
            String status = root.path("status").asText("");
            if (!"OK".equals(status)) {
                log.warn("Google Places API ha risposto con status {} (place_id configurato correttamente?)", status);
                // In caso di errore non blocchiamo il sito: torniamo l'ultima cache valida se esiste,
                // altrimenti una risposta vuota ma "configured" così il frontend non mostra il fallback statico.
                return cached != null ? cached : GoogleReviewsResponseDto.notConfigured();
            }

            JsonNode result = root.path("result");
            String placeName = result.path("name").asText(null);
            Double rating = result.hasNonNull("rating") ? result.path("rating").asDouble() : null;
            Integer totalReviews = result.hasNonNull("user_ratings_total") ? result.path("user_ratings_total").asInt() : null;
            String mapsUrl = result.path("url").asText(null);

            List<GoogleReviewDto> reviews = new ArrayList<>();
            for (JsonNode r : result.path("reviews")) {
                reviews.add(new GoogleReviewDto(
                        r.path("author_name").asText("Cliente Google"),
                        r.path("profile_photo_url").asText(null),
                        r.path("author_url").asText(null),
                        r.path("rating").asInt(5),
                        r.path("relative_time_description").asText(""),
                        r.path("text").asText(""),
                        r.path("time").asLong(0)
                ));
            }
            reviews.sort(Comparator.comparingLong(GoogleReviewDto::timestamp).reversed());
            List<GoogleReviewDto> limited = reviews.stream().limit(Math.max(properties.maxReviews(), 1)).toList();

            return new GoogleReviewsResponseDto(true, placeName, rating, totalReviews, mapsUrl, limited);
        } catch (Exception ex) {
            log.warn("Impossibile recuperare le recensioni Google: {}", ex.getMessage());
            return cached != null ? cached : GoogleReviewsResponseDto.notConfigured();
        }
    }
}
