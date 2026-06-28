package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.ServiceOffering;

public record ServiceOfferingDto(
        Long id,
        String title,
        String tagline,
        String description,
        String icon,
        String imageUrl,
        int sortOrder,
        boolean published
) {
    public static ServiceOfferingDto fromEntity(ServiceOffering s) {
        return new ServiceOfferingDto(
                s.getId(), s.getTitle(), s.getTagline(), s.getDescription(),
                s.getIcon(), s.getImageUrl(), s.getSortOrder(), s.isPublished()
        );
    }
}
