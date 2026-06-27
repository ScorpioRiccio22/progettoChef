package it.andreamoiochef.backend.auth.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds,
        AdminUserDto user
) {
    public static LoginResponse of(String accessToken, long expiresInSeconds, AdminUserDto user) {
        return new LoginResponse(accessToken, "Bearer", expiresInSeconds, user);
    }
}
