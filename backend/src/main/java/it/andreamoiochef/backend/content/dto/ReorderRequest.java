package it.andreamoiochef.backend.content.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** Riordino drag-and-drop: lista di id nell'ordine finale desiderato. */
public record ReorderRequest(
        @NotEmpty(message = "La lista di id non può essere vuota") List<Long> orderedIds
) {
}
