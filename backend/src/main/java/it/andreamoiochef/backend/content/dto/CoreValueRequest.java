package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

public record CoreValueRequest(
        @NotBlank(message = "Il titolo è obbligatorio") String title,
        @NotBlank(message = "Il testo è obbligatorio") String text
) {
}
