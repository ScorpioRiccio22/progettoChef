package it.andreamoiochef.backend.leads;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscribers")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(name = "subscribed_at", nullable = false)
    private LocalDateTime subscribedAt;

    @PrePersist
    void onCreate() {
        this.subscribedAt = LocalDateTime.now();
    }
}
