package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record EventTypeRequest(
        @NotBlank(message = "Il titolo è obbligatorio") String title,
        /** Se omesso o vuoto, viene generato automaticamente dal titolo. */
        String slug,
        String description,
        String bodyContent,
        String icon,
        String imageUrl,
        String videoUrl,
        List<String> details,
        List<String> galleryImageUrls,
        Boolean published
) {
}
