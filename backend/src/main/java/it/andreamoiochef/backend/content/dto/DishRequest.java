package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record DishRequest(
        @NotBlank(message = "Il nome è obbligatorio") String name,
        @NotBlank(message = "La categoria è obbligatoria") String category,
        String description,
        String imageUrl,
        List<String> tags,
        Boolean published
) {
}
