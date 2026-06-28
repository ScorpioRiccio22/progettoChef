package it.andreamoiochef.backend.leads;

import it.andreamoiochef.backend.leads.dto.NewsletterSubscribeRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/newsletter")
@RequiredArgsConstructor
public class PublicNewsletterController {

    private final NewsletterSubscriberService service;

    @PostMapping
    public ResponseEntity<Void> subscribe(@Valid @RequestBody NewsletterSubscribeRequest request) {
        service.subscribe(request.email());
        return ResponseEntity.noContent().build();
    }
}
