package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.EventTypeDto;
import it.andreamoiochef.backend.content.dto.EventTypeRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/event-types")
@RequiredArgsConstructor
public class AdminEventTypeController {

    private final EventTypeService service;

    @GetMapping
    public ResponseEntity<List<EventTypeDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PostMapping
    public ResponseEntity<EventTypeDto> create(@Valid @RequestBody EventTypeRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventTypeDto> update(@PathVariable Long id, @Valid @RequestBody EventTypeRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        service.reorder(request);
        return ResponseEntity.noContent().build();
    }
}
