package it.andreamoiochef.backend.content;

import it.andreamoiochef.backend.content.dto.SiteSettingsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SiteSettingsService {

    private final SiteSettingsRepository repository;

    /**
     * Restituisce l'unica riga di impostazioni, creandola con valori di
     * default se non esiste ancora (prima richiesta dopo il deploy).
     */
    @Transactional
    public SiteSettings getOrCreate() {
        return repository.findById(1L).orElseGet(this::createDefault);
    }

    @Transactional(readOnly = true)
    public SiteSettingsDto getSettings() {
        return SiteSettingsDto.fromEntity(getOrCreate());
    }

    @Transactional
    public SiteSettingsDto updateSettings(SiteSettingsDto request) {
        SiteSettings settings = getOrCreate();
        request.applyTo(settings);
        return SiteSettingsDto.fromEntity(repository.save(settings));
    }

    private SiteSettings createDefault() {
        SiteSettings settings = new SiteSettings();
        settings.setBrandName("Andrea Moio");
        settings.setBrandHandle("@chefandreamoio");
        settings.setBrandRole("Chef");
        settings.setBrandCity("Napoli");
        settings.setBrandPayoff("Tradizione napoletana, su misura per i tuoi eventi");
        settings.setContactEmail("info@andreamoiochef.it");
        settings.setWhatsappNumber("+39 000 000 0000");
        settings.setWhatsappLink("https://wa.me/390000000000");
        settings.setContactArea("Napoli e provincia");
        // Placeholder: da sostituire con l'indirizzo reale dal pannello admin
        // (Contatti -> Indirizzo fisico). Finché resta vuoto o non valido,
        // la mini mappa nella pagina Contatti non viene mostrata.
        settings.setMapAddress(null);
        settings.setInstagramUrl("https://instagram.com/chefandreamoio");
        settings.setFacebookUrl("https://facebook.com/Chefmoioandrea");
        settings.setTiktokUrl("https://tiktok.com/@chefandreamoio");
        settings.setThreadsUrl("https://threads.net/@chefandreamoio");
        settings.setHeroTitle("La cucina napoletana, portata a casa tua.");
        settings.setHeroSubtitle("Chef a domicilio per cene private, eventi e nuove attività che vogliono partire con il piede giusto in cucina.");
        settings.setAboutIntro("Cresciuto tra i fornelli di casa e le cucine professionali di Napoli, porto la tradizione partenopea dove serve davvero: sulla tua tavola.");
        settings.setStatYearsValue("8+");
        settings.setStatYearsLabel("anni di esperienza");
        settings.setStatEventsValue("150+");
        settings.setStatEventsLabel("eventi curati");
        settings.setStatIngredientsValue("100%");
        settings.setStatIngredientsLabel("materie prime locali");
        return repository.save(settings);
    }
}
