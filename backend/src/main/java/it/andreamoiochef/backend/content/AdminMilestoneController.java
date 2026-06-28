package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.MilestoneDto;
import it.andreamoiochef.backend.content.dto.MilestoneRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/milestones")
@RequiredArgsConstructor
public class AdminMilestoneController {

    private final MilestoneService service;

    @GetMapping
    public ResponseEntity<List<MilestoneDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PostMapping
    public ResponseEntity<MilestoneDto> create(@Valid @RequestBody MilestoneRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MilestoneDto> update(@PathVariable Long id, @Valid @RequestBody MilestoneRequest request) {
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
