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
