package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotBlank;

public record MenuRequest(
        @NotBlank(message = "Il nome è obbligatorio") String name,
        /** "SHOP" o "EVENTS". Se omesso, di default è "SHOP" (compatibilità con i menu esistenti). */
        String type,
        String description,
        /** Se true, questo diventa l'unico menu "attivo" (in vetrina) per il suo tipo. */
        Boolean active
) {
}
