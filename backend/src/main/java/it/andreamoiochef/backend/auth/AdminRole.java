package it.andreamoiochef.backend.auth;

/**
 * Ruoli dell'area amministrativa, in ordine crescente di privilegio:
 * <ul>
 *   <li>{@link #EDITOR} — accesso limitato ai soli contenuti "grafici" del sito
 *       (piatti, servizi, eventi, testimonianze, chi siamo). Non vede messaggi,
 *       newsletter, impostazioni del sito né la gestione account.</li>
 *   <li>{@link #ADMIN} — accesso completo a tutti i contenuti, messaggi e
 *       impostazioni, ma non può gestire gli account amministrativi.</li>
 *   <li>{@link #SUPERADMIN} — come ADMIN, con in più la possibilità di creare,
 *       modificare, disabilitare account e reimpostarne la password.</li>
 * </ul>
 */
public enum AdminRole {
    EDITOR,
    ADMIN,
    SUPERADMIN
}
