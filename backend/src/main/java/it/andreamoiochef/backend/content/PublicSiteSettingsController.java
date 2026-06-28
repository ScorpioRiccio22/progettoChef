package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.SiteSettingsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/site-settings")
@RequiredArgsConstructor
public class PublicSiteSettingsController {

    private final SiteSettingsService service;

    @GetMapping
    public ResponseEntity<SiteSettingsDto> get() {
        return ResponseEntity.ok(service.getSettings());
    }
}
