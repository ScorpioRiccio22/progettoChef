package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.SiteTextDto;
import it.andreamoiochef.backend.content.dto.SiteTextRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/site-texts")
@RequiredArgsConstructor
public class AdminSiteTextController {

    private final SiteTextService service;

    @GetMapping
    public ResponseEntity<List<SiteTextDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PutMapping("/{key}")
    public ResponseEntity<SiteTextDto> update(@PathVariable String key, @Valid @RequestBody SiteTextRequest request) {
        return ResponseEntity.ok(service.updateValue(key, request.value()));
    }
}
