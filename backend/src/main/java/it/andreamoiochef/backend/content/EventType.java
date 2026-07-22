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
@Table(name = "event_types")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EventType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    /** Usato per l'URL della landing page pubblica: /eventi/{slug} */
    @Column(nullable = false, length = 180, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Testo più esteso per la landing page dedicata. Per gli eventi "privati" si
     * consiglia di lasciarlo breve: la landing di quel tipo mostra solo foto/video
     * e una descrizione sintetica, senza il lungo elenco di dettagli.
     */
    @Column(name = "body_content", columnDefinition = "TEXT")
    private String bodyContent;

    /** Nome icona MUI (es. "private", "corporate", "catering", "cooking-class"). */
    @Column(length = 60)
    private String icon;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    /** URL pubblico del video mp4 caricato per questa tipologia di evento (opzionale). */
    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @ElementCollection
    @CollectionTable(name = "event_type_details", joinColumns = @JoinColumn(name = "event_type_id"))
    @Column(name = "detail", length = 255)
    @OrderColumn(name = "detail_order")
    private List<String> details = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "event_type_gallery_images", joinColumns = @JoinColumn(name = "event_type_id"))
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
