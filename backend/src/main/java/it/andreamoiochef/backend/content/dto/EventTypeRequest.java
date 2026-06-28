package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record EventTypeRequest(
        @NotBlank(message = "Il titolo è obbligatorio") String title,
        String description,
        String icon,
        String imageUrl,
        List<String> details,
        Boolean published
) {
}
