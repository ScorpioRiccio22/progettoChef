package it.andreamoiochef.backend.auth;

import it.andreamoiochef.backend.auth.dto.AdminUserDto;
import it.andreamoiochef.backend.auth.dto.ChangeOwnPasswordRequest;
import it.andreamoiochef.backend.auth.dto.LoginRequest;
import it.andreamoiochef.backend.auth.dto.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AdminAccountService accountService;

    /**
     * Login per l'area admin. Pubblico (non richiede token).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Utente correntemente autenticato, in base al token JWT inviato.
     * Usato dal frontend per ripristinare la sessione admin dopo un refresh pagina.
     */
    @GetMapping("/me")
    public ResponseEntity<AdminUserDto> me(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
    }

    /**
     * Cambio password personale, disponibile per qualunque admin autenticato
     * (SUPERADMIN, ADMIN o EDITOR) previa verifica della password attuale.
     */
    @PatchMapping("/me/password")
    public ResponseEntity<Void> changeOwnPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangeOwnPasswordRequest request
    ) {
        accountService.changeOwnPassword(userDetails.getUsername(), request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Con JWT stateless non c'è nulla da invalidare lato server: il frontend
     * scarta semplicemente il token. Endpoint mantenuto per simmetria dell'API
     * e per eventuali estensioni future (blacklist, refresh token, audit log).
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }
}
