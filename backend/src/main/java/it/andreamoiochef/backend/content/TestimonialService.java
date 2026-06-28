package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.ReorderRequest;
import it.andreamoiochef.backend.content.dto.TestimonialDto;
import it.andreamoiochef.backend.content.dto.TestimonialRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository repository;

    @Transactional(readOnly = true)
    public List<TestimonialDto> listAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(TestimonialDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TestimonialDto> listPublished() {
        return repository.findAllByPublishedTrueOrderBySortOrderAsc().stream()
                .map(TestimonialDto::fromEntity)
                .toList();
    }

    @Transactional
    public TestimonialDto create(TestimonialRequest request) {
        Testimonial entity = new Testimonial();
        applyRequest(entity, request);
        entity.setSortOrder(nextSortOrder());
        return TestimonialDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public TestimonialDto update(Long id, TestimonialRequest request) {
        Testimonial entity = findOrThrow(id);
        applyRequest(entity, request);
        return TestimonialDto.fromEntity(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        Testimonial entity = findOrThrow(id);
        repository.delete(entity);
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        List<Testimonial> all = repository.findAllById(request.orderedIds());
        Map<Long, Testimonial> byId = all.stream().collect(Collectors.toMap(Testimonial::getId, e -> e));

        int order = 0;
        for (Long id : request.orderedIds()) {
            Testimonial entity = byId.get(id);
            if (entity != null) {
                entity.setSortOrder(order++);
            }
        }
        repository.saveAll(all);
    }

    private void applyRequest(Testimonial entity, TestimonialRequest request) {
        entity.setAuthor(request.author());
        entity.setRole(request.role());
        entity.setQuote(request.quote());
        entity.setPublished(request.published() == null || request.published());
    }

    private int nextSortOrder() {
        return repository.findAllByOrderBySortOrderAsc().size();
    }

    private Testimonial findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Recensione non trovata (id " + id + ")"));
    }
}
