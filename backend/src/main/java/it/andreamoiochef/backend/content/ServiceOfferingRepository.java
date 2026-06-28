package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    List<ServiceOffering> findAllByOrderBySortOrderAsc();

    List<ServiceOffering> findAllByPublishedTrueOrderBySortOrderAsc();
}
