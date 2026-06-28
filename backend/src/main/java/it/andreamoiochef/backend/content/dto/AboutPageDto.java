package it.andreamoiochef.backend.content.dto;

import java.util.List;

/** Aggrega i dati statici della pagina "Chi siamo" in un'unica risposta pubblica. */
public record AboutPageDto(
        List<MilestoneDto> milestones,
        List<CoreValueDto> values
) {
}
