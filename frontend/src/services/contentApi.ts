// Centralizza tutte le chiamate REST verso le risorse di contenuto del
// backend (package it.andreamoiochef.backend.content). Le funzioni "public*"
// leggono solo i contenuti pubblicati (usate dal sito pubblico); le funzioni
// "admin*" richiedono il token JWT (già allegato automaticamente da
// services/api.ts) e permettono il CRUD completo dall'area admin.

import api from '@/services/api'
import type {
  AboutPageContent,
  CoreValue,
  Dish,
  EventType,
  Menu,
  MenuItem,
  Milestone,
  ServiceOffering,
  SiteSettings,
  Testimonial,
} from '@/types'

// --- Site settings -------------------------------------------------------

export const publicGetSiteSettings = () => api.get<SiteSettings>('/public/site-settings').then((r) => r.data)

export const adminGetSiteSettings = () => api.get<SiteSettings>('/admin/site-settings').then((r) => r.data)

export const adminUpdateSiteSettings = (payload: SiteSettings) =>
  api.put<SiteSettings>('/admin/site-settings', payload).then((r) => r.data)

// --- Servizi ---------------------------------------------------------------

export interface ServiceOfferingRequest {
  title: string
  /** Se omesso o vuoto, il backend lo genera automaticamente dal titolo. */
  slug?: string
  tagline?: string
  description?: string
  bodyContent?: string
  icon?: string
  imageUrl?: string | null
  videoUrl?: string | null
  galleryImageUrls?: string[]
  published?: boolean
}

export const publicListServices = () => api.get<ServiceOffering[]>('/public/services').then((r) => r.data)

/** Il servizio pubblicato corrispondente allo slug, per la pagina di dettaglio pubblica. */
export const publicGetServiceBySlug = (slug: string) =>
  api.get<ServiceOffering>(`/public/services/${slug}`).then((r) => r.data)

export const adminListServices = () => api.get<ServiceOffering[]>('/admin/services').then((r) => r.data)

export const adminCreateService = (payload: ServiceOfferingRequest) =>
  api.post<ServiceOffering>('/admin/services', payload).then((r) => r.data)

export const adminUpdateService = (id: number, payload: ServiceOfferingRequest) =>
  api.put<ServiceOffering>(`/admin/services/${id}`, payload).then((r) => r.data)

export const adminDeleteService = (id: number) => api.delete(`/admin/services/${id}`)

export const adminReorderServices = (orderedIds: number[]) =>
  api.put('/admin/services/reorder', { orderedIds })

// --- Piatti (A Modo Mio) -----------------------------------------------------

export interface DishRequest {
  name: string
  category: string
  description?: string
  imageUrl?: string | null
  tags?: string[]
  published?: boolean
}

export const publicListDishes = () => api.get<Dish[]>('/public/dishes').then((r) => r.data)

export const adminListDishes = () => api.get<Dish[]>('/admin/dishes').then((r) => r.data)

export const adminCreateDish = (payload: DishRequest) => api.post<Dish>('/admin/dishes', payload).then((r) => r.data)

export const adminUpdateDish = (id: number, payload: DishRequest) =>
  api.put<Dish>(`/admin/dishes/${id}`, payload).then((r) => r.data)

export const adminDeleteDish = (id: number) => api.delete(`/admin/dishes/${id}`)

export const adminReorderDishes = (orderedIds: number[]) => api.put('/admin/dishes/reorder', { orderedIds })

// --- Menu "A Modo Mio" (liste di piatti con prezzo, anche per il negozio fisico) --------

export interface MenuRequest {
  name: string
  /** 'SHOP' o 'EVENTS'. Se omesso, il backend usa 'SHOP' di default. */
  type?: 'SHOP' | 'EVENTS'
  description?: string
  /** Se true, questo diventa l'unico menu attivo per il suo tipo. */
  active?: boolean
}

export interface MenuItemRequest {
  name: string
  category?: string
  description?: string
  imageUrl?: string | null
  price: number
}

/** Il menu attualmente "in vetrina" per il tipo indicato (SHOP di default, oppure EVENTS), o null se nessuno attivo. */
export const publicGetActiveMenu = (type: 'SHOP' | 'EVENTS' = 'SHOP') =>
  api.get<Menu>('/public/menus/active', { params: { type } }).then((r) => (r.status === 204 ? null : r.data))

export const adminListMenus = (type: 'SHOP' | 'EVENTS' = 'SHOP') =>
  api.get<Menu[]>('/admin/menus', { params: { type } }).then((r) => r.data)

export const adminCreateMenu = (payload: MenuRequest) => api.post<Menu>('/admin/menus', payload).then((r) => r.data)

export const adminUpdateMenu = (id: number, payload: MenuRequest) =>
  api.put<Menu>(`/admin/menus/${id}`, payload).then((r) => r.data)

export const adminActivateMenu = (id: number) => api.put<Menu>(`/admin/menus/${id}/activate`).then((r) => r.data)

export const adminDeactivateMenu = (id: number) => api.put(`/admin/menus/${id}/deactivate`)

export const adminDeleteMenu = (id: number) => api.delete(`/admin/menus/${id}`)

export const adminReorderMenus = (orderedIds: number[]) => api.put('/admin/menus/reorder', { orderedIds })

export const adminAddMenuItem = (menuId: number, payload: MenuItemRequest) =>
  api.post<MenuItem>(`/admin/menus/${menuId}/items`, payload).then((r) => r.data)

export const adminUpdateMenuItem = (menuId: number, itemId: number, payload: MenuItemRequest) =>
  api.put<MenuItem>(`/admin/menus/${menuId}/items/${itemId}`, payload).then((r) => r.data)

export const adminDeleteMenuItem = (menuId: number, itemId: number) =>
  api.delete(`/admin/menus/${menuId}/items/${itemId}`)

export const adminReorderMenuItems = (menuId: number, orderedIds: number[]) =>
  api.put(`/admin/menus/${menuId}/items/reorder`, { orderedIds })

// --- Tipologie di eventi ----------------------------------------------------

export interface EventTypeRequest {
  title: string
  /** Se omesso o vuoto, il backend lo genera automaticamente dal titolo. */
  slug?: string
  description?: string
  bodyContent?: string
  icon?: string
  imageUrl?: string | null
  videoUrl?: string | null
  details?: string[]
  galleryImageUrls?: string[]
  published?: boolean
}

export const publicListEventTypes = () => api.get<EventType[]>('/public/event-types').then((r) => r.data)

/** La tipologia di evento pubblicata corrispondente allo slug, per la sua landing page pubblica. */
export const publicGetEventTypeBySlug = (slug: string) =>
  api.get<EventType>(`/public/event-types/${slug}`).then((r) => r.data)

export const adminListEventTypes = () => api.get<EventType[]>('/admin/event-types').then((r) => r.data)

export const adminCreateEventType = (payload: EventTypeRequest) =>
  api.post<EventType>('/admin/event-types', payload).then((r) => r.data)

export const adminUpdateEventType = (id: number, payload: EventTypeRequest) =>
  api.put<EventType>(`/admin/event-types/${id}`, payload).then((r) => r.data)

export const adminDeleteEventType = (id: number) => api.delete(`/admin/event-types/${id}`)

export const adminReorderEventTypes = (orderedIds: number[]) =>
  api.put('/admin/event-types/reorder', { orderedIds })

// --- Testimonianze -----------------------------------------------------------

export interface TestimonialRequest {
  author: string
  role?: string
  quote: string
  published?: boolean
}

export const publicListTestimonials = () => api.get<Testimonial[]>('/public/testimonials').then((r) => r.data)

export const adminListTestimonials = () => api.get<Testimonial[]>('/admin/testimonials').then((r) => r.data)

export const adminCreateTestimonial = (payload: TestimonialRequest) =>
  api.post<Testimonial>('/admin/testimonials', payload).then((r) => r.data)

export const adminUpdateTestimonial = (id: number, payload: TestimonialRequest) =>
  api.put<Testimonial>(`/admin/testimonials/${id}`, payload).then((r) => r.data)

export const adminDeleteTestimonial = (id: number) => api.delete(`/admin/testimonials/${id}`)

export const adminReorderTestimonials = (orderedIds: number[]) =>
  api.put('/admin/testimonials/reorder', { orderedIds })

// --- La mia storia: tappe del percorso (milestones) -------------------------

export interface MilestoneRequest {
  year: string
  text: string
}

export const publicGetAboutPage = () => api.get<AboutPageContent>('/public/about').then((r) => r.data)

export const adminListMilestones = () => api.get<Milestone[]>('/admin/milestones').then((r) => r.data)

export const adminCreateMilestone = (payload: MilestoneRequest) =>
  api.post<Milestone>('/admin/milestones', payload).then((r) => r.data)

export const adminUpdateMilestone = (id: number, payload: MilestoneRequest) =>
  api.put<Milestone>(`/admin/milestones/${id}`, payload).then((r) => r.data)

export const adminDeleteMilestone = (id: number) => api.delete(`/admin/milestones/${id}`)

export const adminReorderMilestones = (orderedIds: number[]) =>
  api.put('/admin/milestones/reorder', { orderedIds })

// --- La mia storia: principi/valori della cucina ---------------------------

export interface CoreValueRequest {
  title: string
  text: string
}

export const adminListCoreValues = () => api.get<CoreValue[]>('/admin/core-values').then((r) => r.data)

export const adminCreateCoreValue = (payload: CoreValueRequest) =>
  api.post<CoreValue>('/admin/core-values', payload).then((r) => r.data)

export const adminUpdateCoreValue = (id: number, payload: CoreValueRequest) =>
  api.put<CoreValue>(`/admin/core-values/${id}`, payload).then((r) => r.data)

export const adminDeleteCoreValue = (id: number) => api.delete(`/admin/core-values/${id}`)

export const adminReorderCoreValues = (orderedIds: number[]) =>
  api.put('/admin/core-values/reorder', { orderedIds })

// --- Upload immagini ---------------------------------------------------------

/** Carica un'immagine e restituisce l'URL pubblico da salvare nel campo imageUrl/logoUrl/ecc. */
export const adminUploadImage = (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .post<{ url: string }>('/admin/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data.url)
}

/**
 * Carica un video mp4 (usato soprattutto per le tipologie di evento) e
 * restituisce l'URL pubblico da salvare nel campo videoUrl. Accetta un
 * callback opzionale di progresso, utile per file di grandi dimensioni.
 */
export const adminUploadVideo = (file: File, onProgress?: (percent: number) => void): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .post<{ url: string }>('/admin/uploads/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      },
    })
    .then((r) => r.data.url)
}

// --- Testi configurabili del sito (titoli, descrizioni, testo dei pulsanti...) --------

export interface SiteTextItem {
  key: string
  value: string
  category: string
  label: string
}

/** Tutti i testi del sito in un'unica mappa chiave -> valore, per popolare le pagine pubbliche. */
export const publicGetSiteTexts = () => api.get<Record<string, string>>('/public/site-texts').then((r) => r.data)

export const adminListSiteTexts = () => api.get<SiteTextItem[]>('/admin/site-texts').then((r) => r.data)

export const adminUpdateSiteText = (key: string, value: string) =>
  api.put<SiteTextItem>(`/admin/site-texts/${encodeURIComponent(key)}`, { value }).then((r) => r.data)
