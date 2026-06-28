package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.CoreValueDto;
import it.andreamoiochef.backend.content.dto.CoreValueRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoreValueService {

    private final CoreValueRepository repository;

    @Transactional(readOnly = true)
    public List<CoreValueDto> listAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(CoreValueDto::fromEntity)
                .toList();
    }

    @Transactional
    public CoreValueDto create(CoreValueRequest request) {
        CoreValue entity = new CoreValue();
        entity.setTitle(request.title());
        entity.setText(request.text());
        entity.setSortOrder(nextSortOrder());
        return CoreValueDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public CoreValueDto update(Long id, CoreValueRequest request) {
        CoreValue entity = findOrThrow(id);
        entity.setTitle(request.title());
        entity.setText(request.text());
        return CoreValueDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        List<CoreValue> all = repository.findAllById(request.orderedIds());
        Map<Long, CoreValue> byId = all.stream().collect(Collectors.toMap(CoreValue::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            CoreValue entity = byId.get(id);
            if (entity != null) {
                entity.setSortOrder(order++);
            }
        }
        repository.saveAll(all);
    }

    private int nextSortOrder() {
        return repository.findAllByOrderBySortOrderAsc().size();
    }

    private CoreValue findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Valore non trovato (id " + id + ")"));
    }
}
