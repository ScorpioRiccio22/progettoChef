package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.ReorderRequest;
import it.andreamoiochef.backend.content.dto.ServiceOfferingDto;
import it.andreamoiochef.backend.content.dto.ServiceOfferingRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/services")
@RequiredArgsConstructor
public class AdminServiceOfferingController {

    private final ServiceOfferingService service;

    @GetMapping
    public ResponseEntity<List<ServiceOfferingDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PostMapping
    public ResponseEntity<ServiceOfferingDto> create(@Valid @RequestBody ServiceOfferingRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceOfferingDto> update(@PathVariable Long id, @Valid @RequestBody ServiceOfferingRequest request) {
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
