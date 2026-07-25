import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Button, CircularProgress, Link as MuiLink, TextField } from '@mui/material'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { resetPassword } from '@/services/accountsApi'

function extractMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }
  return fallback
}

export default function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError('Il link non è valido: manca il token di reset. Richiedine uno nuovo.')
      return
    }
    if (newPassword.length < 8) {
      setError('La nuova password deve avere almeno 8 caratteri')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Le due password non coincidono')
      return
    }

    setStatus('submitting')
    try {
      await resetPassword(token, newPassword)
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setError(extractMessage(err, 'Il link non è valido o è scaduto. Richiedine uno nuovo.'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-[420px] rounded-3xl bg-ivory p-8 md:p-10">
        <div className="mb-6 flex flex-col items-center gap-1">
          <VesuvioMark className="h-20 w-20" />
          <h1 className="font-display text-xl font-semibold text-ink">Reimposta password</h1>
          <p className="text-center text-[0.9rem] text-ink-soft">Scegli una nuova password per il tuo account.</p>
        </div>

        {status === 'success' ? (
          <>
            <Alert severity="success" className="mb-4">
              Password aggiornata con successo.
            </Alert>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate('/admin/login', { replace: true })}
              className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
            >
              Vai al login
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">
              {!token && (
                <Alert severity="warning">
                  Questo link non contiene un token valido. Richiedi un nuovo link dalla pagina di login.
                </Alert>
              )}
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Nuova password"
                type="password"
                fullWidth
                helperText="Almeno 8 caratteri"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                autoComplete="new-password"
                autoFocus
              />
              <TextField
                label="Conferma nuova password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={status === 'submitting' || !token || newPassword.length < 8}
                className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
              >
                {status === 'submitting' ? <CircularProgress size={22} className="text-ink" /> : 'Aggiorna password'}
              </Button>
            </div>
          </form>
        )}

        <MuiLink
          component={RouterLink}
          to="/admin/login"
          underline="none"
          className="mt-6 flex items-center justify-center text-[0.85rem] text-ink-soft hover:text-gold-600"
        >
          Torna al login
        </MuiLink>
      </div>
    </div>
  )
}
