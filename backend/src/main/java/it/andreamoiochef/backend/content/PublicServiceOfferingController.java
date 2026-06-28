package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.ServiceOfferingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/services")
@RequiredArgsConstructor
public class PublicServiceOfferingController {

    private final ServiceOfferingService service;

    @GetMapping
    public ResponseEntity<List<ServiceOfferingDto>> list() {
        return ResponseEntity.ok(service.listPublished());
    }
}
