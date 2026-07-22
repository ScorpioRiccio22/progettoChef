package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ServiceOfferingRequest(
        @NotBlank(message = "Il titolo è obbligatorio") String title,
        /** Se omesso o vuoto, viene generato automaticamente dal titolo. */
        String slug,
        String tagline,
        String description,
        String bodyContent,
        String icon,
        String imageUrl,
        String videoUrl,
        List<String> galleryImageUrls,
        Boolean published
) {
}
