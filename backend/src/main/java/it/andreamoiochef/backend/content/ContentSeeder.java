package it.andreamoiochef.backend.content;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Al primo avvio, se le tabelle di contenuto sono vuote, le popola con i
 * dati che prima erano hardcoded in frontend/src/lib/content.ts: in questo
 * modo il sito pubblico non parte "vuoto" e l'admin ha già qualcosa da
 * modificare invece di dover inserire tutto da zero.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ContentSeeder {

    private final ServiceOfferingRepository serviceOfferingRepository;
    private final DishRepository dishRepository;
    private final EventTypeRepository eventTypeRepository;
    private final TestimonialRepository testimonialRepository;
    private final MilestoneRepository milestoneRepository;
    private final CoreValueRepository coreValueRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        seedServices();
        seedDishes();
        seedEventTypes();
        seedTestimonials();
        seedMilestones();
        seedCoreValues();
    }

    private void seedServices() {
        if (serviceOfferingRepository.count() > 0) return;

        save(service("Chef a domicilio", "Il ristorante arriva a casa tua",
                "Vengo io con la spesa, gli strumenti e il menu pensato su misura: tu prepari solo la tavola. "
                        + "Ideale per cene intime, ricorrenze o una serata speciale senza pensieri.", "home", 0));
        save(service("Eventi privati", "Compleanni, lauree, ricorrenze",
                "Menu dedicato, percorso di degustazione e servizio in sala per il tuo evento privato, a casa o "
                        + "in una location a tua scelta, da 2 a oltre 50 invitati.", "event", 1));
        save(service("Consulenza per start-up", "Per chi nasce nel mondo della ristorazione",
                "Supporto su menu engineering, food cost e identità di cucina per nuove attività: dal locale "
                        + "che apre ai progetti di delivery e dark kitchen.", "business", 2));

        log.info("Seed iniziale: servizi creati");
    }

    private ServiceOffering service(String title, String tagline, String description, String icon, int order) {
        ServiceOffering s = new ServiceOffering();
        s.setTitle(title);
        s.setTagline(tagline);
        s.setDescription(description);
        s.setIcon(icon);
        s.setSortOrder(order);
        s.setPublished(true);
        return s;
    }

    private void save(ServiceOffering s) {
        serviceOfferingRepository.save(s);
    }

    private void seedDishes() {
        if (dishRepository.count() > 0) return;

        save(dish("Genovese di pacchero", "primi",
                "La tradizione partenopea, cipolle stufate per ore e carne che si sfalda, su pacchero trafilato al bronzo.",
                List.of("tradizione", "comfort food"), 0));
        save(dish("Parmigiana di melanzane", "antipasti",
                "Strati sottili, fritti al momento, fiordilatte e basilico: il classico napoletano nella sua versione più curata.",
                List.of("vegetariano", "classico"), 1));
        save(dish("Baccalà alla napoletana", "secondi",
                "Pomodorini del piennolo, olive e capperi, per un piatto di mare con radici profonde nella cucina di casa.",
                List.of("pesce", "tradizione"), 2));
        save(dish("Risotto \"Vesuvio\"", "primi",
                "Crema di provola affumicata e un cuore di pomodoro piccante: l'omaggio in piatto al profilo del Vesuvio.",
                List.of("signature", "creativo"), 3));
        save(dish("Caprese rivisitata", "antipasti",
                "Mozzarella di bufala, pomodoro confit e basilico in gelée: un classico riletto in chiave contemporanea.",
                List.of("vegetariano", "fresco"), 4));
        save(dish("Babà al limoncello", "dolci",
                "Lievitazione lenta e bagna preparata in casa, per il dolce simbolo di Napoli servito nella sua versione più golosa.",
                List.of("signature", "tradizione"), 5));

        log.info("Seed iniziale: piatti del ricettario creati");
    }

    private Dish dish(String name, String category, String description, List<String> tags, int order) {
        Dish d = new Dish();
        d.setName(name);
        d.setCategory(category);
        d.setDescription(description);
        d.setTags(new java.util.ArrayList<>(tags));
        d.setSortOrder(order);
        d.setPublished(true);
        return d;
    }

    private void save(Dish d) {
        dishRepository.save(d);
    }

    private void seedEventTypes() {
        if (eventTypeRepository.count() > 0) return;

        save(eventType("Eventi privati", "Cene e pranzi su misura nella tua casa o in una location scelta da te.",
                "private", List.of("Compleanni e anniversari", "Cene romantiche", "Pranzi di famiglia e ricorrenze",
                        "Aperitivi e degustazioni"), 0));
        save(eventType("Eventi aziendali", "Coffee break, pranzi di lavoro e cene per il team o per i tuoi clienti.",
                "corporate", List.of("Team building enogastronomici", "Pranzi e cene aziendali", "Lanci di prodotto",
                        "Buffet per uffici e show-room"), 1));
        save(eventType("Catering su misura", "Servizio completo per matrimoni, cerimonie e grandi numeri.",
                "catering", List.of("Cerimonie e ricevimenti", "Buffet e postazioni a tema", "Servizio di sala incluso",
                        "Menu degustazione personalizzato"), 2));
        save(eventType("Cooking class", "Imparo a cucinare insieme a te i grandi classici napoletani, passo dopo passo.",
                "cooking-class", List.of("Lezioni singole o di gruppo", "Adatte a principianti", "Ricette della tradizione",
                        "Anche come idea regalo"), 3));

        log.info("Seed iniziale: tipologie di eventi creati");
    }

    private EventType eventType(String title, String description, String icon, List<String> details, int order) {
        EventType e = new EventType();
        e.setTitle(title);
        e.setDescription(description);
        e.setIcon(icon);
        e.setDetails(new java.util.ArrayList<>(details));
        e.setSortOrder(order);
        e.setPublished(true);
        return e;
    }

    private void save(EventType e) {
        eventTypeRepository.save(e);
    }

    private void seedTestimonials() {
        if (testimonialRepository.count() > 0) return;

        save(testimonial("Maria F.", "Cena di compleanno",
                "Andrea ha trasformato il nostro salotto in un piccolo ristorante. Genovese da chiudere gli occhi, "
                        + "e zero stress per noi.", 0));
        save(testimonial("Antonio R.", "Evento aziendale",
                "Per il pranzo con i nostri clienti abbiamo scelto un menu su misura: puntualità, presentazione e "
                        + "sapori sopra le aspettative.", 1));
        save(testimonial("Giulia e Marco", "Cerimonia",
                "Dal primo assaggio fino al servizio in sala il giorno del matrimonio, un percorso curato in ogni dettaglio.", 2));

        log.info("Seed iniziale: testimonianze create");
    }

    private Testimonial testimonial(String author, String role, String quote, int order) {
        Testimonial t = new Testimonial();
        t.setAuthor(author);
        t.setRole(role);
        t.setQuote(quote);
        t.setSortOrder(order);
        t.setPublished(true);
        return t;
    }

    private void save(Testimonial t) {
        testimonialRepository.save(t);
    }

    private void seedMilestones() {
        if (milestoneRepository.count() > 0) return;

        save(milestone("2016", "Primi passi in cucina nei ristoranti storici del centro di Napoli.", 0));
        save(milestone("2019", "Specializzazione in cucina tradizionale e nei grandi classici partenopei.", 1));
        save(milestone("2022", "Avvio dell'attività di chef a domicilio ed eventi privati.", 2));
        save(milestone("Oggi", "Consulenza per nuove attività di ristorazione, oltre a cene ed eventi su misura.", 3));

        log.info("Seed iniziale: tappe del percorso creato");
    }

    private Milestone milestone(String year, String text, int order) {
        Milestone m = new Milestone();
        m.setYear(year);
        m.setText(text);
        m.setSortOrder(order);
        return m;
    }

    private void save(Milestone m) {
        milestoneRepository.save(m);
    }

    private void seedCoreValues() {
        if (coreValueRepository.count() > 0) return;

        save(coreValue("Materie prime locali", "Pescato e prodotti dell'orto scelti ogni settimana dai produttori della zona.", 0));
        save(coreValue("Tradizione, non nostalgia", "Le ricette di famiglia restano il punto di partenza, non il limite.", 1));
        save(coreValue("Cura del servizio", "Dalla mise en place al saluto finale, il dettaglio fa la differenza.", 2));

        log.info("Seed iniziale: principi della cucina creati");
    }

    private CoreValue coreValue(String title, String text, int order) {
        CoreValue v = new CoreValue();
        v.setTitle(title);
        v.setText(text);
        v.setSortOrder(order);
        return v;
    }

    private void save(CoreValue v) {
        coreValueRepository.save(v);
    }
}
