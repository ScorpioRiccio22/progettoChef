package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.MenuDto;
import it.andreamoiochef.backend.content.dto.MenuItemDto;
import it.andreamoiochef.backend.content.dto.MenuItemRequest;
import it.andreamoiochef.backend.content.dto.MenuRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menus")
@RequiredArgsConstructor
public class AdminMenuController {

    private final MenuService service;

    @GetMapping
    public ResponseEntity<List<MenuDto>> list(@RequestParam(defaultValue = "SHOP") String type) {
        return ResponseEntity.ok(service.listAll(type));
    }

    @PostMapping
    public ResponseEntity<MenuDto> create(@Valid @RequestBody MenuRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuDto> update(@PathVariable Long id, @Valid @RequestBody MenuRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<MenuDto> activate(@PathVariable Long id) {
        return ResponseEntity.ok(service.activate(id));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@Valid @RequestBody ReorderRequest request) {
        service.reorder(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{menuId}/items")
    public ResponseEntity<MenuItemDto> addItem(@PathVariable Long menuId, @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(service.addItem(menuId, request));
    }

    @PutMapping("/{menuId}/items/{itemId}")
    public ResponseEntity<MenuItemDto> updateItem(
            @PathVariable Long menuId,
            @PathVariable Long itemId,
            @Valid @RequestBody MenuItemRequest request
    ) {
        return ResponseEntity.ok(service.updateItem(menuId, itemId, request));
    }

    @DeleteMapping("/{menuId}/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long menuId, @PathVariable Long itemId) {
        service.deleteItem(menuId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{menuId}/items/reorder")
    public ResponseEntity<Void> reorderItems(@PathVariable Long menuId, @Valid @RequestBody ReorderRequest request) {
        service.reorderItems(menuId, request);
        return ResponseEntity.noContent().build();
    }
}
