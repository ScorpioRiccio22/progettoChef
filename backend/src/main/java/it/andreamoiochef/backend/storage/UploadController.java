package it.andreamoiochef.backend.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    /**
     * Carica un'immagine (loghi, foto piatti, foto eventi, foto chi-siamo...)
     * e restituisce l'URL pubblico da salvare nel campo "imageUrl" della
     * risorsa di contenuto corrispondente. Richiede ruolo ADMIN.
     */
    @PostMapping
    public ResponseEntity<UploadResponse> upload(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ResponseEntity.ok(new UploadResponse(url));
    }
}
