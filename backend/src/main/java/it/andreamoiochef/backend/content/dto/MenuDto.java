package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.Menu;

import java.util.List;

public record MenuDto(
        Long id,
        String name,
        String type,
        String description,
        boolean active,
        int sortOrder,
        List<MenuItemDto> items
) {
    public static MenuDto fromEntity(Menu menu, List<MenuItemDto> items) {
        return new MenuDto(
                menu.getId(), menu.getName(), menu.getType(), menu.getDescription(),
                menu.isActive(), menu.getSortOrder(), items
        );
    }
}
