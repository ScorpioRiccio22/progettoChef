package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.MenuDto;
import it.andreamoiochef.backend.content.dto.MenuItemDto;
import it.andreamoiochef.backend.content.dto.MenuItemRequest;
import it.andreamoiochef.backend.content.dto.MenuRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;

    private static final String DEFAULT_TYPE = "SHOP";

    @Transactional(readOnly = true)
    public List<MenuDto> listAll(String type) {
        return menuRepository.findAllByTypeOrderBySortOrderAsc(normalizeType(type)).stream()
                .map(this::toDto)
                .toList();
    }

    /** Il menu attualmente "in vetrina" per il tipo indicato (negozio fisico o eventi), se ce n'è uno attivo. */
    @Transactional(readOnly = true)
    public MenuDto getActive(String type) {
        return menuRepository.findByTypeAndActiveTrue(normalizeType(type))
                .map(this::toDto)
                .orElse(null);
    }

    @Transactional
    public MenuDto create(MenuRequest request) {
        String type = normalizeType(request.type());
        Menu entity = new Menu();
        entity.setName(request.name());
        entity.setType(type);
        entity.setDescription(request.description());
        entity.setSortOrder(menuRepository.findAllByTypeOrderBySortOrderAsc(type).size());
        Menu saved = menuRepository.save(entity);
        if (Boolean.TRUE.equals(request.active())) {
            return activate(saved.getId());
        }
        return toDto(saved);
    }

    @Transactional
    public MenuDto update(Long id, MenuRequest request) {
        Menu entity = findOrThrow(id);
        entity.setName(request.name());
        entity.setDescription(request.description());
        Menu saved = menuRepository.save(entity);

        if (Boolean.TRUE.equals(request.active()) && !saved.isActive()) {
            return activate(saved.getId());
        }
        if (Boolean.FALSE.equals(request.active()) && saved.isActive()) {
            saved.setActive(false);
            saved = menuRepository.save(saved);
        }
        return toDto(saved);
    }

    /** Rende questo l'unico menu attivo per il suo tipo, disattivando gli altri dello stesso tipo. */
    @Transactional
    public MenuDto activate(Long id) {
        Menu target = findOrThrow(id);
        menuRepository.findByTypeAndActiveTrue(target.getType())
                .filter(current -> !current.getId().equals(id))
                .ifPresent(current -> {
                    current.setActive(false);
                    menuRepository.save(current);
                });
        target.setActive(true);
        return toDto(menuRepository.save(target));
    }

    private String normalizeType(String type) {
        if (type == null || type.isBlank()) {
            return DEFAULT_TYPE;
        }
        String normalized = type.trim().toUpperCase();
        if (!normalized.equals("SHOP") && !normalized.equals("EVENTS")) {
            throw new IllegalArgumentException("Tipo di menu non valido: " + type);
        }
        return normalized;
    }

    @Transactional
    public void deactivate(Long id) {
        Menu entity = findOrThrow(id);
        entity.setActive(false);
        menuRepository.save(entity);
    }

    @Transactional
    public void delete(Long id) {
        Menu entity = findOrThrow(id);
        menuRepository.delete(entity);
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        List<Menu> all = menuRepository.findAllById(request.orderedIds());
        Map<Long, Menu> byId = all.stream().collect(Collectors.toMap(Menu::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            Menu entity = byId.get(id);
            if (entity != null) {
                entity.setSortOrder(order++);
            }
        }
        menuRepository.saveAll(all);
    }

    // --- Voci del menu (piatti + prezzo) --------------------------------------

    @Transactional
    public MenuItemDto addItem(Long menuId, MenuItemRequest request) {
        Menu menu = findOrThrow(menuId);
        MenuItem item = new MenuItem();
        item.setMenu(menu);
        applyItemRequest(item, request);
        item.setSortOrder(menuItemRepository.findAllByMenu_IdOrderBySortOrderAsc(menuId).size());
        return MenuItemDto.fromEntity(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemDto updateItem(Long menuId, Long itemId, MenuItemRequest request) {
        MenuItem item = findItemOrThrow(menuId, itemId);
        applyItemRequest(item, request);
        return MenuItemDto.fromEntity(menuItemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long menuId, Long itemId) {
        MenuItem item = findItemOrThrow(menuId, itemId);
        menuItemRepository.delete(item);
    }

    @Transactional
    public void reorderItems(Long menuId, ReorderRequest request) {
        List<MenuItem> all = menuItemRepository.findAllById(request.orderedIds()).stream()
                .filter(i -> i.getMenu().getId().equals(menuId))
                .toList();
        Map<Long, MenuItem> byId = all.stream().collect(Collectors.toMap(MenuItem::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            MenuItem item = byId.get(id);
            if (item != null) {
                item.setSortOrder(order++);
            }
        }
        menuItemRepository.saveAll(all);
    }

    private void applyItemRequest(MenuItem item, MenuItemRequest request) {
        item.setName(request.name());
        item.setCategory(request.category());
        item.setDescription(request.description());
        item.setImageUrl(request.imageUrl());
        item.setPrice(request.price());
    }

    private MenuDto toDto(Menu menu) {
        List<MenuItemDto> items = menuItemRepository.findAllByMenu_IdOrderBySortOrderAsc(menu.getId()).stream()
                .map(MenuItemDto::fromEntity)
                .toList();
        return MenuDto.fromEntity(menu, items);
    }

    private Menu findOrThrow(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Menu non trovato (id " + id + ")"));
    }

    private MenuItem findItemOrThrow(Long menuId, Long itemId) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Voce di menu non trovata (id " + itemId + ")"));
        if (!item.getMenu().getId().equals(menuId)) {
            throw new NotFoundException("Voce di menu non trovata (id " + itemId + ")");
        }
        return item;
    }
}
