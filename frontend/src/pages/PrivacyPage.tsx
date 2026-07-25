import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Alert, Button, CircularProgress, Container, TextField } from '@mui/material'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import PageHero from '@/components/ui/PageHero'
import IubendaPrivacyLink from '@/components/ui/IubendaPrivacyLink'
import { publicRequestErasureOtp, publicConfirmErasureRequest } from '@/services/leadsApi'
import type { ErasureRequestFormValues } from '@/types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY_FORM: ErasureRequestFormValues = { firstName: '', lastName: '', email: '' }

type Step = 'form' | 'otp' | 'success'

// Varianti di animazione condivise dai due step del form: lo step
// "entrante" scivola da destra, quello "uscente" scivola verso sinistra.
const STEP_VARIANTS = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export default function PrivacyPage() {
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState<ErasureRequestFormValues>(EMPTY_FORM)
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const isFormValid = form.firstName.trim() !== '' && form.lastName.trim() !== '' && EMAIL_REGEX.test(form.email)

  const handleChange = (field: keyof ErasureRequestFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  // Step 1: invia nome, cognome ed email. Il backend genera un OTP e lo
  // manda via email; a quel punto passiamo allo step di verifica.
  const handleSubmitDetails = async (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!isFormValid) return

    setSubmitting(true)
    setError(null)
    try {
      await publicRequestErasureOtp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      })
      setStep('otp')
    } catch {
      setError('Non è stato possibile inviare la richiesta. Riprova più tardi.')
    } finally {
      setSubmitting(false)
    }
  }

  // Step 2: invia nome, cognome, email e il codice OTP ricevuto via email.
  // Il backend verifica il codice ed elabora la richiesta di cancellazione.
  const handleSubmitOtp = async (event: FormEvent) => {
    event.preventDefault()
    if (!otp.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      await publicConfirmErasureRequest({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        otp: otp.trim(),
      })
      setStep('success')
    } catch {
      setError('Codice non valido o scaduto. Controlla la tua email e riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy e diritto all'oblio"
        description="Come trattiamo i tuoi dati personali e come puoi richiederne in qualsiasi momento la cancellazione."
      />

      <div className="bg-ivory py-16 md:py-[88px]">
        <Container maxWidth="md">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
            {/* Informativa */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-ivory-deep p-8">
                <ShieldOutlinedIcon className="mb-3 text-3xl text-gold-600" />
                <p className="mb-2 font-display text-[1.3rem] font-semibold text-ink">Cos'è il diritto all'oblio</p>
                <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                  Il diritto all'oblio (o "diritto alla cancellazione", art. 17 del Regolamento UE 2016/679 - GDPR)
                  ti permette di chiedere che i tuoi dati personali vengano cancellati dai nostri archivi, ad
                  esempio quando non sono più necessari per le finalità per cui erano stati raccolti, hai revocato
                  il consenso al loro trattamento, o ritieni che siano stati trattati in modo non conforme alla
                  normativa.
                </p>
              </div>

              <div className="rounded-2xl bg-olive p-8 text-ivory">
                <p className="mb-2 font-display text-[1.3rem] font-semibold">Come funziona la richiesta</p>
                <ol className="list-decimal space-y-2 pl-5 text-[0.95rem] leading-relaxed text-ivory/80">
                  <li>Compila il form con nome, cognome ed email associati ai dati da cancellare.</li>
                  <li>Ti inviamo un codice di verifica (OTP) via email, per confermare che sei tu.</li>
                  <li>Inserisci il codice: la richiesta viene inoltrata e i tuoi dati vengono cancellati.</li>
                </ol>
              </div>

              <div className="rounded-2xl border border-ink/10 p-8">
                <p className="mb-3 font-display text-[1.1rem] font-semibold text-ink">Informative complete</p>
                <p className="mb-4 text-[0.9rem] leading-relaxed text-ink-soft">
                  Per i dettagli su titolare del trattamento, finalità, basi giuridiche, tempi di conservazione e
                  tutti gli altri tuoi diritti, consulta le informative complete:
                </p>
                <IubendaPrivacyLink linkClassName="text-gold-600 underline hover:text-gold-700" />
              </div>
            </div>

            {/* Form */}
            <div className="h-fit rounded-2xl bg-white p-8 shadow-sm">
              <p className="mb-1 font-display text-[1.3rem] font-semibold text-ink">Richiedi la cancellazione</p>
              <p className="mb-6 text-[0.9rem] text-ink-soft">
                {step === 'form' && "Inserisci i tuoi dati per avviare la richiesta di esercizio del diritto all'oblio."}
                {step === 'otp' && (
                  <>
                    Ti abbiamo inviato un codice a <span className="font-semibold text-ink">{form.email}</span>.
                    Inseriscilo qui sotto per confermare.
                  </>
                )}
                {step === 'success' && 'La tua richiesta è stata inviata correttamente.'}
              </p>

              <AnimatePresence mode="wait">
                {step === 'form' && (
                  <motion.div
                    key="form"
                    variants={STEP_VARIANTS}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <form onSubmit={handleSubmitDetails} noValidate>
                      <div className="flex flex-col gap-5">
                        <TextField
                          required
                          fullWidth
                          label="Nome"
                          value={form.firstName}
                          onChange={handleChange('firstName')}
                          error={touched && form.firstName.trim() === ''}
                        />
                        <TextField
                          required
                          fullWidth
                          label="Cognome"
                          value={form.lastName}
                          onChange={handleChange('lastName')}
                          error={touched && form.lastName.trim() === ''}
                        />
                        <TextField
                          required
                          fullWidth
                          type="email"
                          label="Email"
                          value={form.email}
                          onChange={handleChange('email')}
                          error={touched && !EMAIL_REGEX.test(form.email)}
                          helperText={
                            touched && !EMAIL_REGEX.test(form.email) ? 'Inserisci un indirizzo email valido.' : ' '
                          }
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={submitting}
                          className="bg-gold-500 text-ink normal-case hover:bg-gold-600"
                        >
                          {submitting ? <CircularProgress size={22} className="text-ink" /> : 'Invia richiesta'}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    variants={STEP_VARIANTS}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-4 flex items-center gap-2 text-gold-600">
                      <MarkEmailReadOutlinedIcon />
                      <span className="text-[0.85rem] font-semibold uppercase tracking-[0.08em]">
                        Verifica la tua email
                      </span>
                    </div>
                    <form onSubmit={handleSubmitOtp} noValidate>
                      <div className="flex flex-col gap-5">
                        <TextField
                          required
                          fullWidth
                          autoFocus
                          label="Codice OTP"
                          placeholder="Es. 123456"
                          value={otp}
                          onChange={(event) => setOtp(event.target.value)}
                          inputProps={{ inputMode: 'numeric' }}
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={submitting || !otp.trim()}
                          className="bg-gold-500 text-ink normal-case hover:bg-gold-600"
                        >
                          {submitting ? <CircularProgress size={22} className="text-ink" /> : 'Conferma richiesta'}
                        </Button>
                        <Button
                          type="button"
                          variant="text"
                          disabled={submitting}
                          onClick={() => {
                            setStep('form')
                            setOtp('')
                            setError(null)
                          }}
                          className="normal-case text-ink-soft"
                        >
                          Ho sbagliato qualcosa, torna indietro
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    variants={STEP_VARIANTS}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center gap-3 py-4 text-center"
                  >
                    <TaskAltIcon className="text-5xl text-gold-600" />
                    <p className="font-display text-[1.15rem] font-semibold text-ink">Richiesta inviata</p>
                    <p className="text-[0.9rem] leading-relaxed text-ink-soft">
                      Abbiamo ricevuto la tua richiesta di esercizio del diritto all'oblio. Provvederemo alla
                      cancellazione dei tuoi dati ed eventualmente ti ricontatteremo se avessimo bisogno di
                      ulteriori verifiche.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
