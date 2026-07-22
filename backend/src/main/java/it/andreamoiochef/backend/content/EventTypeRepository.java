package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventTypeRepository extends JpaRepository<EventType, Long> {

    List<EventType> findAllByOrderBySortOrderAsc();

    List<EventType> findAllByPublishedTrueOrderBySortOrderAsc();

    Optional<EventType> findBySlug(String slug);

    Optional<EventType> findBySlugAndPublishedTrue(String slug);
}
