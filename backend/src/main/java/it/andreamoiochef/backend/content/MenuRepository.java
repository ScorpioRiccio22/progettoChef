package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findAllByOrderBySortOrderAsc();

    Optional<Menu> findByActiveTrue();

    List<Menu> findAllByTypeOrderBySortOrderAsc(String type);

    Optional<Menu> findByTypeAndActiveTrue(String type);
}
