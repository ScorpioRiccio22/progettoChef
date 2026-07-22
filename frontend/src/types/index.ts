// Tipi di dominio condivisi. Rispecchiano i DTO esposti dalle API REST del
// backend Spring Boot (package it.andreamoiochef.backend.content / leads).

export interface ServiceOffering {
  id: number
  title: string
  /** Usato per l'URL della pagina di dettaglio pubblica: /servizi/{slug} */
  slug: string
  tagline: string
  description: string
  /** Testo più esteso mostrato nella pagina di dettaglio (paragrafi separati da riga vuota). */
  bodyContent: string
  icon: 'home' | 'event' | 'business' | string
  imageUrl: string | null
  videoUrl: string | null
  galleryImageUrls: string[]
  sortOrder: number
  published: boolean
}

export interface Dish {
  id: number
  name: string
  category: 'antipasti' | 'primi' | 'secondi' | 'dolci' | string
  description: string
  imageUrl: string | null
  tags: string[]
  sortOrder: number
  published: boolean
}

export interface MenuItem {
  id: number
  name: string
  category: string
  description: string
  imageUrl: string | null
  price: number
  sortOrder: number
}

export interface Menu {
  id: number
  name: string
  /** 'SHOP' = negozio fisico, 'EVENTS' = eventi. */
  type: 'SHOP' | 'EVENTS' | string
  description: string
  /** Se true, è il menu mostrato in vetrina (per il negozio o per gli eventi) in questo momento. */
  active: boolean
  sortOrder: number
  items: MenuItem[]
}

export interface EventType {
  id: number
  title: string
  /** Usato per l'URL della landing page pubblica: /eventi/{slug} */
  slug: string
  description: string
  /** Testo più esteso per la landing page (per gli eventi "privati" consigliato breve). */
  bodyContent: string
  icon: 'private' | 'corporate' | 'catering' | 'cooking-class' | string
  imageUrl: string | null
  videoUrl: string | null
  details: string[]
  galleryImageUrls: string[]
  sortOrder: number
  published: boolean
}

export interface Testimonial {
  id: number
  author: string
  role: string
  quote: string
  sortOrder: number
  published: boolean
}

// --- Recensioni Google (sezione pubblica, sostituisce le testimonianze manuali quando configurata) ---

export interface GoogleReview {
  authorName: string
  authorPhotoUrl: string | null
  profileUrl: string | null
  rating: number
  relativeTime: string
  text: string
  timestamp: number
}

export interface GoogleReviewsResponse {
  configured: boolean
  placeName: string | null
  rating: number | null
  totalReviews: number | null
  mapsUrl: string | null
  reviews: GoogleReview[]
}

export interface Milestone {
  id: number
  year: string
  text: string
  sortOrder: number
}

export interface CoreValue {
  id: number
  title: string
  text: string
  sortOrder: number
}

export interface AboutPageContent {
  milestones: Milestone[]
  values: CoreValue[]
}

export interface SiteSettings {
  brandName: string
  brandHandle: string
  brandRole: string
  brandCity: string
  brandPayoff: string
  logoUrl: string | null
  faviconUrl: string | null
  contactEmail: string
  whatsappNumber: string
  whatsappLink: string
  contactArea: string
  mapAddress: string
  instagramUrl: string
  facebookUrl: string
  tiktokUrl: string
  threadsUrl: string
  heroTitle: string
  heroSubtitle: string
  heroImageUrl: string | null
  aboutIntro: string
  aboutParagraph1: string
  aboutParagraph2: string
  aboutImageUrl: string | null
  statYearsValue: string
  statYearsLabel: string
  statEventsValue: string
  statEventsLabel: string
  statIngredientsValue: string
  statIngredientsLabel: string
}

export interface SocialLink {
  id: string
  label: string
  href: string
  icon: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'threads'
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

// --- Area admin ---------------------------------------------------------

export type AdminRole = 'SUPERADMIN' | 'ADMIN' | 'EDITOR'

export interface AdminUser {
  id: number
  email: string
  fullName: string
  role: AdminRole
  enabled: boolean
  createdAt: string
  lastLoginAt: string | null
}

export interface LoginFormValues {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
  user: AdminUser
}

// --- Gestione account admin (solo SUPERADMIN) ----------------------------

export interface CreateAdminAccountPayload {
  email: string
  fullName: string
  password: string
  role: AdminRole
}

export interface ChangeOwnPasswordPayload {
  currentPassword: string
  newPassword: string
}

// --- Messaggi di contatto e iscritti newsletter (vista admin) -----------

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface NewsletterSubscriber {
  id: number
  email: string
  subscribedAt: string
}

