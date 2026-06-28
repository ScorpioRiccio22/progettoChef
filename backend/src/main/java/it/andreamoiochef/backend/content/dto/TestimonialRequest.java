package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

public record TestimonialRequest(
        @NotBlank(message = "L'autore è obbligatorio") String author,
        String role,
        @NotBlank(message = "Il testo della recensione è obbligatorio") String quote,
        Boolean published
) {
}
