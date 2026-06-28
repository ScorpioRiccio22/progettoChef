package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.TestimonialDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/testimonials")
@RequiredArgsConstructor
public class PublicTestimonialController {

    private final TestimonialService service;

    @GetMapping
    public ResponseEntity<List<TestimonialDto>> list() {
        return ResponseEntity.ok(service.listPublished());
    }
}
