package it.andreamoiochef.backend.storage;

import it.andreamoiochef.backend.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"
    );
    private static final long MAX_SIZE_BYTES = 8L * 1024 * 1024; // 8 MB

    private final StorageProperties storageProperties;

    /**
     * Salva il file su disco con un nome univoco e ne restituisce l'URL
     * pubblico (relativo), già pronto per essere salvato nei campi
     * "imageUrl" delle entity di contenuto e usato direttamente dal frontend.
     */
    public String store(MultipartFile file) {
        validate(file);

        String extension = extractExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;

        try {
            Path uploadPath = Paths.get(storageProperties.uploadDir());
            Files.createDirectories(uploadPath);
            Path destination = uploadPath.resolve(filename).normalize();

            if (!destination.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Nome file non valido");
            }

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("Impossibile salvare il file caricato", e);
        }

        String prefix = storageProperties.publicUrlPrefix();
        return (prefix.endsWith("/") ? prefix.substring(0, prefix.length() - 1) : prefix) + "/" + filename;
    }

    /** Elimina un file precedentemente caricato, dato il suo URL pubblico. Ignora url esterni o assenti. */
    public void deleteIfManaged(String publicUrl) {
        if (!StringUtils.hasText(publicUrl)) {
            return;
        }
        String prefix = storageProperties.publicUrlPrefix();
        if (!publicUrl.startsWith(prefix)) {
            return; // url esterno (es. inserito manualmente): non gestito da questo storage
        }
        String filename = publicUrl.substring(publicUrl.lastIndexOf('/') + 1);
        try {
            Path target = Paths.get(storageProperties.uploadDir()).resolve(filename).normalize();
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // best-effort: un file orfano non blocca l'operazione principale
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Il file è vuoto o non è stato inviato");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new IllegalArgumentException("Il file supera la dimensione massima di 8MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Formato immagine non supportato (consentiti: JPG, PNG, WEBP, GIF, SVG)");
        }
    }

    private String extractExtension(String originalFilename) {
        if (!StringUtils.hasText(originalFilename)) {
            return "";
        }
        List<String> parts = List.of(originalFilename.split("\\."));
        if (parts.size() < 2) {
            return "";
        }
        String ext = parts.get(parts.size() - 1).toLowerCase().replaceAll("[^a-z0-9]", "");
        return ext.isEmpty() ? "" : "." + ext;
    }
}
