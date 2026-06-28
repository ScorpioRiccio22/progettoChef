// Chiamate REST verso il package it.andreamoiochef.backend.leads:
// invio pubblico di messaggi/iscrizioni, gestione admin (lista, lettura,
// cancellazione, export CSV).

import api from '@/services/api'
import type { ContactFormValues, ContactMessage, NewsletterSubscriber } from '@/types'

// --- Pubblico ----------------------------------------------------------

export const publicSendContactMessage = (values: ContactFormValues) => api.post('/public/contact', values)

export const publicSubscribeNewsletter = (email: string) => api.post('/public/newsletter', { email })

// --- Admin: messaggi di contatto ----------------------------------------

export const adminListContactMessages = () =>
  api.get<ContactMessage[]>('/admin/contact-messages').then((r) => r.data)

export const adminCountUnreadMessages = () =>
  api.get<{ count: number }>('/admin/contact-messages/unread-count').then((r) => r.data.count)

export const adminMarkMessageRead = (id: number, read = true) =>
  api.patch<ContactMessage>(`/admin/contact-messages/${id}/read`, null, { params: { read } }).then((r) => r.data)

export const adminDeleteContactMessage = (id: number) => api.delete(`/admin/contact-messages/${id}`)

/** Scarica il CSV dei messaggi e ne avvia il download nel browser. */
export const adminExportContactMessages = async () => {
  const response = await api.get('/admin/contact-messages/export', { responseType: 'blob' })
  downloadBlob(response.data, 'messaggi-contatto.csv')
}

// --- Admin: iscritti newsletter ------------------------------------------

export const adminListNewsletterSubscribers = () =>
  api.get<NewsletterSubscriber[]>('/admin/newsletter-subscribers').then((r) => r.data)

export const adminDeleteNewsletterSubscriber = (id: number) => api.delete(`/admin/newsletter-subscribers/${id}`)

export const adminExportNewsletterSubscribers = async () => {
  const response = await api.get('/admin/newsletter-subscribers/export', { responseType: 'blob' })
  downloadBlob(response.data, 'iscritti-newsletter.csv')
}

function downloadBlob(data: Blob, filename: string) {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
