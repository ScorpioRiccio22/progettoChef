package it.andreamoiochef.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {

    List<Dish> findAllByOrderBySortOrderAsc();

    List<Dish> findAllByPublishedTrueOrderBySortOrderAsc();
}
