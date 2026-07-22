package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    List<ServiceOffering> findAllByOrderBySortOrderAsc();

    List<ServiceOffering> findAllByPublishedTrueOrderBySortOrderAsc();

    Optional<ServiceOffering> findBySlug(String slug);

    Optional<ServiceOffering> findBySlugAndPublishedTrue(String slug);
}
