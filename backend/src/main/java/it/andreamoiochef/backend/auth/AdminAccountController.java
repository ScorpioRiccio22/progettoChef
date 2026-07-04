package it.andreamoiochef.backend.auth;

import it.andreamoiochef.backend.auth.dto.AdminResetPasswordRequest;
import it.andreamoiochef.backend.auth.dto.AdminUserDto;
import it.andreamoiochef.backend.auth.dto.CreateAdminUserRequest;
import it.andreamoiochef.backend.auth.dto.UpdateAdminRoleRequest;
import it.andreamoiochef.backend.auth.dto.UpdateAdminStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Gestione degli account dell'area admin: creazione, cambio ruolo,
 * abilitazione/disabilitazione, reset password.
 * <p>
 * Riservato esclusivamente al ruolo SUPERADMIN: un ADMIN o un EDITOR non
 * devono poter né vedere né modificare gli altri account.
 */
@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPERADMIN')")
public class AdminAccountController {

    private final AdminAccountService accountService;

    @GetMapping
    public ResponseEntity<List<AdminUserDto>> list() {
        return ResponseEntity.ok(accountService.listAll());
    }

    @PostMapping
    public ResponseEntity<AdminUserDto> create(@Valid @RequestBody CreateAdminUserRequest request) {
        return ResponseEntity.ok(accountService.create(request));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<AdminUserDto> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAdminRoleRequest request,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        return ResponseEntity.ok(accountService.updateRole(id, request, currentUser.getUsername()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminUserDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAdminStatusRequest request,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        return ResponseEntity.ok(accountService.updateStatus(id, request, currentUser.getUsername()));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(
            @PathVariable Long id,
            @Valid @RequestBody AdminResetPasswordRequest request
    ) {
        accountService.resetPassword(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        accountService.delete(id, currentUser.getUsername());
        return ResponseEntity.noContent().build();
    }
}
