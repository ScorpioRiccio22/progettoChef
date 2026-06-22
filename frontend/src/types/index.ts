// Tipi di dominio condivisi. Quando il backend Spring Boot sarà pronto,
// questi tipi rifletteranno i DTO esposti dalle API REST.

export interface ServiceOffering {
  id: string
  title: string
  tagline: string
  description: string
  icon: 'home' | 'event' | 'business'
}

export interface Dish {
  id: string
  name: string
  category: 'antipasti' | 'primi' | 'secondi' | 'dolci'
  description: string
  tags: string[]
  imageUrl?: string
}

export interface EventType {
  id: string
  title: string
  description: string
  details: string[]
  icon: 'private' | 'corporate' | 'catering' | 'cooking-class'
  imageUrl?: string
}

// Testi editabili dal pannello /admin
export interface SiteTexts {
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  aboutTitle: string
  aboutDescription: string
  aboutQuote: string
}

// Immagini del sito caricate dal pannello admin
export interface SiteImages {
  logo?: string         // Logo del brand (navbar + footer)
  heroBanner?: string   // Immagine/video di sfondo dell'Hero
  aboutPhoto?: string   // Foto nella sezione Chi siamo
}

// Statistiche della sezione Chi siamo
export interface AboutStat {
  id: string
  value: string
  label: string
}

export interface AboutContent {
  stats: AboutStat[]
}

// Informazioni di contatto gestibili dal pannello admin
export interface ContactInfo {
  email: string
  whatsappNumber: string
  whatsappLink: string
  area: string
  address?: string
}

export interface SocialLink {
  id: string
  label: string
  href: string
  icon: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'threads'
}

// Iscritti alla newsletter (lato admin)
export interface NewsletterSubscriber {
  id: string
  email: string
  subscribedAt: string
}

export interface ContactFormValues {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface NewsletterFormValues {
  email: string
  consent: boolean
}

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'
