package it.andreamoiochef.backend.auth.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateAdminRoleRequest(
        @NotNull(message = "Il ruolo è obbligatorio")
        String role
) {
}
