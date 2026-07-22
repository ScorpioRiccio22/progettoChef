package it.andreamoiochef.backend.content;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Un singolo testo configurabile del sito (titolo, descrizione, testo di un
 * pulsante...), identificato da una chiave stabile usata dal frontend.
 */
@Entity
@Table(name = "site_texts")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SiteText {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text_key", nullable = false, length = 120, unique = true)
    private String key;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    /** Raggruppamento per la UI di amministrazione (es. "home", "services", "events"...). */
    @Column(nullable = false, length = 60)
    private String category;

    /** Etichetta leggibile mostrata in admin per spiegare a cosa serve questo testo. */
    @Column(nullable = false, length = 200)
    private String label;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
