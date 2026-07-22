package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotNull;

public record SiteTextRequest(
        @NotNull(message = "Il valore è obbligatorio") String value
) {
}
