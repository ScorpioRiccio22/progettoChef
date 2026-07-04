package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.EventTypeDto;
import it.andreamoiochef.backend.content.dto.EventTypeRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import it.andreamoiochef.backend.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventTypeService {

    private final EventTypeRepository repository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<EventTypeDto> listAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(EventTypeDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EventTypeDto> listPublished() {
        return repository.findAllByPublishedTrueOrderBySortOrderAsc().stream()
                .map(EventTypeDto::fromEntity)
                .toList();
    }

    @Transactional
    public EventTypeDto create(EventTypeRequest request) {
        EventType entity = new EventType();
        applyRequest(entity, request);
        entity.setSortOrder(nextSortOrder());
        return EventTypeDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public EventTypeDto update(Long id, EventTypeRequest request) {
        EventType entity = findOrThrow(id);
        String previousVideoUrl = entity.getVideoUrl();
        applyRequest(entity, request);
        EventTypeDto dto = EventTypeDto.fromEntity(repository.save(entity));

        // Il video è pesante: se è stato sostituito o rimosso, ripuliamo il
        // file precedente per non accumulare file orfani su disco.
        if (StringUtils.hasText(previousVideoUrl) && !previousVideoUrl.equals(entity.getVideoUrl())) {
            fileStorageService.deleteIfManaged(previousVideoUrl);
        }
        return dto;
    }

    @Transactional
    public void delete(Long id) {
        EventType entity = findOrThrow(id);
        String videoUrl = entity.getVideoUrl();
        repository.delete(entity);
        fileStorageService.deleteIfManaged(videoUrl);
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        List<EventType> all = repository.findAllById(request.orderedIds());
        Map<Long, EventType> byId = all.stream().collect(Collectors.toMap(EventType::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            EventType entity = byId.get(id);
            if (entity != null) {
                entity.setSortOrder(order++);
            }
        }
        repository.saveAll(all);
    }

    private void applyRequest(EventType entity, EventTypeRequest request) {
        entity.setTitle(request.title());
        entity.setDescription(request.description());
        entity.setIcon(request.icon());
        entity.setImageUrl(request.imageUrl());
        entity.setVideoUrl(request.videoUrl());
        entity.setDetails(request.details() == null ? new ArrayList<>() : new ArrayList<>(request.details()));
        entity.setPublished(request.published() == null || request.published());
    }

    private int nextSortOrder() {
        return repository.findAllByOrderBySortOrderAsc().size();
    }

    private EventType findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tipologia di evento non trovata (id " + id + ")"));
    }
}
