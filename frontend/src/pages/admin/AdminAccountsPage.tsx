import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
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
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
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
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Gestione account
          </Typography>
          <Typography sx={{ color: '#5C5246' }}>
            Crea e amministra gli accessi all'area admin. Riservato ai Superadmin.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
        >
          Nuovo account
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
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
                      {isSelf && (
                        <Chip label="Tu" size="small" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={account.role}
                        onChange={(e) => handleRoleChange(account, e.target.value as AdminRole)}
                        sx={{ minWidth: 150 }}
                      >
                        {(Object.keys(ROLE_LABELS) as AdminRole[]).map((role) => (
                          <MenuItem key={role} value={role}>
                            <Chip
                              label={ROLE_LABELS[role]}
                              size="small"
                              color={ROLE_COLORS[role]}
                              sx={{ pointerEvents: 'none' }}
                            />
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={isSelf ? 'Non puoi disabilitare il tuo account' : ''}>
                        <span>
                          <Switch
                            checked={account.enabled}
                            disabled={isSelf}
                            onChange={() => handleToggleStatus(account)}
                          />
                        </span>
                      </Tooltip>
                      <Typography component="span" sx={{ fontSize: '0.8rem', color: '#8A7F70' }}>
                        {account.enabled ? 'Attivo' : 'Disabilitato'}
                      </Typography>
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
                          <IconButton
                            onClick={() => setDeleteTarget(account)}
                            aria-label="Elimina"
                            disabled={isSelf}
                          >
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
          <Stack spacing={2.5} sx={{ mt: 1 }}>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={saving}>
            Annulla
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={saving || !form.email || !form.fullName || form.password.length < 8}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            {saving ? 'Creazione…' : 'Crea account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset password */}
      <Dialog open={!!resetTarget} onClose={() => setResetTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Reimposta password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
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
          >
            Annulla
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            disabled={resetting || newPassword.length < 8}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
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
    </Box>
  )
}

function extractMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }
  return fallback
}
