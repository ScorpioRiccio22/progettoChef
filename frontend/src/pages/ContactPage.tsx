import { useState, type FormEvent } from 'react'
import { Alert, Box, Button, CircularProgress, Container, Stack, TextField, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PageHero from '@/components/ui/PageHero'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { sendContactMessage, resetContactStatus } from '@/store/slices/contactSlice'
import { CONTACT, SOCIAL_LINKS } from '@/lib/content'
import type { ContactFormValues } from '@/types'

const EMPTY_FORM: ContactFormValues = { name: '', email: '', phone: '', subject: '', message: '' }

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormValues>(EMPTY_FORM)
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.contact)

  const handleChange = (field: keyof ContactFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    dispatch(resetContactStatus())
    dispatch(sendContactMessage(form)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setForm(EMPTY_FORM)
      }
    })
  }

  return (
    <>
      <PageHero
        eyebrow="Contatti"
        title="Parliamo del tuo progetto"
        description="Scrivimi su WhatsApp per una risposta rapida, oppure compila il form: ti rispondo entro 24 ore."
      />

      <Box sx={{ backgroundColor: '#FBF6EC', py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: { xs: 6, md: 8 } }}>
            {/* Contatti diretti */}
            <Stack spacing={3}>
              <Box
                sx={{
                  backgroundColor: '#3A4430',
                  borderRadius: 3,
                  p: 4,
                  color: '#FBF6EC',
                }}
              >
                <WhatsAppIcon sx={{ fontSize: '2rem', mb: 1.5, color: '#D9B679' }} />
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.3rem', fontWeight: 600, mb: 1 }}>
                  WhatsApp aziendale
                </Typography>
                <Typography sx={{ color: 'rgba(251,246,236,0.75)', mb: 2.5, fontSize: '0.95rem' }}>
                  Il modo più veloce per ricevere disponibilità e prima proposta di menu.
                </Typography>
                <Button
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
                >
                  {CONTACT.whatsappNumber}
                </Button>
              </Box>

              <Box sx={{ backgroundColor: '#F3E9D6', borderRadius: 3, p: 4 }}>
                <EmailIcon sx={{ fontSize: '2rem', mb: 1.5, color: '#8A6428' }} />
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.3rem', fontWeight: 600, mb: 1 }}>
                  Email
                </Typography>
                <Typography sx={{ color: '#332A21', mb: 2.5, fontSize: '0.95rem' }}>
                  Per richieste più strutturate o preventivi per eventi importanti.
                </Typography>
                <Button
                  href={`mailto:${CONTACT.email}`}
                  variant="outlined"
                  fullWidth
                  startIcon={<EmailIcon />}
                  sx={{ borderColor: '#B8893E', color: '#8A6428', '&:hover': { borderColor: '#8A6428' } }}
                >
                  {CONTACT.email}
                </Button>
              </Box>

              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ color: '#332A21' }}>
                <LocationOnIcon sx={{ color: '#8A6428' }} />
                <Typography>{CONTACT.area}</Typography>
              </Stack>

              <Stack direction="row" spacing={1.2} sx={{ pt: 1 }}>
                {SOCIAL_LINKS.map((social) => (
                  <Button
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ color: '#8A6428', minWidth: 0, px: 1 }}
                  >
                    {social.label}
                  </Button>
                ))}
              </Stack>
            </Stack>

            {/* Form */}
            <Box>
              <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.5rem', fontWeight: 600, mb: 3 }}>
                Oppure scrivimi qui
              </Typography>

              {status === 'success' ? (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  Messaggio inviato! Ti risponderò il prima possibile.
                </Alert>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                      <TextField
                        required
                        fullWidth
                        label="Nome e cognome"
                        value={form.name}
                        onChange={handleChange('name')}
                      />
                      <TextField
                        required
                        fullWidth
                        type="email"
                        label="Email"
                        value={form.email}
                        onChange={handleChange('email')}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                      <TextField fullWidth label="Telefono (opzionale)" value={form.phone} onChange={handleChange('phone')} />
                      <TextField
                        required
                        fullWidth
                        label="Oggetto"
                        placeholder="Es. Cena per 6 persone il 14 settembre"
                        value={form.subject}
                        onChange={handleChange('subject')}
                      />
                    </Stack>
                    <TextField
                      required
                      fullWidth
                      multiline
                      minRows={5}
                      label="Messaggio"
                      placeholder="Raccontami data, numero di invitati e cosa hai in mente..."
                      value={form.message}
                      onChange={handleChange('message')}
                    />
                    {status === 'error' && <Alert severity="error">{error}</Alert>}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={status === 'submitting'}
                      sx={{ backgroundColor: '#B8893E', color: '#1C1712', alignSelf: 'flex-start', '&:hover': { backgroundColor: '#8A6428' } }}
                    >
                      {status === 'submitting' ? <CircularProgress size={22} sx={{ color: '#1C1712' }} /> : 'Invia messaggio'}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}
