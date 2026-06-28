package it.andreamoiochef.backend.auth.dto;

import it.andreamoiochef.backend.auth.AdminUser;

public record AdminUserDto(
        Long id,
        String email,
        String fullName,
        String role
) {
    public static AdminUserDto fromEntity(AdminUser adminUser) {
        return new AdminUserDto(
                adminUser.getId(),
                adminUser.getEmail(),
                adminUser.getFullName(),
                adminUser.getRole().name()
        );
    }
}
