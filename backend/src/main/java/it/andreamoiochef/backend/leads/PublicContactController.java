package it.andreamoiochef.backend.leads;

import it.andreamoiochef.backend.leads.dto.ContactMessageRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/contact")
@RequiredArgsConstructor
public class PublicContactController {

    private final ContactMessageService service;

    @PostMapping
    public ResponseEntity<Void> submit(@Valid @RequestBody ContactMessageRequest request) {
        service.submit(request);
        return ResponseEntity.noContent().build();
    }
}
