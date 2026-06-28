package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.DishDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/dishes")
@RequiredArgsConstructor
public class PublicDishController {

    private final DishService service;

    @GetMapping
    public ResponseEntity<List<DishDto>> list() {
        return ResponseEntity.ok(service.listPublished());
    }
}
