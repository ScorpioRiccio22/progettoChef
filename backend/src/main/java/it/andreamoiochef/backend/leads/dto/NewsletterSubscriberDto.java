package it.andreamoiochef.backend.leads.dto;

import it.andreamoiochef.backend.leads.NewsletterSubscriber;

import java.time.LocalDateTime;

public record NewsletterSubscriberDto(
        Long id,
        String email,
        LocalDateTime subscribedAt
) {
    public static NewsletterSubscriberDto fromEntity(NewsletterSubscriber s) {
        return new NewsletterSubscriberDto(s.getId(), s.getEmail(), s.getSubscribedAt());
    }
}
