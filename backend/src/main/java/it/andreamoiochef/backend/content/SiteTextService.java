package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.content.dto.SiteTextDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteTextService {

    private final SiteTextRepository repository;

    /** Tutti i testi, raggruppati per categoria e ordinati, per la UI di amministrazione. */
    @Transactional(readOnly = true)
    public List<SiteTextDto> listAll() {
        return repository.findAllByOrderByCategoryAscSortOrderAsc().stream()
                .map(SiteTextDto::fromEntity)
                .toList();
    }

    /** Tutti i testi come mappa chiave -> valore, per un singolo fetch efficiente dal sito pubblico. */
    @Transactional(readOnly = true)
    public Map<String, String> getAllAsMap() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SiteText::getKey, SiteText::getValue));
    }

    @Transactional
    public SiteTextDto updateValue(String key, String value) {
        SiteText entity = repository.findByKey(key)
                .orElseThrow(() -> new NotFoundException("Testo non trovato: " + key));
        entity.setValue(value);
        return SiteTextDto.fromEntity(repository.save(entity));
    }
}
