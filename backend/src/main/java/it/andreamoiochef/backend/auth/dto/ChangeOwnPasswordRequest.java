package it.andreamoiochef.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeOwnPasswordRequest(
        @NotBlank(message = "La password attuale è obbligatoria")
        String currentPassword,

        @NotBlank(message = "La nuova password è obbligatoria")
        @Size(min = 8, max = 72, message = "La password deve avere almeno 8 caratteri")
        String newPassword
) {
}
