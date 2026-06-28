package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.SiteSettingsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/site-settings")
@RequiredArgsConstructor
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
