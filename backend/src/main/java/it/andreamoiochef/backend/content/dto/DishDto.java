package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.Dish;

import java.util.List;

public record DishDto(
        Long id,
        String name,
        String category,
        String description,
        String imageUrl,
        List<String> tags,
        int sortOrder,
        boolean published
) {
    public static DishDto fromEntity(Dish d) {
        return new DishDto(
                d.getId(), d.getName(), d.getCategory(), d.getDescription(),
                d.getImageUrl(), List.copyOf(d.getTags()), d.getSortOrder(), d.isPublished()
        );
    }
}
