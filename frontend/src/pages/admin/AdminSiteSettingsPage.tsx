import { useEffect, useState } from 'react'
import { Alert, Button, CircularProgress, Divider, Snackbar, TextField } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { adminGetSiteSettings, adminUpdateSiteSettings } from '@/services/contentApi'
import ImageUploadField from '@/components/admin/ImageUploadField'
import type { SiteSettings } from '@/types'

const EMPTY: SiteSettings = {
  brandName: '',
  brandHandle: '',
  brandRole: '',
  brandCity: '',
  brandPayoff: '',
  logoUrl: null,
  faviconUrl: null,
  contactEmail: '',
  whatsappNumber: '',
  whatsappLink: '',
  contactArea: '',
  mapAddress: '',
  instagramUrl: '',
  facebookUrl: '',
  tiktokUrl: '',
  threadsUrl: '',
  heroTitle: '',
  heroSubtitle: '',
  heroImageUrl: null,
  aboutIntro: '',
  aboutParagraph1: '',
  aboutParagraph2: '',
  aboutImageUrl: null,
  statYearsValue: '',
  statYearsLabel: '',
  statEventsValue: '',
  statEventsLabel: '',
  statIngredientsValue: '',
  statIngredientsLabel: '',
}

// Card di sezione: bordo, angoli arrotondati e padding coerenti in tutta la pagina.
const SECTION_CLASS = 'rounded-2xl border border-black/10 p-6'
const GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

export default function AdminSiteSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedOpen, setSavedOpen] = useState(false)

  useEffect(() => {
    adminGetSiteSettings()
      .then(setForm)
      .catch(() => setError('Impossibile caricare le impostazioni del sito'))
      .finally(() => setLoading(false))
  }, [])

  const field =
    (key: keyof SiteSettings) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const handleImage = (key: keyof SiteSettings) => (url: string | null) =>
    setForm((prev) => ({ ...prev, [key]: url }))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const updated = await adminUpdateSiteSettings(form)
      setForm(updated)
      setSavedOpen(true)
    } catch {
      setError('Salvataggio non riuscito. Controlla i dati e riprova.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-xl font-semibold">Impostazioni del sito</h1>
      <p className="mb-6 text-clay">Brand, contatti, social e testi che compaiono in più punti del sito pubblico.</p>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="flex flex-col gap-6">
        <div className={SECTION_CLASS}>
          <p className="mb-4 font-bold">Brand</p>
          <div className={GRID_CLASS}>
            <TextField label="Nome" fullWidth value={form.brandName} onChange={field('brandName')} />
            <TextField label="Handle social (es. @chefandreamoio)" fullWidth value={form.brandHandle} onChange={field('brandHandle')} />
            <TextField label="Ruolo (es. Chef)" fullWidth value={form.brandRole} onChange={field('brandRole')} />
            <TextField label="Città" fullWidth value={form.brandCity} onChange={field('brandCity')} />
            <TextField
              label="Payoff / slogan"
              fullWidth
              value={form.brandPayoff}
              onChange={field('brandPayoff')}
              className="md:col-span-2"
            />
            <ImageUploadField label="Logo" value={form.logoUrl} onChange={handleImage('logoUrl')} />
            <ImageUploadField label="Favicon" value={form.faviconUrl} onChange={handleImage('faviconUrl')} />
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <p className="mb-4 font-bold">Contatti</p>
          <div className={GRID_CLASS}>
            <TextField label="Email" fullWidth value={form.contactEmail} onChange={field('contactEmail')} />
            <TextField label="Numero WhatsApp (visualizzato)" fullWidth value={form.whatsappNumber} onChange={field('whatsappNumber')} />
            <TextField label="Link WhatsApp (wa.me/...)" fullWidth value={form.whatsappLink} onChange={field('whatsappLink')} />
            <TextField label="Area servita (es. Napoli e provincia)" fullWidth value={form.contactArea} onChange={field('contactArea')} />
            <TextField
              label="Indirizzo fisico (per la mini mappa nella pagina Contatti)"
              fullWidth
              placeholder="Es. Via Toledo 1, 80134 Napoli NA"
              value={form.mapAddress}
              onChange={field('mapAddress')}
              helperText="Indirizzo completo (via, civico, CAP, città): viene geolocalizzato automaticamente per mostrare la mappa. Lascia vuoto per non mostrare nessuna mappa."
              className="md:col-span-2"
            />
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <p className="mb-4 font-bold">Social</p>
          <div className={GRID_CLASS}>
            <TextField label="Instagram" fullWidth value={form.instagramUrl} onChange={field('instagramUrl')} />
            <TextField label="Facebook" fullWidth value={form.facebookUrl} onChange={field('facebookUrl')} />
            <TextField label="TikTok" fullWidth value={form.tiktokUrl} onChange={field('tiktokUrl')} />
            <TextField label="Threads" fullWidth value={form.threadsUrl} onChange={field('threadsUrl')} />
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <p className="mb-4 font-bold">Sezione Hero (home page)</p>
          <div className={GRID_CLASS}>
            <TextField label="Titolo" fullWidth value={form.heroTitle} onChange={field('heroTitle')} className="md:col-span-2" />
            <TextField
              label="Sottotitolo"
              fullWidth
              multiline
              minRows={2}
              value={form.heroSubtitle}
              onChange={field('heroSubtitle')}
              className="md:col-span-2"
            />
            <ImageUploadField label="Immagine hero" value={form.heroImageUrl} onChange={handleImage('heroImageUrl')} />
          </div>
        </div>

        <div className={SECTION_CLASS}>
          <p className="mb-4 font-bold">Sezione "La mia storia" (testi e statistiche)</p>
          <div className={GRID_CLASS}>
            <TextField
              label="Intro"
              fullWidth
              multiline
              minRows={2}
              value={form.aboutIntro}
              onChange={field('aboutIntro')}
              className="md:col-span-2"
            />
            <TextField
              label="Paragrafo 1"
              fullWidth
              multiline
              minRows={2}
              value={form.aboutParagraph1}
              onChange={field('aboutParagraph1')}
              className="md:col-span-2"
            />
            <TextField
              label="Paragrafo 2"
              fullWidth
              multiline
              minRows={2}
              value={form.aboutParagraph2}
              onChange={field('aboutParagraph2')}
              className="md:col-span-2"
            />
            <ImageUploadField label="Immagine la-mia-storia" value={form.aboutImageUrl} onChange={handleImage('aboutImageUrl')} />

            <div className="md:col-span-2">
              <Divider className="my-2" />
              <p className="mb-2 text-[0.9rem] font-semibold">Statistiche (3 numeri mostrati a corredo)</p>
            </div>
            <div className="flex flex-col gap-3">
              <TextField label="Valore 1 (es. 8+)" fullWidth value={form.statYearsValue} onChange={field('statYearsValue')} />
              <TextField label="Etichetta 1" fullWidth value={form.statYearsLabel} onChange={field('statYearsLabel')} />
            </div>
            <div className="flex flex-col gap-3">
              <TextField label="Valore 2 (es. 150+)" fullWidth value={form.statEventsValue} onChange={field('statEventsValue')} />
              <TextField label="Etichetta 2" fullWidth value={form.statEventsLabel} onChange={field('statEventsLabel')} />
            </div>
            <div className="flex flex-col gap-3">
              <TextField label="Valore 3 (es. 100%)" fullWidth value={form.statIngredientsValue} onChange={field('statIngredientsValue')} />
              <TextField label="Etichetta 3" fullWidth value={form.statIngredientsLabel} onChange={field('statIngredientsLabel')} />
            </div>
          </div>
        </div>

        <div className={`${SECTION_CLASS} bg-ivory`}>
          <p className="mb-2 font-bold">Recensioni Google</p>
          <p className="text-[0.92rem] leading-relaxed text-clay">
            La homepage mostra automaticamente le recensioni Google reali del locale al posto delle testimonianze
            manuali, quando l'integrazione è configurata. Per attivarla il tuo sviluppatore deve impostare, solo
            lato server (mai in questo pannello, per sicurezza), le variabili d'ambiente{' '}
            <code>GOOGLE_PLACES_API_KEY</code> (la chiave API di Google Cloud) e{' '}
            <code>GOOGLE_PLACES_PLACE_ID</code> (l'identificativo della tua scheda Google). Finché non sono
            impostate, il sito continua a mostrare le testimonianze inserite manualmente qui sopra.
          </p>
        </div>

        <div>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            {saving ? 'Salvataggio…' : 'Salva modifiche'}
          </Button>
        </div>
      </div>

      <Snackbar
        open={savedOpen}
        autoHideDuration={3000}
        onClose={() => setSavedOpen(false)}
        message="Impostazioni salvate"
      />
    </div>
  )
}
