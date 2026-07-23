import { useState, type FormEvent } from 'react'
import { Alert, Button, Checkbox, CircularProgress, Container, FormControlLabel, TextField } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { Link as RouterLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { subscribeToNewsletter, resetNewsletterStatus } from '@/store/slices/newsletterSlice'
import { useSiteContent } from '@/hooks/useSiteContent'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [privacyTouched, setPrivacyTouched] = useState(false)

  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.newsletter)
  const { t } = useSiteContent()

  const isEmailValid = EMAIL_REGEX.test(email)
  const showEmailError = emailTouched && !isEmailValid
  const showPrivacyError = privacyTouched && !privacyAccepted

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setEmailTouched(true)
    setPrivacyTouched(true)

    if (!isEmailValid || !privacyAccepted) return

    dispatch(resetNewsletterStatus())
    dispatch(subscribeToNewsletter(email))
  }

  return (
    <div id="newsletter" className="relative overflow-hidden bg-ink py-[72px] md:py-[88px]">
      <Container maxWidth="sm" className="relative text-center">
<div className="mb-4 text-gold-300">
  <MailOutlineIcon sx={{ fontSize: '8rem' }} />
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
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
           <div className="flex items-start gap-3 flex-row sm:items-stretch">
  <TextField
    required
    type="email"
    placeholder={t('home.newsletter.placeholder', 'La tua email')}
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    onBlur={() => setEmailTouched(true)}
    error={showEmailError}
    helperText={showEmailError ? t('home.newsletter.emailError', 'Inserisci un indirizzo email valido.') : ' '}
    fullWidth
    size="medium"
    aria-label="Indirizzo email per la newsletter"
    sx={{
      '& .MuiOutlinedInput-root': { backgroundColor: '#FBF6EC', borderRadius: 999, height: '56px' },
      '& .MuiFormHelperText-root': { color: '#F2B8B8', textAlign: 'left', marginLeft: '14px' },
    }}
  />
  <Button
    type="submit"
    variant="contained"
    disabled={status === 'submitting'}
    className="whitespace-nowrap bg-gold-500 px-8 text-ink normal-case hover:bg-gold-300"
    sx={{ height: '56px', borderRadius: 999 }}
  >
    {status === 'submitting' ? (
      <CircularProgress size={20} className="text-ink" />
    ) : (
      t('home.newsletter.submitButton', 'Iscriviti')
    )}
  </Button>
</div>

            <FormControlLabel
              className="mx-0 items-start text-left"
              control={
                <Checkbox
                  checked={privacyAccepted}
                  onChange={(event) => setPrivacyAccepted(event.target.checked)}
                  onBlur={() => setPrivacyTouched(true)}
                  sx={{
                    color: 'rgba(251,246,236,0.5)',
                    padding: '4px 8px 4px 0',
                    '&.Mui-checked': { color: '#B8893E' },
                  }}
                />
              }
              label={
                <span className="text-[0.8rem] leading-snug text-ivory/70">
                  Accettando acconsenti al trattamento dei tuoi dati secondo le regole della{' '}
                  <RouterLink to="/privacy-policy" className="text-gold-300 underline hover:text-gold-500">
                    privacy policy
                  </RouterLink>
                  .
                </span>
              }
            />
            {showPrivacyError && (
              <p className="-mt-2 text-left text-[0.78rem] text-[#F2B8B8]">
                {t('home.newsletter.privacyError', "Devi accettare l'informativa sulla privacy per iscriverti.")}
              </p>
            )}
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