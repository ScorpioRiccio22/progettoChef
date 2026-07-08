package it.andreamoiochef.backend.reviews;

import it.andreamoiochef.backend.reviews.dto.GoogleReviewsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Espone le recensioni Google del locale al sito pubblico. Non richiede
 * autenticazione (sono dati pubblici, gli stessi visibili su Google Maps)
 * e non restituisce mai la chiave API: quella resta solo lato server.
 */
@RestController
@RequestMapping("/api/public/google-reviews")
@RequiredArgsConstructor
public class PublicGoogleReviewsController {

    private final GooglePlacesService googlePlacesService;

    @GetMapping
    public ResponseEntity<GoogleReviewsResponseDto> get() {
        return ResponseEntity.ok(googlePlacesService.getReviews());
    }
}
