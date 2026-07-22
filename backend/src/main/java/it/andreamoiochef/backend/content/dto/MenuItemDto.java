package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.MenuItem;

import java.math.BigDecimal;

public record MenuItemDto(
        Long id,
        String name,
        String category,
        String description,
        String imageUrl,
        BigDecimal price,
        int sortOrder
) {
    public static MenuItemDto fromEntity(MenuItem item) {
        return new MenuItemDto(
                item.getId(), item.getName(), item.getCategory(), item.getDescription(),
                item.getImageUrl(), item.getPrice(), item.getSortOrder()
        );
    }
}
