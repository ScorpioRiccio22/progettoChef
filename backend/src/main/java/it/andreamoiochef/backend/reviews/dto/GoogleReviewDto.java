package it.andreamoiochef.backend.reviews.dto;

/** Una singola recensione Google, così come mostrata sul sito pubblico. */
public record GoogleReviewDto(
        String authorName,
        String authorPhotoUrl,
        String profileUrl,
        int rating,
        String relativeTime,
        String text,
        long timestamp
) {
}
