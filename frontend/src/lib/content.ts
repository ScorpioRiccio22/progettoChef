// Contenuti del sito. In questa fase sono dati statici (mock) per costruire
// l'interfaccia. Quando il backend sarà collegato, queste costanti verranno
// sostituite da chiamate a /api/... tramite src/services/api.ts, mantenendo
// le stesse forme (types/index.ts) per non rompere i componenti.

import type { Dish, EventType, ServiceOffering, SocialLink, Testimonial } from '@/types'

export const BRAND = {
  name: 'Andrea Moio',
  handle: '@chefandreamoio',
  role: 'Chef',
  city: 'Napoli',
  payoff: 'Tradizione napoletana, su misura per i tuoi eventi',
}

export const CONTACT = {
  email: 'info@andreamoiochef.it', // PLACEHOLDER — sostituire con l'email reale
  whatsappNumber: '+39 000 000 0000', // PLACEHOLDER — sostituire con il numero reale
  whatsappLink: 'https://wa.me/390000000000', // PLACEHOLDER — sostituire con il link reale
  area: 'Napoli e provincia',
}

export const SOCIAL_LINKS: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/chefandreamoio', icon: 'instagram' },
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com/Chefmoioandrea', icon: 'facebook' },
  { id: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@chefandreamoio', icon: 'tiktok' },
  { id: 'threads', label: 'Threads', href: 'https://threads.net/@chefandreamoio', icon: 'threads' },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/390000000000', icon: 'whatsapp' },
]

export const SERVICES: ServiceOffering[] = [
  {
    id: 'a-domicilio',
    title: 'Chef a domicilio',
    tagline: 'Il ristorante arriva a casa tua',
    description:
      'Vengo io con la spesa, gli strumenti e il menu pensato su misura: tu prepari solo la tavola. Ideale per cene intime, ricorrenze o una serata speciale senza pensieri.',
    icon: 'home',
  },
  {
    id: 'eventi-privati',
    title: 'Eventi privati',
    tagline: 'Compleanni, lauree, ricorrenze',
    description:
      'Menu dedicato, percorso di degustazione e servizio in sala per il tuo evento privato, a casa o in una location a tua scelta, da 2 a oltre 50 invitati.',
    icon: 'event',
  },
  {
    id: 'startup',
    title: 'Consulenza per start-up',
    tagline: 'Per chi nasce nel mondo della ristorazione',
    description:
      'Supporto su menu engineering, food cost e identità di cucina per nuove attività: dal locale che apre ai progetti di delivery e dark kitchen.',
    icon: 'business',
  },
]

export const DISHES: Dish[] = [
  {
    id: 'genovese',
    name: 'Genovese di pacchero',
    category: 'primi',
    description: 'La tradizione partenopea, cipolle stufate per ore e carne che si sfalda, su pacchero trafilato al bronzo.',
    tags: ['tradizione', 'comfort food'],
  },
  {
    id: 'parmigiana',
    name: 'Parmigiana di melanzane',
    category: 'antipasti',
    description: 'Strati sottili, fritti al momento, fiordilatte e basilico: il classico napoletano nella sua versione più curata.',
    tags: ['vegetariano', 'classico'],
  },
  {
    id: 'baccala',
    name: 'Baccalà alla napoletana',
    category: 'secondi',
    description: 'Pomodorini del piennolo, olive e capperi, per un piatto di mare con radici profonde nella cucina di casa.',
    tags: ['pesce', 'tradizione'],
  },
  {
    id: 'risotto-vesuvio',
    name: 'Risotto "Vesuvio"',
    category: 'primi',
    description: 'Crema di provola affumicata e un cuore di pomodoro piccante: l\'omaggio in piatto al profilo del Vesuvio.',
    tags: ['signature', 'creativo'],
  },
  {
    id: 'caprese-rivisitata',
    name: 'Caprese rivisitata',
    category: 'antipasti',
    description: 'Mozzarella di bufala, pomodoro confit e basilico in gelée: un classico riletto in chiave contemporanea.',
    tags: ['vegetariano', 'fresco'],
  },
  {
    id: 'babà',
    name: 'Babà al limoncello',
    category: 'dolci',
    description: 'Lievitazione lenta e bagna preparata in casa, per il dolce simbolo di Napoli servito nella sua versione più golosa.',
    tags: ['signature', 'tradizione'],
  },
]

export const EVENTS: EventType[] = [
  {
    id: 'privati',
    title: 'Eventi privati',
    description: 'Cene e pranzi su misura nella tua casa o in una location scelta da te.',
    details: ['Compleanni e anniversari', 'Cene romantiche', 'Pranzi di famiglia e ricorrenze', 'Aperitivi e degustazioni'],
    icon: 'private',
  },
  {
    id: 'aziendali',
    title: 'Eventi aziendali',
    description: 'Coffee break, pranzi di lavoro e cene per il team o per i tuoi clienti.',
    details: ['Team building enogastronomici', 'Pranzi e cene aziendali', 'Lanci di prodotto', 'Buffet per uffici e show-room'],
    icon: 'corporate',
  },
  {
    id: 'catering',
    title: 'Catering su misura',
    description: 'Servizio completo per matrimoni, cerimonie e grandi numeri.',
    details: ['Cerimonie e ricevimenti', 'Buffet e postazioni a tema', 'Servizio di sala incluso', 'Menu degustazione personalizzato'],
    icon: 'catering',
  },
  {
    id: 'cooking-class',
    title: 'Cooking class',
    description: 'Imparo a cucinare insieme a te i grandi classici napoletani, passo dopo passo.',
    details: ['Lezioni singole o di gruppo', 'Adatte a principianti', 'Ricette della tradizione', 'Anche come idea regalo'],
    icon: 'cooking-class',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'Maria F.',
    role: 'Cena di compleanno',
    quote:
      'Andrea ha trasformato il nostro salotto in un piccolo ristorante. Genovese da chiudere gli occhi, e zero stress per noi.',
  },
  {
    id: 't2',
    author: 'Antonio R.',
    role: 'Evento aziendale',
    quote:
      'Per il pranzo con i nostri clienti abbiamo scelto un menu su misura: puntualità, presentazione e sapori sopra le aspettative.',
  },
  {
    id: 't3',
    author: 'Giulia e Marco',
    role: 'Cerimonia',
    quote:
      'Dal primo assaggio fino al servizio in sala il giorno del matrimonio, un percorso curato in ogni dettaglio.',
  },
]

export const NAV_ITEMS = [
  { label: 'Chi siamo', sectionId: 'chi-siamo', path: '/chi-siamo' },
  { label: 'Servizi', sectionId: 'servizi', path: '/' },
  { label: 'Ricettario', sectionId: 'ricettario', path: '/ricettario' },
  { label: 'Eventi', sectionId: 'eventi', path: '/eventi' },
  { label: 'Newsletter', sectionId: 'newsletter', path: '/' },
  { label: 'Contatti', sectionId: 'contatti', path: '/contatti' },
]
