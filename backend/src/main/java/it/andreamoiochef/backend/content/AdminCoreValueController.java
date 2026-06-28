package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.CoreValueDto;
import it.andreamoiochef.backend.content.dto.CoreValueRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/core-values")
@RequiredArgsConstructor
public class AdminCoreValueController {

    private final CoreValueService service;

    @GetMapping
    public ResponseEntity<List<CoreValueDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PostMapping
    public ResponseEntity<CoreValueDto> create(@Valid @RequestBody CoreValueRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoreValueDto> update(@PathVariable Long id, @Valid @RequestBody CoreValueRequest request) {
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
