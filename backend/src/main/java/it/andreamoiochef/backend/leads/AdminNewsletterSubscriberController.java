package it.andreamoiochef.backend.leads;

import it.andreamoiochef.backend.leads.dto.NewsletterSubscriberDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

// Iscritti alla newsletter: dato sensibile, fuori dalla portata del ruolo EDITOR.
@RestController
@RequestMapping("/api/admin/newsletter-subscribers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
public class AdminNewsletterSubscriberController {

    private static final DateTimeFormatter CSV_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final NewsletterSubscriberService service;

    @GetMapping
    public ResponseEntity<List<NewsletterSubscriberDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export() {
        List<NewsletterSubscriberDto> subscribers = service.listAll();

        StringBuilder csv = new StringBuilder();
        csv.append("Email,Iscritto il\n");
        for (NewsletterSubscriberDto s : subscribers) {
            csv.append('"').append(s.email().replace("\"", "\"\"")).append('"').append(',')
                    .append(s.subscribedAt().format(CSV_DATE_FORMAT)).append('\n');
        }

        byte[] body = csv.toString().getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename("iscritti-newsletter.csv").build());
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(body);
    }
}
