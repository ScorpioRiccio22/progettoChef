package it.andreamoiochef.backend.auth;

import it.andreamoiochef.backend.auth.dto.AdminUserDto;
import it.andreamoiochef.backend.auth.dto.LoginRequest;
import it.andreamoiochef.backend.auth.dto.LoginResponse;
import it.andreamoiochef.backend.common.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AdminUserRepository adminUserRepository;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Email o password non corretti");
        }

        AdminUser adminUser = adminUserRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Email o password non corretti"));

        adminUser.setLastLoginAt(LocalDateTime.now());
        adminUserRepository.save(adminUser);

        UserDetails userDetails = userDetailsService.loadUserByUsername(adminUser.getEmail());
        String token = jwtService.generateToken(userDetails);

        return LoginResponse.of(token, jwtService.expirationSeconds(), AdminUserDto.fromEntity(adminUser));
    }

    @Transactional(readOnly = true)
    public AdminUserDto getCurrentUser(String email) {
        AdminUser adminUser = adminUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new InvalidCredentialsException("Utente non trovato"));
        return AdminUserDto.fromEntity(adminUser);
    }
}
