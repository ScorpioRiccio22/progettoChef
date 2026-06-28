package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.CoreValue;

public record CoreValueDto(
        Long id,
        String title,
        String text,
        int sortOrder
) {
    public static CoreValueDto fromEntity(CoreValue v) {
        return new CoreValueDto(v.getId(), v.getTitle(), v.getText(), v.getSortOrder());
    }
}
