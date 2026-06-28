package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventTypeRepository extends JpaRepository<EventType, Long> {

    List<EventType> findAllByOrderBySortOrderAsc();

    List<EventType> findAllByPublishedTrueOrderBySortOrderAsc();
}
