package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

public record ServiceOfferingRequest(
        @NotBlank(message = "Il titolo è obbligatorio") String title,
        String tagline,
        String description,
        String icon,
        String imageUrl,
        Boolean published
) {
}
