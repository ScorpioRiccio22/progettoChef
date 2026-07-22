package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findAllByMenu_IdOrderBySortOrderAsc(Long menuId);
}
