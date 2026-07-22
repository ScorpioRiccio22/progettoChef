package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.MenuDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/menus")
@RequiredArgsConstructor
public class PublicMenuController {

    private final MenuService service;

    /** Il menu attualmente "in vetrina" per il tipo indicato (SHOP = negozio fisico, EVENTS = eventi). */
    @GetMapping("/active")
    public ResponseEntity<MenuDto> active(@RequestParam(defaultValue = "SHOP") String type) {
        MenuDto dto = service.getActive(type);
        return dto == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(dto);
    }
}
