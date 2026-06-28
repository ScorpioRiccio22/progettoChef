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
  tagline?: string
  description?: string
  icon?: string
  imageUrl?: string | null
  published?: boolean
}

export const publicListServices = () => api.get<ServiceOffering[]>('/public/services').then((r) => r.data)

export const adminListServices = () => api.get<ServiceOffering[]>('/admin/services').then((r) => r.data)

export const adminCreateService = (payload: ServiceOfferingRequest) =>
  api.post<ServiceOffering>('/admin/services', payload).then((r) => r.data)

export const adminUpdateService = (id: number, payload: ServiceOfferingRequest) =>
  api.put<ServiceOffering>(`/admin/services/${id}`, payload).then((r) => r.data)

export const adminDeleteService = (id: number) => api.delete(`/admin/services/${id}`)

export const adminReorderServices = (orderedIds: number[]) =>
  api.put('/admin/services/reorder', { orderedIds })

// --- Piatti (ricettario) ----------------------------------------------------

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

// --- Tipologie di eventi ----------------------------------------------------

export interface EventTypeRequest {
  title: string
  description?: string
  icon?: string
  imageUrl?: string | null
  details?: string[]
  published?: boolean
}

export const publicListEventTypes = () => api.get<EventType[]>('/public/event-types').then((r) => r.data)

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

// --- Chi siamo: tappe del percorso (milestones) -----------------------------

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

// --- Chi siamo: principi/valori della cucina --------------------------------

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
