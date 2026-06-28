package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.Milestone;

public record MilestoneDto(
        Long id,
        String year,
        String text,
        int sortOrder
) {
    public static MilestoneDto fromEntity(Milestone m) {
        return new MilestoneDto(m.getId(), m.getYear(), m.getText(), m.getSortOrder());
    }
}
