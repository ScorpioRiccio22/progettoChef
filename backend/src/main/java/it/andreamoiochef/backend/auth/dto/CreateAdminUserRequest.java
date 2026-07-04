package it.andreamoiochef.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateAdminUserRequest(
        @NotBlank(message = "L'email è obbligatoria")
        @Email(message = "Formato email non valido")
        String email,

        @NotBlank(message = "Il nome è obbligatorio")
        @Size(max = 180, message = "Il nome è troppo lungo")
        String fullName,

        @NotBlank(message = "La password è obbligatoria")
        @Size(min = 8, max = 72, message = "La password deve avere almeno 8 caratteri")
        String password,

        @NotNull(message = "Il ruolo è obbligatorio")
        String role
) {
}
