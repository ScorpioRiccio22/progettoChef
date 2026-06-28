package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.DishDto;
import it.andreamoiochef.backend.content.dto.DishRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishService {

    private final DishRepository repository;

    @Transactional(readOnly = true)
    public List<DishDto> listAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(DishDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DishDto> listPublished() {
        return repository.findAllByPublishedTrueOrderBySortOrderAsc().stream()
                .map(DishDto::fromEntity)
                .toList();
    }

    @Transactional
    public DishDto create(DishRequest request) {
        Dish entity = new Dish();
        applyRequest(entity, request);
        entity.setSortOrder(nextSortOrder());
        return DishDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public DishDto update(Long id, DishRequest request) {
        Dish entity = findOrThrow(id);
        applyRequest(entity, request);
        return DishDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        Dish entity = findOrThrow(id);
        repository.delete(entity);
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        List<Dish> all = repository.findAllById(request.orderedIds());
        Map<Long, Dish> byId = all.stream().collect(Collectors.toMap(Dish::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            Dish entity = byId.get(id);
            if (entity != null) {
                entity.setSortOrder(order++);
            }
        }
        repository.saveAll(all);
    }

    private void applyRequest(Dish entity, DishRequest request) {
        entity.setName(request.name());
        entity.setCategory(request.category());
        entity.setDescription(request.description());
        entity.setImageUrl(request.imageUrl());
        entity.setTags(request.tags() == null ? new ArrayList<>() : new ArrayList<>(request.tags()));
        entity.setPublished(request.published() == null || request.published());
    }

    private int nextSortOrder() {
        return repository.findAllByOrderBySortOrderAsc().size();
    }

    private Dish findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Piatto non trovato (id " + id + ")"));
    }
}
