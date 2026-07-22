package it.andreamoiochef.backend.content;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_offerings")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ServiceOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    /** Usato per l'URL della pagina di dettaglio pubblica: /servizi/{slug} */
    @Column(nullable = false, length = 180, unique = true)
    private String slug;

    @Column(length = 255)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Testo più esteso mostrato nella pagina di dettaglio del servizio (paragrafi separati da riga vuota). */
    @Column(name = "body_content", columnDefinition = "TEXT")
    private String bodyContent;

    /** Nome dell'icona MUI da usare in frontend (es. "home", "event", "business"). */
    @Column(length = 60)
    private String icon;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    /** URL pubblico del video mp4 (opzionale), mostrato nella pagina di dettaglio del servizio. */
    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @ElementCollection
    @CollectionTable(name = "service_offering_gallery_images", joinColumns = @JoinColumn(name = "service_offering_id"))
    @Column(name = "image_url", length = 500)
    @OrderColumn(name = "image_order")
    private List<String> galleryImageUrls = new ArrayList<>();

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private boolean published = true;

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

