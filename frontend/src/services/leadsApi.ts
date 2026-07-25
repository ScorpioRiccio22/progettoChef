// Chiamate REST verso il package it.andreamoiochef.backend.leads:
// invio pubblico di messaggi/iscrizioni, gestione admin (lista, lettura,
// cancellazione, export CSV).

import api from '@/services/api'
import type { ContactFormValues, ContactMessage, NewsletterSubscriber } from '@/types'

// --- Pubblico ----------------------------------------------------------

export const publicSendContactMessage = (values: ContactFormValues) => api.post('/public/contact', values)

export interface NewsletterSubscribePayload {
  firstName: string
  lastName: string
  email: string
}

export const publicSubscribeNewsletter = (payload: NewsletterSubscribePayload) =>
  api.post('/public/newsletter', payload)

// --- Pubblico: diritto all'oblio (pagina /privacy) -----------------------
//
// Flusso a due step con verifica via OTP inviato per email:
// 1) l'utente invia nome, cognome ed email -> il backend genera un OTP,
//    lo associa alla richiesta e lo invia via email all'indirizzo indicato;
// 2) l'utente inserisce l'OTP ricevuto -> il backend verifica la coppia
//    email/OTP e, se valida, processa la richiesta di cancellazione dati
//    (diritto all'oblio, art. 17 GDPR).
// Il backend dovrà esporre questi due endpoint pubblici.

export interface ErasureRequestPayload {
  firstName: string
  lastName: string
  email: string
}

/** Step 1: avvia la richiesta di esercizio del diritto all'oblio; il backend invia l'OTP via email. */
export const publicRequestErasureOtp = (payload: ErasureRequestPayload) =>
  api.post<void>('/public/newsletter/erasure-request', payload)

export interface ConfirmErasureRequestPayload extends ErasureRequestPayload {
  otp: string
}

/** Step 2: conferma la richiesta con l'OTP ricevuto via email; il backend elabora la cancellazione. */
export const publicConfirmErasureRequest = (payload: ConfirmErasureRequestPayload) =>
  api.post<void>('/public/newsletter/erasure-request/confirm', payload)

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
