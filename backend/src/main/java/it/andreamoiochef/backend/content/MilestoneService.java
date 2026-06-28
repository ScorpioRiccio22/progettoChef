package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.MilestoneDto;
import it.andreamoiochef.backend.content.dto.MilestoneRequest;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository repository;

    @Transactional(readOnly = true)
    public List<MilestoneDto> listAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(MilestoneDto::fromEntity)
                .toList();
    }

    @Transactional
    public MilestoneDto create(MilestoneRequest request) {
        Milestone entity = new Milestone();
        entity.setYear(request.year());
        entity.setText(request.text());
        entity.setSortOrder(nextSortOrder());
        return MilestoneDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public MilestoneDto update(Long id, MilestoneRequest request) {
        Milestone entity = findOrThrow(id);
        entity.setYear(request.year());
        entity.setText(request.text());
        return MilestoneDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        List<Milestone> all = repository.findAllById(request.orderedIds());
        Map<Long, Milestone> byId = all.stream().collect(Collectors.toMap(Milestone::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            Milestone entity = byId.get(id);
            if (entity != null) {
                entity.setSortOrder(order++);
            }
        }
        repository.saveAll(all);
    }

    private int nextSortOrder() {
        return repository.findAllByOrderBySortOrderAsc().size();
    }

    private Milestone findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tappa non trovata (id " + id + ")"));
    }
}
