package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

public record MilestoneRequest(
        @NotBlank(message = "L'anno è obbligatorio") String year,
        @NotBlank(message = "Il testo è obbligatorio") String text
) {
}
