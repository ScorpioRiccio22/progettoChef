package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.SiteSettingsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Impostazioni globali del sito: fuori dalla portata del ruolo EDITOR, che
// gestisce solo i contenuti "grafici" (piatti, servizi, eventi, ecc.).
@RestController
@RequestMapping("/api/admin/site-settings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
public class AdminSiteSettingsController {

    private final SiteSettingsService service;

    @GetMapping
    public ResponseEntity<SiteSettingsDto> get() {
        return ResponseEntity.ok(service.getSettings());
    }

    @PutMapping
    public ResponseEntity<SiteSettingsDto> update(@RequestBody SiteSettingsDto request) {
        return ResponseEntity.ok(service.updateSettings(request));
    }
}
