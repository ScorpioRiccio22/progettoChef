// Tipi di dominio condivisi — riflettono i DTO esposti dal backend Spring Boot.

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
}

export interface EventType {
  id: string
  title: string
  description: string
  details: string[]
  icon: 'private' | 'corporate' | 'catering' | 'cooking-class'
}

export interface Testimonial {
  id: string
  author: string
  role: string
  quote: string
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

export interface AdminUser {
  id: number
  email: string
  fullName: string
  role: 'ADMIN'
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

// --- Content API types --------------------------------------------------

export interface ServiceDto {
  id: number
  slug: string
  title: string
  tagline: string
  description: string
  icon: string
  displayOrder: number
  active: boolean
}

export interface DishDto {
  id: number
  slug: string
  name: string
  category: 'antipasti' | 'primi' | 'secondi' | 'dolci'
  description: string
  tags: string[]       // JSON array from backend
  imageUrl?: string
  active: boolean
}

export interface EventTypeDto {
  id: number
  slug: string
  title: string
  description: string
  details: string[]    // JSON array from backend
  icon: string
  displayOrder: number
  active: boolean
}

export interface TestimonialDto {
  id: number
  author: string
  role: string
  quote: string
  approved: boolean
  displayOrder: number
}

export interface SocialLinkDto {
  id: number
  platform: string
  label: string
  href: string
  icon: string
  displayOrder: number
  active: boolean
}

export interface BrandDto {
  id: number
  name: string
  handle: string
  role: string
  city: string
  payoff: string
  email: string
  whatsappNumber: string
  whatsappLink: string
  area: string
}

// --- Leads types --------------------------------------------------------

export interface ContactLeadDto {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface NewsletterSubscriberDto {
  id: number
  email: string
  active: boolean
  subscribedAt: string
}

// --- Pagination ---------------------------------------------------------

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
