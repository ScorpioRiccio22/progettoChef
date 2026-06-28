package it.andreamoiochef.backend.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Adatta {@link AdminUser} al modello di Spring Security.
 * L'unico "utente" del sistema, per ora, è l'amministratore dell'area /admin.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AdminUser adminUser = adminUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato: " + email));

        return User.builder()
                .username(adminUser.getEmail())
                .password(adminUser.getPasswordHash())
                .disabled(!adminUser.isEnabled())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + adminUser.getRole().name())))
                .build();
    }
}
