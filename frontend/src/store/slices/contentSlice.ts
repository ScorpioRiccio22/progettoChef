import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DISHES, EVENTS, SERVICES, SOCIAL_LINKS, CONTACT, BRAND } from '@/lib/content'
import type {
  Dish,
  EventType,
  SiteTexts,
  SiteImages,
  ServiceOffering,
  ContactInfo,
  SocialLink,
  AboutContent,
  NewsletterSubscriber,
} from '@/types'

// Stato centralizzato di tutti i contenuti gestibili dal pannello /admin.
// Parte dai dati mock di lib/content.ts; quando il backend Spring Boot sarà
// collegato, le azioni richiameranno le API REST mantenendo la stessa forma.

interface ContentState {
  dishes: Dish[]
  events: EventType[]
  services: ServiceOffering[]
  texts: SiteTexts
  images: SiteImages
  about: AboutContent
  contact: ContactInfo
  socialLinks: SocialLink[]
  newsletterSubscribers: NewsletterSubscriber[]
  isDirty: boolean
}

const initialTexts: SiteTexts = {
  heroEyebrow: 'Chef a Napoli',
  heroTitle: 'La cucina napoletana, portata a casa tua.',
  heroDescription:
    'Sono Andrea Moio: chef a domicilio per cene private, eventi e nuove attività che vogliono partire con il piede giusto in cucina.',
  aboutTitle: 'La cucina di Andrea Moio',
  aboutDescription:
    "Cresciuto tra i fornelli di casa e le cucine professionali di Napoli, porto la tradizione partenopea dove serve davvero: sulla tua tavola. Ogni servizio nasce da un'idea semplice — la cucina di qualità non ha bisogno di un ristorante, ha bisogno di cura.",
  aboutQuote: 'Ogni piatto racconta una storia di famiglia.',
}

const initialImages: SiteImages = {
  logo: undefined,
  heroBanner: undefined,
  aboutPhoto: undefined,
}

const initialAbout: AboutContent = {
  stats: [
    { id: 'exp', value: '8+', label: 'anni di esperienza' },
    { id: 'events', value: '150+', label: 'eventi curati' },
    { id: 'local', value: '100%', label: 'materie prime locali' },
  ],
}

const initialContact: ContactInfo = {
  email: CONTACT.email,
  whatsappNumber: CONTACT.whatsappNumber,
  whatsappLink: CONTACT.whatsappLink,
  area: CONTACT.area,
  address: '',
}

const initialState: ContentState = {
  dishes: DISHES,
  events: EVENTS,
  services: SERVICES,
  texts: initialTexts,
  images: initialImages,
  about: initialAbout,
  contact: initialContact,
  socialLinks: SOCIAL_LINKS,
  newsletterSubscribers: [],
  isDirty: false,
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // --- Piatti ---
    addDish(state, action: PayloadAction<Omit<Dish, 'id'>>) {
      state.dishes.push({ ...action.payload, id: generateId('dish') })
      state.isDirty = true
    },
    updateDish(state, action: PayloadAction<Dish>) {
      const index = state.dishes.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) state.dishes[index] = action.payload
      state.isDirty = true
    },
    deleteDish(state, action: PayloadAction<string>) {
      state.dishes = state.dishes.filter((d) => d.id !== action.payload)
      state.isDirty = true
    },

    // --- Eventi ---
    addEvent(state, action: PayloadAction<Omit<EventType, 'id'>>) {
      state.events.push({ ...action.payload, id: generateId('event') })
      state.isDirty = true
    },
    updateEvent(state, action: PayloadAction<EventType>) {
      const index = state.events.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) state.events[index] = action.payload
      state.isDirty = true
    },
    deleteEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter((e) => e.id !== action.payload)
      state.isDirty = true
    },

    // --- Servizi ---
    addService(state, action: PayloadAction<Omit<ServiceOffering, 'id'>>) {
      state.services.push({ ...action.payload, id: generateId('service') })
      state.isDirty = true
    },
    updateService(state, action: PayloadAction<ServiceOffering>) {
      const index = state.services.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) state.services[index] = action.payload
      state.isDirty = true
    },
    deleteService(state, action: PayloadAction<string>) {
      state.services = state.services.filter((s) => s.id !== action.payload)
      state.isDirty = true
    },

    // --- Testi del sito ---
    updateTexts(state, action: PayloadAction<Partial<SiteTexts>>) {
      state.texts = { ...state.texts, ...action.payload }
      state.isDirty = true
    },

    // --- Immagini del sito ---
    updateImages(state, action: PayloadAction<Partial<SiteImages>>) {
      state.images = { ...state.images, ...action.payload }
      state.isDirty = true
    },

    // --- Chi siamo / Statistiche ---
    updateAboutStat(state, action: PayloadAction<{ id: string; value: string; label: string }>) {
      const index = state.about.stats.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) state.about.stats[index] = action.payload
      state.isDirty = true
    },

    // --- Informazioni di contatto ---
    updateContact(state, action: PayloadAction<Partial<ContactInfo>>) {
      state.contact = { ...state.contact, ...action.payload }
      state.isDirty = true
    },

    // --- Link social ---
    updateSocialLink(state, action: PayloadAction<SocialLink>) {
      const index = state.socialLinks.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) state.socialLinks[index] = action.payload
      state.isDirty = true
    },
    addSocialLink(state, action: PayloadAction<Omit<SocialLink, 'id'>>) {
      state.socialLinks.push({ ...action.payload, id: generateId('social') })
      state.isDirty = true
    },
    deleteSocialLink(state, action: PayloadAction<string>) {
      state.socialLinks = state.socialLinks.filter((s) => s.id !== action.payload)
      state.isDirty = true
    },

    // --- Newsletter subscribers (ricevuti dal backend) ---
    setNewsletterSubscribers(state, action: PayloadAction<NewsletterSubscriber[]>) {
      state.newsletterSubscribers = action.payload
    },
    addNewsletterSubscriber(state, action: PayloadAction<string>) {
      // Aggiunto quando il frontend registra un'iscrizione
      const exists = state.newsletterSubscribers.find((s) => s.email === action.payload)
      if (!exists) {
        state.newsletterSubscribers.push({
          id: generateId('sub'),
          email: action.payload,
          subscribedAt: new Date().toISOString(),
        })
      }
    },
    removeNewsletterSubscriber(state, action: PayloadAction<string>) {
      state.newsletterSubscribers = state.newsletterSubscribers.filter((s) => s.id !== action.payload)
    },

    // --- Stato "salvato" ---
    markSaved(state) {
      state.isDirty = false
    },
  },
})

export const {
  addDish, updateDish, deleteDish,
  addEvent, updateEvent, deleteEvent,
  addService, updateService, deleteService,
  updateTexts,
  updateImages,
  updateAboutStat,
  updateContact,
  updateSocialLink, addSocialLink, deleteSocialLink,
  setNewsletterSubscribers, addNewsletterSubscriber, removeNewsletterSubscriber,
  markSaved,
} = contentSlice.actions
export default contentSlice.reducer
