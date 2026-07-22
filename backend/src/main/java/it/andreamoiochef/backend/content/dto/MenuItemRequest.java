package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record MenuItemRequest(
        @NotBlank(message = "Il nome è obbligatorio") String name,
        String category,
        String description,
        String imageUrl,
        @NotNull(message = "Il prezzo è obbligatorio")
        @DecimalMin(value = "0.0", message = "Il prezzo non può essere negativo") BigDecimal price
) {
}
