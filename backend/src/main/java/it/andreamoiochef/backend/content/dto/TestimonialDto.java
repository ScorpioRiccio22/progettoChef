package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.Testimonial;

public record TestimonialDto(
        Long id,
        String author,
        String role,
        String quote,
        int sortOrder,
        boolean published
) {
    public static TestimonialDto fromEntity(Testimonial t) {
        return new TestimonialDto(t.getId(), t.getAuthor(), t.getRole(), t.getQuote(), t.getSortOrder(), t.isPublished());
    }
}
