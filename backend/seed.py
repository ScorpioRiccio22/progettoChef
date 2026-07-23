"""
Seed eseguito all'avvio dell'app (equivalente degli @EventListener su
ApplicationReadyEvent in AdminUserSeeder.java e ContentSeeder.java):
- crea l'admin SUPERADMIN di default se la tabella admin_users è vuota
- popola i contenuti demo se le rispettive tabelle sono vuote
"""
import logging

from sqlalchemy.orm import Session

from config import settings
from security import hash_password
from utils import slugify
from models import AdminUser, AdminRole
from models import ServiceOffering, Dish, EventType, Testimonial, Milestone, CoreValue, SiteText

logger = logging.getLogger(__name__)

# Valori di partenza per i testi configurabili del sito (equivalente della
# migration Flyway V9__seed_site_texts.sql): replicano i testi già presenti
# sul sito, così nulla cambia visivamente finché non vengono modificati da admin.
# Tuple: (key, value, category, label, sort_order)
_SITE_TEXTS_SEED: list[tuple[str, str, str, str, int]] = [
    ("home.hero.ctaPrimary", "Prenota una consulenza", "home", "Hero: testo pulsante principale", 1),
    ("home.hero.ctaSecondary", "Scopri i servizi", "home", "Hero: testo pulsante secondario", 2),
    ("home.hero.scrollLabel", "Scorri", "home", 'Hero: etichetta "scorri" in basso', 3),
    ("home.services.eyebrow", "Cosa offro", "home", "Sezione Servizi (home): eyebrow", 10),
    ("home.services.title", "Tre modi per portare la mia cucina da te", "home", "Sezione Servizi (home): titolo", 11),
    ("home.services.description",
     "Dalla cena tra amici al lancio della tua attività: ogni servizio è pensato su misura, "
     "partendo da quello che ti serve davvero.", "home", "Sezione Servizi (home): descrizione", 12),
    ("home.recipes.eyebrow", "A Modo Mio", "home", "Sezione A Modo Mio (home): eyebrow", 20),
    ("home.recipes.title", "Un assaggio di quello che cucino", "home", "Sezione A Modo Mio (home): titolo", 21),
    ("home.recipes.description",
     'Ricette di famiglia e qualche idea più creativa: ogni menu nasce da "A Modo Mio", '
     "adattato ai tuoi gusti e all'occasione.", "home", "Sezione A Modo Mio (home): descrizione", 22),
    ("home.recipes.ctaButton", 'Vedi tutto "A Modo Mio"', "home", "Sezione A Modo Mio (home): testo pulsante", 23),
    ("home.events.eyebrow", "Eventi", "home", "Sezione Eventi (home): eyebrow", 30),
    ("home.events.title", "Un servizio per ogni occasione", "home", "Sezione Eventi (home): titolo", 31),
    ("home.events.description",
     "Dalla cena intima al matrimonio con cento invitati: definiamo insieme menu, formula di "
     "servizio e tempistiche.", "home", "Sezione Eventi (home): descrizione", 32),
    ("home.events.ctaButton", "Scopri tutti gli eventi", "home", "Sezione Eventi (home): testo pulsante", 33),
    ("home.contact.eyebrow", "Contatti", "home", "Sezione Contatti (home): eyebrow", 40),
    ("home.contact.title", "Parliamo del tuo evento", "home", "Sezione Contatti (home): titolo", 41),
    ("home.contact.description",
     "Scrivimi su WhatsApp per una risposta rapida, oppure manda una email con i dettagli: data, "
     "numero di invitati e cosa hai in mente.", "home", "Sezione Contatti (home): descrizione", 42),
    ("home.contact.whatsappButton", "Scrivimi su WhatsApp", "home", "Sezione Contatti (home): pulsante WhatsApp", 43),
    ("home.contact.emailButton", "Invia una email", "home", "Sezione Contatti (home): pulsante Email", 44),
    ("home.contact.pageLinkButton", "Vai alla pagina contatti completa", "home",
     "Sezione Contatti (home): link pagina completa", 45),
    ("home.reviews.eyebrowGoogle", "Recensioni Google", "home",
     "Sezione Recensioni (home): eyebrow con recensioni Google", 50),
    ("home.reviews.titleGoogle", "Cosa dicono i miei ospiti su Google", "home",
     "Sezione Recensioni (home): titolo con recensioni Google", 51),
    ("home.reviews.leaveReviewButton", "Lascia una recensione", "home",
     'Sezione Recensioni (home): pulsante "lascia una recensione"', 52),
    ("home.reviews.eyebrowFallback", "Le voci di chi ha assaggiato", "home",
     "Sezione Recensioni (home): eyebrow senza Google", 53),
    ("home.reviews.titleFallback", "Cosa raccontano i miei ospiti", "home",
     "Sezione Recensioni (home): titolo senza Google", 54),
    ("home.newsletter.title", "Ricette, eventi e novità via email", "home", "Sezione Newsletter (home): titolo", 60),
    ("home.newsletter.description",
     "Una mail ogni tanto, niente spam: nuove ricette di \"A Modo Mio\", disponibilità per gli "
     "eventi e qualche consiglio di cucina napoletana.", "home", "Sezione Newsletter (home): descrizione", 61),
    ("home.newsletter.placeholder", "La tua email", "home",
     "Sezione Newsletter (home): placeholder campo email", 62),
    ("home.newsletter.submitButton", "Iscrivimi", "home", "Sezione Newsletter (home): testo pulsante", 63),
    ("home.newsletter.successMessage", "Iscrizione completata! Controlla la tua casella email a breve.", "home",
     "Sezione Newsletter (home): messaggio di successo", 64),
    ("home.newsletter.disclaimer",
     "Iscrivendoti accetti di ricevere comunicazioni periodiche. Puoi annullare l'iscrizione in "
     "qualsiasi momento.", "home", "Sezione Newsletter (home): nota legale", 65),
    ("common.discoverMore", "Scopri di più", "common", 'Etichetta link "Scopri di più" (card servizi/eventi)', 1),
    ("common.notFound.title", "Pagina non trovata", "common", "Pagina 404: titolo", 10),
    ("common.notFound.description",
     "Questa pagina non esiste, o è stata spostata. Torna alla home per continuare a curiosare.",
     "common", "Pagina 404: descrizione", 11),
    ("common.notFound.button", "Torna alla home", "common", "Pagina 404: testo pulsante", 12),
    ("services.page.eyebrow", "Servizi", "services", "Pagina Servizi: eyebrow", 1),
    ("services.page.title", "Tre modi per portare la mia cucina da te", "services", "Pagina Servizi: titolo", 2),
    ("services.page.description",
     "Dalla cena tra amici al lancio della tua attività: ogni servizio è pensato su misura, "
     "partendo da quello che ti serve davvero.", "services", "Pagina Servizi: descrizione", 3),
    ("services.cta.title", "Non sai quale servizio fa per te?", "services",
     "Pagina Servizi: titolo box finale", 10),
    ("services.cta.description",
     "Scrivimi su WhatsApp raccontandomi cosa hai in mente: ti aiuto a capire la formula più adatta.",
     "services", "Pagina Servizi: descrizione box finale", 11),
    ("services.cta.button", "Scrivimi su WhatsApp", "services", "Pagina Servizi: pulsante box finale", 12),
    ("services.detail.backLabel", "Tutti i servizi", "services", "Dettaglio servizio: link indietro", 20),
    ("services.detail.cta.title", "Ti interessa questo servizio?", "services",
     "Dettaglio servizio: titolo box finale", 21),
    ("services.detail.cta.description",
     "Scrivimi su WhatsApp raccontandomi cosa hai in mente: ti rispondo con disponibilità e prima proposta.",
     "services", "Dettaglio servizio: descrizione box finale", 22),
    ("services.detail.cta.button", "Scrivimi su WhatsApp", "services", "Dettaglio servizio: pulsante box finale", 23),
    ("events.page.eyebrow", "Eventi", "events", "Pagina Eventi: eyebrow", 1),
    ("events.page.title", "Un servizio per ogni occasione", "events", "Pagina Eventi: titolo", 2),
    ("events.page.description",
     "Dalla cena per due persone al matrimonio con cento invitati: ogni evento ha una formula di "
     "servizio dedicata.", "events", "Pagina Eventi: descrizione", 3),
    ("events.menuBanner.label", "Menu in evidenza per gli eventi", "events",
     "Pagina Eventi: etichetta banner menu attivo", 4),
    ("events.process.eyebrow", "Come funziona", "events", 'Pagina Eventi: eyebrow sezione "come funziona"', 10),
    ("events.process.title", "Dal primo messaggio al giorno dell'evento", "events",
     'Pagina Eventi: titolo sezione "come funziona"', 11),
    ("events.process.step1.title", "Raccontami l'evento", "events", "Pagina Eventi: step 1 titolo", 12),
    ("events.process.step1.text", "Data, numero di invitati, location e budget di riferimento.", "events",
     "Pagina Eventi: step 1 testo", 13),
    ("events.process.step2.title", "Costruiamo il menu", "events", "Pagina Eventi: step 2 titolo", 14),
    ("events.process.step2.text", "Proposta su misura, con eventuale degustazione preliminare.", "events",
     "Pagina Eventi: step 2 testo", 15),
    ("events.process.step3.title", "Organizziamo il servizio", "events", "Pagina Eventi: step 3 titolo", 16),
    ("events.process.step3.text",
     "Definiamo tempistiche, allestimento e personale di sala se necessario.", "events",
     "Pagina Eventi: step 3 testo", 17),
    ("events.process.step4.title", "Il giorno dell'evento", "events", "Pagina Eventi: step 4 titolo", 18),
    ("events.process.step4.text", "Arrivo con tutto il necessario: tu pensi solo a goderti la serata.", "events",
     "Pagina Eventi: step 4 testo", 19),
    ("events.cta.title", "Hai già una data in mente?", "events", "Pagina Eventi: titolo box finale", 20),
    ("events.cta.description",
     "Scrivimi su WhatsApp con i dettagli del tuo evento: ti rispondo con disponibilità e prima "
     "proposta di menu.", "events", "Pagina Eventi: descrizione box finale", 21),
    ("events.cta.button", "Scrivimi su WhatsApp", "events", "Pagina Eventi: pulsante box finale", 22),
    ("events.detail.backLabel", "Tutti gli eventi", "events", "Landing evento: link indietro", 30),
    ("events.detail.cta.title", "Hai già una data in mente?", "events", "Landing evento: titolo box finale", 31),
    ("events.detail.cta.description",
     "Scrivimi su WhatsApp con i dettagli del tuo evento: ti rispondo con disponibilità e prima "
     "proposta.", "events", "Landing evento: descrizione box finale", 32),
    ("events.detail.cta.button", "Scrivimi su WhatsApp", "events", "Landing evento: pulsante box finale", 33),
    ("recipes.page.eyebrow", "A Modo Mio", "recipes", "Pagina A Modo Mio: eyebrow", 1),
    ("recipes.page.title", "Cosa porto sulla tua tavola", "recipes", "Pagina A Modo Mio: titolo", 2),
    ("recipes.page.description",
     'Una selezione di "A Modo Mio" che uso per costruire i menu: ogni servizio viene poi '
     "personalizzato in base ai tuoi gusti, alle stagioni e all'occasione.", "recipes",
     "Pagina A Modo Mio: descrizione", 3),
    ("recipes.menuBanner.label", "In vetrina ora nel negozio", "recipes",
     "Pagina A Modo Mio: etichetta banner menu attivo", 4),
    ("recipes.emptyCategory", "Nessun piatto disponibile in questa categoria al momento.", "recipes",
     "Pagina A Modo Mio: messaggio categoria vuota", 5),
    ("recipes.category.tutti", "Tutti i piatti", "recipes", 'Pagina A Modo Mio: filtro "Tutti"', 10),
    ("recipes.category.antipasti", "Antipasti", "recipes", 'Pagina A Modo Mio: filtro "Antipasti"', 11),
    ("recipes.category.primi", "Primi", "recipes", 'Pagina A Modo Mio: filtro "Primi"', 12),
    ("recipes.category.secondi", "Secondi", "recipes", 'Pagina A Modo Mio: filtro "Secondi"', 13),
    ("recipes.category.dolci", "Dolci", "recipes", 'Pagina A Modo Mio: filtro "Dolci"', 14),
    ("recipes.cta.title", "Vuoi un menu pensato per te?", "recipes", "Pagina A Modo Mio: titolo box finale", 20),
    ("recipes.cta.description",
     "Raccontami l'occasione, il numero di invitati e le tue preferenze: costruiamo insieme il "
     "menu giusto.", "recipes", "Pagina A Modo Mio: descrizione box finale", 21),
    ("recipes.cta.button", "Parliamone su WhatsApp", "recipes", "Pagina A Modo Mio: pulsante box finale", 22),
    ("contact.page.eyebrow", "Contatti", "contact", "Pagina Contatti: eyebrow", 1),
    ("contact.page.title", "Parliamo del tuo progetto", "contact", "Pagina Contatti: titolo", 2),
    ("contact.page.description",
     "Scrivimi su WhatsApp per una risposta rapida, oppure compila il form: ti rispondo entro 24 ore.",
     "contact", "Pagina Contatti: descrizione", 3),
    ("contact.whatsappCard.title", "WhatsApp aziendale", "contact", "Pagina Contatti: titolo box WhatsApp", 10),
    ("contact.whatsappCard.description",
     "Il modo più veloce per ricevere disponibilità e prima proposta di menu.", "contact",
     "Pagina Contatti: descrizione box WhatsApp", 11),
    ("contact.emailCard.title", "Email", "contact", "Pagina Contatti: titolo box Email", 12),
    ("contact.emailCard.description", "Per richieste più strutturate o preventivi per eventi importanti.",
     "contact", "Pagina Contatti: descrizione box Email", 13),
    ("contact.form.title", "Oppure scrivimi qui", "contact", "Pagina Contatti: titolo form", 20),
    ("contact.form.successMessage", "Messaggio inviato! Ti risponderò il prima possibile.", "contact",
     "Pagina Contatti: messaggio di successo", 21),
    ("contact.form.submitButton", "Invia messaggio", "contact", "Pagina Contatti: pulsante invio", 22),
    ("about.page.eyebrow", "La mia storia", "about", "Pagina La mia storia: eyebrow", 0),
    ("about.page.description",
     "Non un'azienda, ma un percorso: dalla cucina di famiglia alle cucine professionali di Napoli, "
     "fino a diventare il servizio su misura che porto oggi sulla tua tavola.", "about",
     "Pagina La mia storia: descrizione hero", 1),
    ("about.milestones.heading", "Le tappe della mia storia", "about", "Pagina La mia storia: titolo tappe", 2),
    ("about.values.heading", "I principi della mia cucina", "about", "Pagina La mia storia: titolo principi", 3),
    ("footer.tagline", "Chef a domicilio, eventi privati e consulenza per nuove attività a {city}.", "footer",
     "Footer: frase sotto il nome del brand (usa {city} per la città)", 1),
    ("footer.sitemapHeading", "Mappa del sito", "footer", 'Footer: titolo colonna "mappa del sito"', 2),
    ("footer.contactHeading", "Contatti", "footer", 'Footer: titolo colonna "contatti"', 3),
]


def seed_default_admin(db: Session) -> None:
    if not settings.admin_seed_enabled:
        return
    if db.query(AdminUser).count() > 0:
        return

    # Il primo account creato deve essere SUPERADMIN: è l'unico ruolo in
    # grado di creare/gestire tutti gli altri account admin.
    admin = AdminUser(
        email=settings.admin_seed_email,
        password_hash=hash_password(settings.admin_seed_password),
        full_name=settings.admin_seed_full_name,
        role=AdminRole.SUPERADMIN,
        enabled=True,
    )
    db.add(admin)
    db.commit()
    logger.warning(
        "Creato utente SUPERADMIN di default (%s). Cambiare la password al primo accesso!",
        settings.admin_seed_email,
    )


def seed_content(db: Session) -> None:
    _seed_services(db)
    _seed_dishes(db)
    _seed_event_types(db)
    _seed_testimonials(db)
    _seed_milestones(db)
    _seed_core_values(db)
    _seed_site_texts(db)
    db.commit()


def _seed_site_texts(db: Session) -> None:
    if db.query(SiteText).count() > 0:
        return
    for key, value, category, label, order in _SITE_TEXTS_SEED:
        db.add(SiteText(key=key, value=value, category=category, label=label, sort_order=order))
    logger.info("Seed iniziale: testi del sito creati")


def _seed_services(db: Session) -> None:
    if db.query(ServiceOffering).count() > 0:
        return

    data = [
        ("Chef a domicilio", "Il ristorante arriva a casa tua",
         "Vengo io con la spesa, gli strumenti e il menu pensato su misura: tu prepari solo la tavola. "
         "Ideale per cene intime, ricorrenze o una serata speciale senza pensieri.", "home"),
        ("Eventi privati", "Compleanni, lauree, ricorrenze",
         "Menu dedicato, percorso di degustazione e servizio in sala per il tuo evento privato, a casa o "
         "in una location a tua scelta, da 2 a oltre 50 invitati.", "event"),
        ("Consulenza per start-up", "Per chi nasce nel mondo della ristorazione",
         "Supporto su menu engineering, food cost e identità di cucina per nuove attività: dal locale "
         "che apre ai progetti di delivery e dark kitchen.", "business"),
    ]
    for order, (title, tagline, description, icon) in enumerate(data):
        db.add(ServiceOffering(
            title=title, slug=slugify(title), tagline=tagline, description=description,
            icon=icon, sort_order=order, published=True, gallery_image_urls=[],
        ))
    logger.info("Seed iniziale: servizi creati")


def _seed_dishes(db: Session) -> None:
    if db.query(Dish).count() > 0:
        return

    data = [
        ("Genovese di pacchero", "primi",
         "La tradizione partenopea, cipolle stufate per ore e carne che si sfalda, su pacchero trafilato al bronzo.",
         ["tradizione", "comfort food"]),
        ("Parmigiana di melanzane", "antipasti",
         "Strati sottili, fritti al momento, fiordilatte e basilico: il classico napoletano nella sua versione più curata.",
         ["vegetariano", "classico"]),
        ("Baccalà alla napoletana", "secondi",
         "Pomodorini del piennolo, olive e capperi, per un piatto di mare con radici profonde nella cucina di casa.",
         ["pesce", "tradizione"]),
        ("Risotto \"Vesuvio\"", "primi",
         "Crema di provola affumicata e un cuore di pomodoro piccante: l'omaggio in piatto al profilo del Vesuvio.",
         ["signature", "creativo"]),
        ("Caprese rivisitata", "antipasti",
         "Mozzarella di bufala, pomodoro confit e basilico in gelée: un classico riletto in chiave contemporanea.",
         ["vegetariano", "fresco"]),
        ("Babà al limoncello", "dolci",
         "Lievitazione lenta e bagna preparata in casa, per il dolce simbolo di Napoli servito nella sua versione più golosa.",
         ["signature", "tradizione"]),
    ]
    for order, (name, category, description, tags) in enumerate(data):
        db.add(Dish(
            name=name, category=category, description=description, tags=tags,
            sort_order=order, published=True,
        ))
    logger.info("Seed iniziale: piatti del A MoDo Mio creati")


def _seed_event_types(db: Session) -> None:
    if db.query(EventType).count() > 0:
        return

    data = [
        ("Eventi privati", "Cene e pranzi su misura nella tua casa o in una location scelta da te.", "private",
         ["Compleanni e anniversari", "Cene romantiche", "Pranzi di famiglia e ricorrenze", "Aperitivi e degustazioni"]),
        ("Eventi aziendali", "Coffee break, pranzi di lavoro e cene per il team o per i tuoi clienti.", "corporate",
         ["Team building enogastronomici", "Pranzi e cene aziendali", "Lanci di prodotto", "Buffet per uffici e show-room"]),
        ("Catering su misura", "Servizio completo per matrimoni, cerimonie e grandi numeri.", "catering",
         ["Cerimonie e ricevimenti", "Buffet e postazioni a tema", "Servizio di sala incluso", "Menu degustazione personalizzato"]),
        ("Cooking class", "Imparo a cucinare insieme a te i grandi classici napoletani, passo dopo passo.", "cooking-class",
         ["Lezioni singole o di gruppo", "Adatte a principianti", "Ricette della tradizione", "Anche come idea regalo"]),
    ]
    for order, (title, description, icon, details) in enumerate(data):
        db.add(EventType(
            title=title, slug=slugify(title), description=description, icon=icon,
            details=details, gallery_image_urls=[], sort_order=order, published=True,
        ))
    logger.info("Seed iniziale: tipologie di eventi creati")


def _seed_testimonials(db: Session) -> None:
    if db.query(Testimonial).count() > 0:
        return

    data = [
        ("Maria F.", "Cena di compleanno",
         "Andrea ha trasformato il nostro salotto in un piccolo ristorante. Genovese da chiudere gli occhi, "
         "e zero stress per noi."),
        ("Antonio R.", "Evento aziendale",
         "Per il pranzo con i nostri clienti abbiamo scelto un menu su misura: puntualità, presentazione e "
         "sapori sopra le aspettative."),
        ("Giulia e Marco", "Cerimonia",
         "Dal primo assaggio fino al servizio in sala il giorno del matrimonio, un percorso curato in ogni dettaglio."),
    ]
    for order, (author, role, quote) in enumerate(data):
        db.add(Testimonial(author=author, role=role, quote=quote, sort_order=order, published=True))
    logger.info("Seed iniziale: testimonianze create")


def _seed_milestones(db: Session) -> None:
    if db.query(Milestone).count() > 0:
        return

    data = [
        ("2016", "Primi passi in cucina nei ristoranti storici del centro di Napoli."),
        ("2019", "Specializzazione in cucina tradizionale e nei grandi classici partenopei."),
        ("2022", "Avvio dell'attività di chef a domicilio ed eventi privati."),
        ("Oggi", "Consulenza per nuove attività di ristorazione, oltre a cene ed eventi su misura."),
    ]
    for order, (year, text) in enumerate(data):
        db.add(Milestone(year=year, text=text, sort_order=order))
    logger.info("Seed iniziale: tappe del percorso creato")


def _seed_core_values(db: Session) -> None:
    if db.query(CoreValue).count() > 0:
        return

    data = [
        ("Materie prime locali", "Pescato e prodotti dell'orto scelti ogni settimana dai produttori della zona."),
        ("Tradizione, non nostalgia", "Le ricette di famiglia restano il punto di partenza, non il limite."),
        ("Cura del servizio", "Dalla mise en place al saluto finale, il dettaglio fa la differenza."),
    ]
    for order, (title, text) in enumerate(data):
        db.add(CoreValue(title=title, text=text, sort_order=order))
    logger.info("Seed iniziale: principi della cucina creati")
