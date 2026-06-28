package it.andreamoiochef.backend.leads;

import it.andreamoiochef.backend.leads.dto.ContactMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/contact-messages")
@RequiredArgsConstructor
public class AdminContactMessageController {

    private static final DateTimeFormatter CSV_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final ContactMessageService service;

    @GetMapping
    public ResponseEntity<List<ContactMessageDto>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount() {
        return ResponseEntity.ok(Map.of("count", service.countUnread()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ContactMessageDto> markRead(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean read) {
        return ResponseEntity.ok(service.markAsRead(id, read));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export() {
        List<ContactMessageDto> messages = service.listAll();

        StringBuilder csv = new StringBuilder();
        csv.append("Data,Nome,Email,Telefono,Oggetto,Messaggio,Letto\n");
        for (ContactMessageDto m : messages) {
            csv.append(csvCell(m.createdAt().format(CSV_DATE_FORMAT))).append(',')
                    .append(csvCell(m.name())).append(',')
                    .append(csvCell(m.email())).append(',')
                    .append(csvCell(m.phone())).append(',')
                    .append(csvCell(m.subject())).append(',')
                    .append(csvCell(m.message())).append(',')
                    .append(m.read() ? "Sì" : "No").append('\n');
        }

        byte[] body = csv.toString().getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(org.springframework.http.ContentDisposition
                .attachment().filename("messaggi-contatto.csv").build());
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(body);
    }

    private String csvCell(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }
}
