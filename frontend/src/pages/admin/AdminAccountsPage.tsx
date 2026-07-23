import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyIcon from '@mui/icons-material/VpnKey'
import {
  adminCreateAccount,
  adminDeleteAccount,
  adminListAccounts,
  adminResetAccountPassword,
  adminUpdateAccountRole,
  adminUpdateAccountStatus,
} from '@/services/accountsApi'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { useAppSelector } from '@/hooks/redux'
import type { AdminRole, AdminUser, CreateAdminAccountPayload } from '@/types'

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPERADMIN: 'Superadmin',
  ADMIN: 'Admin',
  EDITOR: 'Solo grafica',
}

const ROLE_COLORS: Record<AdminRole, 'error' | 'primary' | 'default'> = {
  SUPERADMIN: 'error',
  ADMIN: 'primary',
  EDITOR: 'default',
}

const EMPTY_FORM: CreateAdminAccountPayload = { email: '', fullName: '', password: '', role: 'EDITOR' }

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminAccountsPage() {
  const currentUser = useAppSelector((state) => state.auth.user)

  const [items, setItems] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState<CreateAdminAccountPayload>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetting, setResetting] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminListAccounts()
      .then(setItems)
      .catch(() => setError('Impossibile caricare gli account'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setCreateOpen(true)
  }

  const handleCreate = async () => {
    setSaving(true)
    setError(null)
    try {
      await adminCreateAccount(form)
      setCreateOpen(false)
      load()
    } catch (err) {
      setError(extractMessage(err, 'Creazione account non riuscita'))
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = async (account: AdminUser, role: AdminRole) => {
    setError(null)
    try {
      const updated = await adminUpdateAccountRole(account.id, role)
      setItems((prev) => prev.map((a) => (a.id === account.id ? updated : a)))
    } catch (err) {
      setError(extractMessage(err, 'Cambio ruolo non riuscito'))
    }
  }

  const handleToggleStatus = async (account: AdminUser) => {
    setError(null)
    try {
      const updated = await adminUpdateAccountStatus(account.id, !account.enabled)
      setItems((prev) => prev.map((a) => (a.id === account.id ? updated : a)))
    } catch (err) {
      setError(extractMessage(err, 'Operazione non riuscita'))
    }
  }

  const handleResetPassword = async () => {
    if (!resetTarget) return
    setResetting(true)
    setError(null)
    try {
      await adminResetAccountPassword(resetTarget.id, newPassword)
      setResetTarget(null)
      setNewPassword('')
    } catch (err) {
      setError(extractMessage(err, 'Reset password non riuscito'))
    } finally {
      setResetting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setError(null)
    try {
      await adminDeleteAccount(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      setError(extractMessage(err, 'Eliminazione non riuscita'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">Gestione account</h1>
          <p className="text-clay">Crea e amministra gli accessi all'area admin. Riservato ai Superadmin.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          className="whitespace-nowrap bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          Nuovo account
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer className="rounded-2xl border border-black/10">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ruolo</TableCell>
                <TableCell>Stato</TableCell>
                <TableCell>Ultimo accesso</TableCell>
                <TableCell align="right">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((account) => {
                const isSelf = account.email.toLowerCase() === currentUser?.email.toLowerCase()
                return (
                  <TableRow key={account.id} hover>
                    <TableCell>
                      {account.fullName}
                      {isSelf && <Chip label="Tu" size="small" className="ml-2" />}
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={account.role}
                        onChange={(e) => handleRoleChange(account, e.target.value as AdminRole)}
                        className="min-w-[150px]"
                      >
                        {(Object.keys(ROLE_LABELS) as AdminRole[]).map((role) => (
                          <MenuItem key={role} value={role}>
                            <Chip label={ROLE_LABELS[role]} size="small" color={ROLE_COLORS[role]} className="pointer-events-none" />
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={isSelf ? 'Non puoi disabilitare il tuo account' : ''}>
                        <span>
                          <Switch checked={account.enabled} disabled={isSelf} onChange={() => handleToggleStatus(account)} />
                        </span>
                      </Tooltip>
                      <span className="text-[0.8rem] text-clay">{account.enabled ? 'Attivo' : 'Disabilitato'}</span>
                    </TableCell>
                    <TableCell>{formatDate(account.lastLoginAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Reimposta password">
                        <IconButton onClick={() => setResetTarget(account)} aria-label="Reimposta password">
                          <KeyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={isSelf ? 'Non puoi eliminare il tuo account' : 'Elimina account'}>
                        <span>
                          <IconButton onClick={() => setDeleteTarget(account)} aria-label="Elimina" disabled={isSelf}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Creazione nuovo account */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuovo account admin</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
            <TextField
              label="Nome completo"
              fullWidth
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <TextField
              label="Password provvisoria"
              type="password"
              fullWidth
              helperText="Almeno 8 caratteri. L'utente potrà cambiarla dopo il primo accesso."
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
            />
            <TextField
              select
              label="Ruolo"
              fullWidth
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as AdminRole }))}
            >
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map((role) => (
                <MenuItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={saving} className="normal-case">
            Annulla
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={saving || !form.email || !form.fullName || form.password.length < 8}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            {saving ? 'Creazione…' : 'Crea account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset password */}
      <Dialog open={!!resetTarget} onClose={() => setResetTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Reimposta password</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-4">
            Stai per reimpostare la password di <strong>{resetTarget?.fullName}</strong>.
          </DialogContentText>
          <TextField
            label="Nuova password"
            type="password"
            fullWidth
            helperText="Almeno 8 caratteri"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setResetTarget(null)
              setNewPassword('')
            }}
            disabled={resetting}
            className="normal-case"
          >
            Annulla
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            disabled={resetting || newPassword.length < 8}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            {resetting ? 'Salvataggio…' : 'Reimposta'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemLabel={deleteTarget?.fullName ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}

function extractMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }
  return fallback
}
