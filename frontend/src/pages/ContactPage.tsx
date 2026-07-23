import { useState, type FormEvent } from 'react'
import { Alert, Button, CircularProgress, Container, TextField } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PageHero from '@/components/ui/PageHero'
import ContactMap from '@/components/ui/ContactMap'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { sendContactMessage, resetContactStatus } from '@/store/slices/contactSlice'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { ContactFormValues } from '@/types'

const EMPTY_FORM: ContactFormValues = { name: '', email: '', phone: '', subject: '', message: '' }

export default function ContactPage() {
  const { contact, socialLinks, t } = useSiteContent()
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
        eyebrow={t('contact.page.eyebrow', 'Contatti')}
        title={t('contact.page.title', 'Parliamo del tuo progetto')}
        description={t(
          'contact.page.description',
          'Scrivimi su WhatsApp per una risposta rapida, oppure compila il form: ti rispondo entro 24 ore.',
        )}
      />

      <div className="bg-ivory py-16 md:py-[88px]">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
            {/* Contatti diretti */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-olive p-8 text-ivory">
                <WhatsAppIcon className="mb-3 text-3xl text-gold-300" />
                <p className="mb-2 font-display text-[1.3rem] font-semibold">
                  {t('contact.whatsappCard.title', 'WhatsApp aziendale')}
                </p>
                <p className="mb-6 text-[0.95rem] text-ivory/75">
                  {t('contact.whatsappCard.description', 'Il modo più veloce per ricevere disponibilità e prima proposta di menu.')}
                </p>
                <Button
                  href={contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
                >
                  {contact.whatsappNumber}
                </Button>
              </div>

              <div className="rounded-2xl bg-ivory-deep p-8">
                <EmailIcon className="mb-3 text-3xl text-gold-600" />
                <p className="mb-2 font-display text-[1.3rem] font-semibold">{t('contact.emailCard.title', 'Email')}</p>
                <p className="mb-6 text-[0.95rem] text-ink-soft">
                  {t('contact.emailCard.description', 'Per richieste più strutturate o preventivi per eventi importanti.')}
                </p>
                <Button
                  href={`mailto:${contact.email}`}
                  variant="outlined"
                  fullWidth
                  startIcon={<EmailIcon />}
                  className="border-gold-500 text-gold-600 normal-case hover:border-gold-600"
                >
                  {contact.email}
                </Button>
              </div>

              <div className="flex items-center gap-3 text-ink-soft">
                <LocationOnIcon className="text-gold-600" />
                <p>{contact.area}</p>
              </div>

              {contact.mapAddress && (
                <div className="space-y-2">
                  <p className="text-sm text-ink-soft">{contact.mapAddress}</p>
                  <ContactMap address={contact.mapAddress} />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {socialLinks.map((social) => (
                  <Button
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    className="min-w-0 px-2 normal-case text-gold-600"
                  >
                    {social.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <p className="mb-6 font-display text-2xl font-semibold">{t('contact.form.title', 'Oppure scrivimi qui')}</p>

              {status === 'success' ? (
                <Alert severity="success" className="rounded-xl">
                  {t('contact.form.successMessage', 'Messaggio inviato! Ti risponderò il prima possibile.')}
                </Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5 sm:flex-row">
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
                    </div>
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <TextField fullWidth label="Telefono (opzionale)" value={form.phone} onChange={handleChange('phone')} />
                      <TextField
                        required
                        fullWidth
                        label="Oggetto"
                        placeholder="Es. Cena per 6 persone il 14 settembre"
                        value={form.subject}
                        onChange={handleChange('subject')}
                      />
                    </div>
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
                      className="self-start bg-gold-500 text-ink normal-case hover:bg-gold-600"
                    >
                      {status === 'submitting' ? (
                        <CircularProgress size={22} className="text-ink" />
                      ) : (
                        t('contact.form.submitButton', 'Invia messaggio')
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
