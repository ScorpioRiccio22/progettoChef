// API client per il modulo leads (contatti + newsletter)
import api from './api'
import type { ContactLeadDto, NewsletterSubscriberDto, Page } from '@/types'

export const leadsApi = {
  // ---- CONTACTS (admin) ----
  getContacts: (page = 0, size = 20, unreadOnly = false) =>
    api.get<Page<ContactLeadDto>>('/admin/contacts', {
      params: { page, size, unreadOnly },
    }).then(r => r.data),
  markRead: (id: number) =>
    api.patch<ContactLeadDto>(`/admin/contacts/${id}/read`).then(r => r.data),
  deleteContact: (id: number) =>
    api.delete(`/admin/contacts/${id}`),

  // ---- NEWSLETTER (admin) ----
  getSubscribers: (page = 0, size = 20) =>
    api.get<Page<NewsletterSubscriberDto>>('/admin/newsletter', {
      params: { page, size },
    }).then(r => r.data),
  deleteSubscriber: (id: number) =>
    api.delete(`/admin/newsletter/${id}`),
  exportCsv: () =>
    api.get('/admin/newsletter/export', { responseType: 'blob' }).then(r => r.data as Blob),
}
