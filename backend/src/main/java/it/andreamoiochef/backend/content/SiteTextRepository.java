package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SiteTextRepository extends JpaRepository<SiteText, Long> {

    List<SiteText> findAllByOrderByCategoryAscSortOrderAsc();

    Optional<SiteText> findByKey(String key);
}
