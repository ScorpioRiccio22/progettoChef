package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoreValueRepository extends JpaRepository<CoreValue, Long> {

    List<CoreValue> findAllByOrderBySortOrderAsc();
}
