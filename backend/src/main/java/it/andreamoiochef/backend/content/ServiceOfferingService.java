package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.common.SlugUtil;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import it.andreamoiochef.backend.content.dto.ServiceOfferingDto;
import it.andreamoiochef.backend.content.dto.ServiceOfferingRequest;
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
public class ServiceOfferingService {

    private final ServiceOfferingRepository repository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<ServiceOfferingDto> listAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(ServiceOfferingDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServiceOfferingDto> listPublished() {
        return repository.findAllByPublishedTrueOrderBySortOrderAsc().stream()
                .map(ServiceOfferingDto::fromEntity)
                .toList();
    }

    /** Il servizio pubblicato corrispondente allo slug, per la pagina di dettaglio pubblica. */
    @Transactional(readOnly = true)
    public ServiceOfferingDto getPublishedBySlug(String slug) {
        return repository.findBySlugAndPublishedTrue(slug)
                .map(ServiceOfferingDto::fromEntity)
                .orElseThrow(() -> new NotFoundException("Servizio non trovato: " + slug));
    }

    @Transactional
    public ServiceOfferingDto create(ServiceOfferingRequest request) {
        ServiceOffering entity = new ServiceOffering();
        applyRequest(entity, request, null);
        entity.setSortOrder(nextSortOrder());
        return ServiceOfferingDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public ServiceOfferingDto update(Long id, ServiceOfferingRequest request) {
        ServiceOffering entity = findOrThrow(id);
        String previousVideoUrl = entity.getVideoUrl();
        applyRequest(entity, request, id);
        ServiceOfferingDto dto = ServiceOfferingDto.fromEntity(repository.save(entity));

        // Il video è pesante: se è stato sostituito o rimosso, ripuliamo il
        // file precedente per non accumulare file orfani su disco.
        if (StringUtils.hasText(previousVideoUrl) && !previousVideoUrl.equals(entity.getVideoUrl())) {
            fileStorageService.deleteIfManaged(previousVideoUrl);
        }
        return dto;
    }

    @Transactional
    public void delete(Long id) {
        ServiceOffering entity = findOrThrow(id);
        String videoUrl = entity.getVideoUrl();
        repository.delete(entity);
        fileStorageService.deleteIfManaged(videoUrl);
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        List<ServiceOffering> all = repository.findAllById(request.orderedIds());
        Map<Long, ServiceOffering> byId = all.stream()
                .collect(Collectors.toMap(ServiceOffering::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            ServiceOffering entity = byId.get(id);
            if (entity != null) {
                entity.setSortOrder(order++);
            }
        }
        repository.saveAll(all);
    }

    private void applyRequest(ServiceOffering entity, ServiceOfferingRequest request, Long currentId) {
        entity.setTitle(request.title());
        entity.setTagline(request.tagline());
        entity.setDescription(request.description());
        entity.setBodyContent(request.bodyContent());
        entity.setIcon(request.icon());
        entity.setImageUrl(request.imageUrl());
        entity.setVideoUrl(request.videoUrl());
        entity.setGalleryImageUrls(
                request.galleryImageUrls() == null ? new ArrayList<>() : new ArrayList<>(request.galleryImageUrls())
        );
        entity.setPublished(request.published() == null || request.published());
        entity.setSlug(resolveSlug(request.slug(), request.title(), currentId));
    }

    /** Genera (o riusa) uno slug univoco, dando priorità a quello indicato manualmente e ricadendo sul titolo. */
    private String resolveSlug(String requestedSlug, String title, Long currentId) {
        String base = SlugUtil.slugify(StringUtils.hasText(requestedSlug) ? requestedSlug : title);
        if (!StringUtils.hasText(base)) {
            base = "servizio";
        }
        String candidate = base;
        int suffix = 2;
        while (isSlugTaken(candidate, currentId)) {
            candidate = base + "-" + suffix++;
        }
        return candidate;
    }

    private boolean isSlugTaken(String slug, Long currentId) {
        return repository.findBySlug(slug)
                .map(existing -> !existing.getId().equals(currentId))
                .orElse(false);
    }

    private int nextSortOrder() {
        return repository.findAllByOrderBySortOrderAsc().size();
    }

    private ServiceOffering findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Servizio non trovato (id " + id + ")"));
    }
}
