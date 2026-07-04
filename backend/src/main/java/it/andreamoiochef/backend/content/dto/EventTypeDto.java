package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.EventType;

import java.util.List;

public record EventTypeDto(
        Long id,
        String title,
        String description,
        String icon,
        String imageUrl,
        String videoUrl,
        List<String> details,
        int sortOrder,
        boolean published
) {
    public static EventTypeDto fromEntity(EventType e) {
        return new EventTypeDto(
                e.getId(), e.getTitle(), e.getDescription(), e.getIcon(),
                e.getImageUrl(), e.getVideoUrl(), List.copyOf(e.getDetails()), e.getSortOrder(), e.isPublished()
        );
    }
}
