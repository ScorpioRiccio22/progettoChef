package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.ServiceOffering;

import java.util.List;

public record ServiceOfferingDto(
        Long id,
        String title,
        String slug,
        String tagline,
        String description,
        String bodyContent,
        String icon,
        String imageUrl,
        String videoUrl,
        List<String> galleryImageUrls,
        int sortOrder,
        boolean published
) {
    public static ServiceOfferingDto fromEntity(ServiceOffering s) {
        return new ServiceOfferingDto(
                s.getId(), s.getTitle(), s.getSlug(), s.getTagline(), s.getDescription(), s.getBodyContent(),
                s.getIcon(), s.getImageUrl(), s.getVideoUrl(), List.copyOf(s.getGalleryImageUrls()),
                s.getSortOrder(), s.isPublished()
        );
    }
}
