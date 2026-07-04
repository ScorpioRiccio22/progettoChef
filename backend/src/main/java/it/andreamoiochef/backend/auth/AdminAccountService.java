package it.andreamoiochef.backend.auth;

import it.andreamoiochef.backend.auth.dto.AdminResetPasswordRequest;
import it.andreamoiochef.backend.auth.dto.AdminUserDto;
import it.andreamoiochef.backend.auth.dto.ChangeOwnPasswordRequest;
import it.andreamoiochef.backend.auth.dto.CreateAdminUserRequest;
import it.andreamoiochef.backend.auth.dto.UpdateAdminRoleRequest;
import it.andreamoiochef.backend.auth.dto.UpdateAdminStatusRequest;
import it.andreamoiochef.backend.common.ConflictException;
import it.andreamoiochef.backend.common.InvalidCredentialsException;
import it.andreamoiochef.backend.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Gestione degli account dell'area admin, riservata ai SUPERADMIN (il
 * controllo dei permessi avviene a livello di controller con @PreAuthorize).
 * <p>
 * Contiene le protezioni essenziali per non lasciare mai il sistema senza
 * nessun SUPERADMIN abilitato in grado di amministrare gli altri account.
 */
@Service
@RequiredArgsConstructor
public class AdminAccountService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<AdminUserDto> listAll() {
        return adminUserRepository.findAllByOrderByCreatedAtAsc().stream()
                .map(AdminUserDto::fromEntity)
                .toList();
    }

    @Transactional
    public AdminUserDto create(CreateAdminUserRequest request) {
        String email = request.email().trim().toLowerCase();

        if (adminUserRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Esiste già un account con questa email");
        }

        AdminRole role = parseRole(request.role());

        AdminUser adminUser = new AdminUser(
                email,
                passwordEncoder.encode(request.password()),
                request.fullName().trim(),
                role
        );

        adminUserRepository.save(adminUser);
        return AdminUserDto.fromEntity(adminUser);
    }

    @Transactional
    public AdminUserDto updateRole(Long id, UpdateAdminRoleRequest request, String currentUserEmail) {
        AdminUser target = findOrThrow(id);
        AdminRole newRole = parseRole(request.role());

        if (target.getRole() == AdminRole.SUPERADMIN
                && newRole != AdminRole.SUPERADMIN
                && isLastActiveSuperadmin(target)) {
            throw new IllegalArgumentException("Non è possibile degradare l'ultimo SUPERADMIN attivo");
        }

        target.setRole(newRole);
        adminUserRepository.save(target);
        return AdminUserDto.fromEntity(target);
    }

    @Transactional
    public AdminUserDto updateStatus(Long id, UpdateAdminStatusRequest request, String currentUserEmail) {
        AdminUser target = findOrThrow(id);

        if (!request.enabled()) {
            if (target.getEmail().equalsIgnoreCase(currentUserEmail)) {
                throw new IllegalArgumentException("Non puoi disabilitare il tuo stesso account");
            }
            if (target.getRole() == AdminRole.SUPERADMIN && isLastActiveSuperadmin(target)) {
                throw new IllegalArgumentException("Non è possibile disabilitare l'ultimo SUPERADMIN attivo");
            }
        }

        target.setEnabled(request.enabled());
        adminUserRepository.save(target);
        return AdminUserDto.fromEntity(target);
    }

    @Transactional
    public void resetPassword(Long id, AdminResetPasswordRequest request) {
        AdminUser target = findOrThrow(id);
        target.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        adminUserRepository.save(target);
    }

    @Transactional
    public void delete(Long id, String currentUserEmail) {
        AdminUser target = findOrThrow(id);

        if (target.getEmail().equalsIgnoreCase(currentUserEmail)) {
            throw new IllegalArgumentException("Non puoi eliminare il tuo stesso account");
        }
        if (target.getRole() == AdminRole.SUPERADMIN && isLastActiveSuperadmin(target)) {
            throw new IllegalArgumentException("Non è possibile eliminare l'ultimo SUPERADMIN attivo");
        }

        adminUserRepository.delete(target);
    }

    @Transactional
    public void changeOwnPassword(String email, ChangeOwnPasswordRequest request) {
        AdminUser adminUser = adminUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));

        if (!passwordEncoder.matches(request.currentPassword(), adminUser.getPasswordHash())) {
            throw new InvalidCredentialsException("La password attuale non è corretta");
        }

        adminUser.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        adminUserRepository.save(adminUser);
    }

    private boolean isLastActiveSuperadmin(AdminUser target) {
        long activeSuperadmins = adminUserRepository.countByRoleAndEnabledTrue(AdminRole.SUPERADMIN);
        // Se il target stesso è conteggiato come attivo, è "l'ultimo" quando il conteggio è 1.
        return target.isEnabled() && activeSuperadmins <= 1;
    }

    private AdminUser findOrThrow(Long id) {
        return adminUserRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Account non trovato"));
    }

    private AdminRole parseRole(String rawRole) {
        try {
            return AdminRole.valueOf(rawRole.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Ruolo non valido: " + rawRole);
        }
    }
}
