package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.EventTypeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/event-types")
@RequiredArgsConstructor
public class PublicEventTypeController {

    private final EventTypeService service;

    @GetMapping
    public ResponseEntity<List<EventTypeDto>> list() {
        return ResponseEntity.ok(service.listPublished());
    }

    /** Landing page pubblica dell'evento, con testo esteso, galleria ed eventuale video. */
    @GetMapping("/{slug}")
    public ResponseEntity<EventTypeDto> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(service.getPublishedBySlug(slug));
    }
}
