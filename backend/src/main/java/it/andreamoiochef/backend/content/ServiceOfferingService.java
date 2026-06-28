package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import it.andreamoiochef.backend.content.dto.ServiceOfferingDto;
import it.andreamoiochef.backend.content.dto.ServiceOfferingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOfferingService {

    private final ServiceOfferingRepository repository;

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

    @Transactional
    public ServiceOfferingDto create(ServiceOfferingRequest request) {
        ServiceOffering entity = new ServiceOffering();
        applyRequest(entity, request);
        entity.setSortOrder(nextSortOrder());
        return ServiceOfferingDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public ServiceOfferingDto update(Long id, ServiceOfferingRequest request) {
        ServiceOffering entity = findOrThrow(id);
        applyRequest(entity, request);
        return ServiceOfferingDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        ServiceOffering entity = findOrThrow(id);
        repository.delete(entity);
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

    private void applyRequest(ServiceOffering entity, ServiceOfferingRequest request) {
        entity.setTitle(request.title());
        entity.setTagline(request.tagline());
        entity.setDescription(request.description());
        entity.setIcon(request.icon());
        entity.setImageUrl(request.imageUrl());
        entity.setPublished(request.published() == null || request.published());
    }

    private int nextSortOrder() {
        return repository.findAllByOrderBySortOrderAsc().size();
    }

    private ServiceOffering findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Servizio non trovato (id " + id + ")"));
    }
}
