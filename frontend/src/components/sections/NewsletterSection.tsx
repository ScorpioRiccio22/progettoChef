import { useState, type FormEvent } from 'react'
import { Alert, Button, CircularProgress, Container, TextField } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { subscribeToNewsletter, resetNewsletterStatus } from '@/store/slices/newsletterSlice'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.newsletter)
  const { t } = useSiteContent()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    dispatch(resetNewsletterStatus())
    dispatch(subscribeToNewsletter(email))
  }

  return (
    <div id="newsletter" className="relative overflow-hidden bg-ink py-[72px] md:py-[88px]">
      <div className="absolute -right-5 -top-10 w-[260px] text-gold-500/[.15]">
        <VesuvioMark className="w-full" color="currentColor" />
      </div>
      <Container maxWidth="sm" className="relative text-center">
        <div className="mb-4 text-gold-300">
          <MailOutlineIcon fontSize="large" />
        </div>
        <h2 className="mb-3 font-display text-[1.8rem] font-semibold text-ivory md:text-[2.2rem]">
          {t('home.newsletter.title', 'Ricette, eventi e novità via email')}
        </h2>
        <p className="mb-8 text-ivory/70">
          {t(
            'home.newsletter.description',
            'Una mail ogni tanto, niente spam: nuove ricette di "A MoDo mio", disponibilità per gli eventi e qualche consiglio di cucina napoletana.',
          )}
        </p>

        {status === 'success' ? (
          <Alert severity="success" className="rounded-xl">
            {t('home.newsletter.successMessage', 'Iscrizione completata! Controlla la tua casella email a breve.')}
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <TextField
              required
              type="email"
              placeholder={t('home.newsletter.placeholder', 'La tua email')}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              size="medium"
              aria-label="Indirizzo email per la newsletter"
              // Selettore verso lo slot interno di MUI: non esprimibile con className Tailwind.
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FBF6EC', borderRadius: 999 } }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={status === 'submitting'}
              className="whitespace-nowrap bg-gold-500 px-8 text-ink normal-case hover:bg-gold-300"
            >
              {status === 'submitting' ? (
                <CircularProgress size={20} className="text-ink" />
              ) : (
                t('home.newsletter.submitButton', 'Iscrivimi')
              )}
            </Button>
          </form>
        )}

        {status === 'error' && (
          <Alert severity="error" className="mt-4 rounded-xl">
            {error}
          </Alert>
        )}

        <p className="mt-5 text-[0.78rem] text-ivory/45">
          {t(
            'home.newsletter.disclaimer',
            "Iscrivendoti accetti di ricevere comunicazioni periodiche. Puoi annullare l'iscrizione in qualsiasi momento.",
          )}
        </p>
      </Container>
    </div>
  )
}
