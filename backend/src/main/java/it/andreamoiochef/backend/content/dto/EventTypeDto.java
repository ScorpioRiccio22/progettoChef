package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.EventType;

import java.util.List;

public record EventTypeDto(
        Long id,
        String title,
        String slug,
        String description,
        String bodyContent,
        String icon,
        String imageUrl,
        String videoUrl,
        List<String> details,
        List<String> galleryImageUrls,
        int sortOrder,
        boolean published
) {
    public static EventTypeDto fromEntity(EventType e) {
        return new EventTypeDto(
                e.getId(), e.getTitle(), e.getSlug(), e.getDescription(), e.getBodyContent(), e.getIcon(),
                e.getImageUrl(), e.getVideoUrl(), List.copyOf(e.getDetails()), List.copyOf(e.getGalleryImageUrls()),
                e.getSortOrder(), e.isPublished()
        );
    }
}
