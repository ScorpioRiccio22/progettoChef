import { useState, type FormEvent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Alert, Button, CircularProgress, Link as MuiLink, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { forgotPassword } from '@/services/accountsApi'

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('submitting')
    try {
      await forgotPassword(email)
    } finally {
      // Per sicurezza il backend risponde sempre 204, anche se l'email non
      // esiste: mostriamo lo stesso messaggio di successo in ogni caso, per
      // non rivelare quali indirizzi sono registrati.
      setStatus('sent')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-[420px] rounded-3xl bg-ivory p-8 md:p-10">
        <div className="mb-6 flex flex-col items-center gap-1">
          <VesuvioMark className="h-20 w-20" />
          <h1 className="font-display text-xl font-semibold text-ink">Password dimenticata</h1>
          <p className="text-center text-[0.9rem] text-ink-soft">
            Inserisci la tua email: se corrisponde a un account, ti mandiamo un link per reimpostare la password.
          </p>
        </div>

        {status === 'sent' ? (
          <Alert severity="success" className="mb-2">
            Se l&apos;indirizzo è registrato, riceverai a breve una email con le istruzioni per reimpostare la
            password.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
                autoComplete="username"
                autoFocus
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={status === 'submitting' || !email}
                className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
              >
                {status === 'submitting' ? <CircularProgress size={22} className="text-ink" /> : 'Invia link di reset'}
              </Button>
            </div>
          </form>
        )}

        <MuiLink
          component={RouterLink}
          to="/admin/login"
          underline="none"
          className="mt-6 flex items-center justify-center gap-1 text-[0.85rem] text-ink-soft hover:text-gold-600"
        >
          <ArrowBackIcon fontSize="small" />
          Torna al login
        </MuiLink>
      </div>
    </div>
  )
}
