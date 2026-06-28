package it.andreamoiochef.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Espone la cartella di upload come risorse statiche pubbliche, così le
 * immagini caricate dall'area admin (loghi, foto piatti, foto eventi...)
 * sono visibili direttamente dal frontend pubblico via URL, senza passare
 * per l'autenticazione.
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final StorageProperties storageProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String prefix = storageProperties.publicUrlPrefix();
        String pattern = (prefix.endsWith("/") ? prefix : prefix + "/") + "**";

        String uploadDir = storageProperties.uploadDir();
        String location = uploadDir.endsWith("/") ? "file:" + uploadDir : "file:" + uploadDir + "/";

        registry.addResourceHandler(pattern)
                .addResourceLocations(location);
    }
}
