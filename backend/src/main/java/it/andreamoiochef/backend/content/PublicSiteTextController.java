package it.andreamoiochef.backend.content;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public/site-texts")
@RequiredArgsConstructor
public class PublicSiteTextController {

    private final SiteTextService service;

    /** Tutti i testi del sito in un'unica mappa chiave -> valore, per popolare le pagine pubbliche. */
    @GetMapping
    public ResponseEntity<Map<String, String>> all() {
        return ResponseEntity.ok(service.getAllAsMap());
    }
}
