// API client per il modulo content (servizi pubblici + admin CRUD)
import api from './api'
import type {
  BrandDto, ServiceDto, DishDto, EventTypeDto,
  TestimonialDto, SocialLinkDto, Page
} from '@/types'

// ---- Endpoint pubblico aggregato ----
export interface PublicContent {
  brand: BrandDto
  services: ServiceDto[]
  dishes: DishDto[]
  eventTypes: EventTypeDto[]
  testimonials: TestimonialDto[]
  socialLinks: SocialLinkDto[]
}

export const contentApi = {
  // ---- PUBLIC ----
  getAll: () => api.get<PublicContent>('/content').then(r => r.data),

  // ---- BRAND (admin) ----
  getBrand: () => api.get<BrandDto>('/admin/brand').then(r => r.data),
  updateBrand: (data: Partial<BrandDto>) =>
    api.put<BrandDto>('/admin/brand', data).then(r => r.data),

  // ---- SERVICES (admin) ----
  getServices: (page = 0, size = 20) =>
    api.get<Page<ServiceDto>>('/admin/services', { params: { page, size } }).then(r => r.data),
  createService: (data: Partial<ServiceDto>) =>
    api.post<ServiceDto>('/admin/services', data).then(r => r.data),
  updateService: (id: number, data: Partial<ServiceDto>) =>
    api.put<ServiceDto>(`/admin/services/${id}`, data).then(r => r.data),
  deleteService: (id: number) =>
    api.delete(`/admin/services/${id}`),

  // ---- DISHES (admin) ----
  getDishes: (page = 0, size = 20) =>
    api.get<Page<DishDto>>('/admin/dishes', { params: { page, size } }).then(r => r.data),
  createDish: (data: Partial<DishDto>) =>
    api.post<DishDto>('/admin/dishes', data).then(r => r.data),
  updateDish: (id: number, data: Partial<DishDto>) =>
    api.put<DishDto>(`/admin/dishes/${id}`, data).then(r => r.data),
  deleteDish: (id: number) =>
    api.delete(`/admin/dishes/${id}`),

  // ---- EVENT TYPES (admin) ----
  getEventTypes: (page = 0, size = 20) =>
    api.get<Page<EventTypeDto>>('/admin/event-types', { params: { page, size } }).then(r => r.data),
  createEventType: (data: Partial<EventTypeDto>) =>
    api.post<EventTypeDto>('/admin/event-types', data).then(r => r.data),
  updateEventType: (id: number, data: Partial<EventTypeDto>) =>
    api.put<EventTypeDto>(`/admin/event-types/${id}`, data).then(r => r.data),
  deleteEventType: (id: number) =>
    api.delete(`/admin/event-types/${id}`),

  // ---- TESTIMONIALS (admin) ----
  getTestimonials: (page = 0, size = 20) =>
    api.get<Page<TestimonialDto>>('/admin/testimonials', { params: { page, size } }).then(r => r.data),
  createTestimonial: (data: Partial<TestimonialDto>) =>
    api.post<TestimonialDto>('/admin/testimonials', data).then(r => r.data),
  updateTestimonial: (id: number, data: Partial<TestimonialDto>) =>
    api.put<TestimonialDto>(`/admin/testimonials/${id}`, data).then(r => r.data),
  deleteTestimonial: (id: number) =>
    api.delete(`/admin/testimonials/${id}`),

  // ---- SOCIAL LINKS (admin) ----
  getSocialLinks: (page = 0, size = 20) =>
    api.get<Page<SocialLinkDto>>('/admin/social-links', { params: { page, size } }).then(r => r.data),
  createSocialLink: (data: Partial<SocialLinkDto>) =>
    api.post<SocialLinkDto>('/admin/social-links', data).then(r => r.data),
  updateSocialLink: (id: number, data: Partial<SocialLinkDto>) =>
    api.put<SocialLinkDto>(`/admin/social-links/${id}`, data).then(r => r.data),
  deleteSocialLink: (id: number) =>
    api.delete(`/admin/social-links/${id}`),
}
