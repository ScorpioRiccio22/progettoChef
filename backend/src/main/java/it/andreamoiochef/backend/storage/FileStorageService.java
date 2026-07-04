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

    // --- Immagini (loghi, foto piatti, foto eventi, foto chi-siamo...) ---
    private static final Set<String> ALLOWED_IMAGE_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"
    );
    private static final long MAX_IMAGE_SIZE_BYTES = 8L * 1024 * 1024; // 8 MB

    // --- Video (soprattutto per gli eventi: mp4 caricati dall'admin) ---
    private static final Set<String> ALLOWED_VIDEO_CONTENT_TYPES = Set.of(
            "video/mp4"
    );
    // Consentiamo file più pesanti ma comunque ragionevoli per uno storage locale su disco.
    private static final long MAX_VIDEO_SIZE_BYTES = 200L * 1024 * 1024; // 200 MB
    private static final String VIDEO_SUBDIR = "videos";

    private final StorageProperties storageProperties;

    /**
     * Salva un'immagine su disco con un nome univoco e ne restituisce l'URL
     * pubblico (relativo), pronto per essere salvato nei campi "imageUrl"
     * delle entity di contenuto e usato direttamente dal frontend.
     */
    public String store(MultipartFile file) {
        return storeInternal(
                file,
                ALLOWED_IMAGE_CONTENT_TYPES,
                MAX_IMAGE_SIZE_BYTES,
                null,
                "Formato immagine non supportato (consentiti: JPG, PNG, WEBP, GIF, SVG)",
                "8MB"
        );
    }

    /**
     * Salva un video (mp4) su disco, in una sottocartella dedicata, e ne
     * restituisce l'URL pubblico da salvare nel campo "videoUrl" (es. delle
     * tipologie di evento). Il file system serve i video con supporto nativo
     * alle richieste Range (necessario per lo streaming/seek nel player).
     */
    public String storeVideo(MultipartFile file) {
        return storeInternal(
                file,
                ALLOWED_VIDEO_CONTENT_TYPES,
                MAX_VIDEO_SIZE_BYTES,
                VIDEO_SUBDIR,
                "Formato video non supportato (è consentito solo MP4)",
                "200MB"
        );
    }

    private String storeInternal(
            MultipartFile file,
            Set<String> allowedContentTypes,
            long maxSizeBytes,
            String subdir,
            String contentTypeErrorMessage,
            String maxSizeLabel
    ) {
        validate(file, allowedContentTypes, maxSizeBytes, contentTypeErrorMessage, maxSizeLabel);

        String extension = extractExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;

        try {
            Path uploadPath = Paths.get(storageProperties.uploadDir());
            Path targetDir = StringUtils.hasText(subdir) ? uploadPath.resolve(subdir) : uploadPath;
            Files.createDirectories(targetDir);
            Path destination = targetDir.resolve(filename).normalize();

            if (!destination.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Nome file non valido");
            }

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("Impossibile salvare il file caricato", e);
        }

        String prefix = normalizedPrefix();
        String relativePath = StringUtils.hasText(subdir) ? subdir + "/" + filename : filename;
        return prefix + "/" + relativePath;
    }

    /** Elimina un file precedentemente caricato (immagine o video), dato il suo URL pubblico. Ignora url esterni o assenti. */
    public void deleteIfManaged(String publicUrl) {
        if (!StringUtils.hasText(publicUrl)) {
            return;
        }
        String prefix = normalizedPrefix();
        if (!publicUrl.startsWith(prefix)) {
            return; // url esterno (es. inserito manualmente): non gestito da questo storage
        }
        String relativePath = publicUrl.substring(prefix.length());
        if (relativePath.startsWith("/")) {
            relativePath = relativePath.substring(1);
        }
        if (!StringUtils.hasText(relativePath)) {
            return;
        }
        try {
            Path uploadPath = Paths.get(storageProperties.uploadDir());
            Path target = uploadPath.resolve(relativePath).normalize();
            if (!target.startsWith(uploadPath)) {
                return; // path traversal: ignorato
            }
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // best-effort: un file orfano non blocca l'operazione principale
        }
    }

    private void validate(
            MultipartFile file,
            Set<String> allowedContentTypes,
            long maxSizeBytes,
            String contentTypeErrorMessage,
            String maxSizeLabel
    ) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Il file è vuoto o non è stato inviato");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("Il file supera la dimensione massima di " + maxSizeLabel);
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedContentTypes.contains(contentType)) {
            throw new IllegalArgumentException(contentTypeErrorMessage);
        }
    }

    private String normalizedPrefix() {
        String prefix = storageProperties.publicUrlPrefix();
        return prefix.endsWith("/") ? prefix.substring(0, prefix.length() - 1) : prefix;
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
