import { useState } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { changeOwnPassword } from '@/services/accountsApi'

interface ChangePasswordDialogProps {
  open: boolean
  onClose: () => void
}

export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async () => {
    setError(null)

    if (newPassword.length < 8) {
      setError('La nuova password deve avere almeno 8 caratteri')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Le due password non coincidono')
      return
    }

    setSaving(true)
    try {
      await changeOwnPassword({ currentPassword, newPassword })
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(extractMessage(err, 'Cambio password non riuscito'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cambia password</DialogTitle>
      <DialogContent>
        <div className="mt-2 flex flex-col gap-5">
          {success && <Alert severity="success">Password aggiornata con successo.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Password attuale"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            label="Nuova password"
            type="password"
            fullWidth
            helperText="Almeno 8 caratteri"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            label="Conferma nuova password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving} className="normal-case">
          Chiudi
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving || !currentPassword || newPassword.length < 8}
          className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          {saving ? 'Salvataggio…' : 'Aggiorna password'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function extractMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }
  return fallback
}
