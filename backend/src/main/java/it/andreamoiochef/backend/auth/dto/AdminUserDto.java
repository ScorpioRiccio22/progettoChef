package it.andreamoiochef.backend.auth.dto;

import it.andreamoiochef.backend.auth.AdminUser;

import java.time.LocalDateTime;

public record AdminUserDto(
        Long id,
        String email,
        String fullName,
        String role,
        boolean enabled,
        LocalDateTime createdAt,
        LocalDateTime lastLoginAt
) {
    public static AdminUserDto fromEntity(AdminUser adminUser) {
        return new AdminUserDto(
                adminUser.getId(),
                adminUser.getEmail(),
                adminUser.getFullName(),
                adminUser.getRole().name(),
                adminUser.isEnabled(),
                adminUser.getCreatedAt(),
                adminUser.getLastLoginAt()
        );
    }
}
