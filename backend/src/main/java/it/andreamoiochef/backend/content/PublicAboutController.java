package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.AboutPageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/about")
@RequiredArgsConstructor
public class PublicAboutController {

    private final MilestoneService milestoneService;
    private final CoreValueService coreValueService;

    @GetMapping
    public ResponseEntity<AboutPageDto> get() {
        return ResponseEntity.ok(new AboutPageDto(milestoneService.listAll(), coreValueService.listAll()));
    }
}
