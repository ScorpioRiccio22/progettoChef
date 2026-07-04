// Chiamate REST verso it.andreamoiochef.backend.auth: gestione account admin
// (creazione, cambio ruolo, abilitazione/disabilitazione, reset password) e
// cambio password personale. Le rotte /admin/accounts/** sono protette lato
// backend con @PreAuthorize("hasRole('SUPERADMIN')").

import api from '@/services/api'
import type { AdminRole, AdminUser, ChangeOwnPasswordPayload, CreateAdminAccountPayload } from '@/types'

// --- Gestione account (SUPERADMIN) ---------------------------------------

export const adminListAccounts = () => api.get<AdminUser[]>('/admin/accounts').then((r) => r.data)

export const adminCreateAccount = (payload: CreateAdminAccountPayload) =>
  api.post<AdminUser>('/admin/accounts', payload).then((r) => r.data)

export const adminUpdateAccountRole = (id: number, role: AdminRole) =>
  api.patch<AdminUser>(`/admin/accounts/${id}/role`, { role }).then((r) => r.data)

export const adminUpdateAccountStatus = (id: number, enabled: boolean) =>
  api.patch<AdminUser>(`/admin/accounts/${id}/status`, { enabled }).then((r) => r.data)

export const adminResetAccountPassword = (id: number, newPassword: string) =>
  api.post<void>(`/admin/accounts/${id}/reset-password`, { newPassword })

export const adminDeleteAccount = (id: number) => api.delete(`/admin/accounts/${id}`)

// --- Cambio password personale (qualsiasi ruolo autenticato) -------------

export const changeOwnPassword = (payload: ChangeOwnPasswordPayload) =>
  api.patch<void>('/auth/me/password', payload)
