package it.andreamoiochef.backend.leads.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record NewsletterSubscribeRequest(
        @NotBlank(message = "L'email è obbligatoria") @Email(message = "Email non valida") String email
) {
}
