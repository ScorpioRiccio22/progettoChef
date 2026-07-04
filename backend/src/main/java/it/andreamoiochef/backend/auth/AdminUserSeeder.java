package it.andreamoiochef.backend.auth;

import it.andreamoiochef.backend.config.AdminSeedProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Al primo avvio, se la tabella admin_users è vuota, crea l'amministratore
 * di default usando le credenziali indicate nelle variabili d'ambiente
 * ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD (vedi application.yml / docker-compose.yml).
 *
 * IMPORTANTE: cambiare la password di default al primo accesso in produzione.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserSeeder {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminSeedProperties adminSeedProperties;

    @EventListener(ApplicationReadyEvent.class)
    public void seedDefaultAdmin() {
        if (!adminSeedProperties.enabled()) {
            return;
        }

        if (adminUserRepository.count() > 0) {
            return;
        }

        // Il primo account creato deve essere SUPERADMIN: è l'unico ruolo in
        // grado di creare/gestire tutti gli altri account admin, quindi non
        // può nascere già "degradato" ad ADMIN.
        AdminUser admin = new AdminUser(
                adminSeedProperties.email(),
                passwordEncoder.encode(adminSeedProperties.password()),
                adminSeedProperties.fullName(),
                AdminRole.SUPERADMIN
        );

        adminUserRepository.save(admin);

        log.warn("Creato utente SUPERADMIN di default ({}). Cambiare la password al primo accesso!",
                adminSeedProperties.email());
    }
}
