package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.ReorderRequest;
import it.andreamoiochef.backend.content.dto.TestimonialDto;
import it.andreamoiochef.backend.content.dto.TestimonialRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/testimonials")
@RequiredArgsConstructor
public class AdminTestimonialController {

    private final TestimonialService service;

    @GetMapping
    public ResponseEntity<List<TestimonialDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @PostMapping
    public ResponseEntity<TestimonialDto> create(@Valid @RequestBody TestimonialRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestimonialDto> update(@PathVariable Long id, @Valid @RequestBody TestimonialRequest request) {
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
