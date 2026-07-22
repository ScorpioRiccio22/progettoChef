package it.andreamoiochef.backend.content;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Impostazioni globali del sito: un'unica riga (id sempre = 1) con i dati di
 * brand, contatti, social, hero e "chi siamo" che prima vivevano come
 * costanti statiche in frontend/src/lib/content.ts.
 */
@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SiteSettings {

    @Id
    private Long id = 1L;

    // --- Brand ---------------------------------------------------------
    @Column(name = "brand_name", nullable = false, length = 180)
    private String brandName;

    @Column(name = "brand_handle", length = 180)
    private String brandHandle;

    @Column(name = "brand_role", length = 180)
    private String brandRole;

    @Column(name = "brand_city", length = 180)
    private String brandCity;

    @Column(name = "brand_payoff", length = 500)
    private String brandPayoff;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "favicon_url", length = 500)
    private String faviconUrl;

    // --- Contatti --------------------------------------------------------
    @Column(name = "contact_email", length = 180)
    private String contactEmail;

    @Column(name = "whatsapp_number", length = 60)
    private String whatsappNumber;

    @Column(name = "whatsapp_link", length = 300)
    private String whatsappLink;

    @Column(name = "contact_area", length = 255)
    private String contactArea;

    /**
     * Indirizzo fisico completo (via, civico, CAP, città), usato per
     * geocodificarlo (Nominatim/OpenStreetMap) e mostrare la mini mappa
     * nella pagina Contatti. Se vuoto, la mappa non viene mostrata.
     */
    @Column(name = "map_address", length = 500)
    private String mapAddress;

    // --- Social ----------------------------------------------------------
    @Column(name = "instagram_url", length = 300)
    private String instagramUrl;

    @Column(name = "facebook_url", length = 300)
    private String facebookUrl;

    @Column(name = "tiktok_url", length = 300)
    private String tiktokUrl;

    @Column(name = "threads_url", length = 300)
    private String threadsUrl;

    // --- Hero (home) ------------------------------------------------------
    @Column(name = "hero_title", length = 300)
    private String heroTitle;

    @Column(name = "hero_subtitle", length = 600)
    private String heroSubtitle;

    @Column(name = "hero_image_url", length = 500)
    private String heroImageUrl;

    // --- Chi siamo ---------------------------------------------------------
    @Column(name = "about_intro", columnDefinition = "TEXT")
    private String aboutIntro;

    @Column(name = "about_paragraph_1", columnDefinition = "TEXT")
    private String aboutParagraph1;

    @Column(name = "about_paragraph_2", columnDefinition = "TEXT")
    private String aboutParagraph2;

    @Column(name = "about_image_url", length = 500)
    private String aboutImageUrl;

    @Column(name = "stat_years_value", length = 40)
    private String statYearsValue;

    @Column(name = "stat_years_label", length = 120)
    private String statYearsLabel;

    @Column(name = "stat_events_value", length = 40)
    private String statEventsValue;

    @Column(name = "stat_events_label", length = 120)
    private String statEventsLabel;

    @Column(name = "stat_ingredients_value", length = 40)
    private String statIngredientsValue;

    @Column(name = "stat_ingredients_label", length = 120)
    private String statIngredientsLabel;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
