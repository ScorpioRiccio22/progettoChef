package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.SiteText;

public record SiteTextDto(
        String key,
        String value,
        String category,
        String label
) {
    public static SiteTextDto fromEntity(SiteText t) {
        return new SiteTextDto(t.getKey(), t.getValue(), t.getCategory(), t.getLabel());
    }
}
