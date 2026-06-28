package it.andreamoiochef.backend.leads.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactMessageRequest(
        @NotBlank(message = "Il nome è obbligatorio") String name,
        @NotBlank(message = "L'email è obbligatoria") @Email(message = "Email non valida") String email,
        String phone,
        @NotBlank(message = "L'oggetto è obbligatorio") String subject,
        @NotBlank(message = "Il messaggio è obbligatorio") String message
) {
}
