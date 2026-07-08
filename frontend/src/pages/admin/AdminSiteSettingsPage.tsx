import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, mb: 0.5 }}>
        Impostazioni del sito
      </Typography>
      <Typography sx={{ color: '#5C5246', mb: 3 }}>
        Brand, contatti, social e testi che compaiono in più punti del sito pubblico.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Brand</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Nome" fullWidth value={form.brandName} onChange={field('brandName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Handle social (es. @chefandreamoio)" fullWidth value={form.brandHandle} onChange={field('brandHandle')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Ruolo (es. Chef)" fullWidth value={form.brandRole} onChange={field('brandRole')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Città" fullWidth value={form.brandCity} onChange={field('brandCity')} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Payoff / slogan" fullWidth value={form.brandPayoff} onChange={field('brandPayoff')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUploadField label="Logo" value={form.logoUrl} onChange={handleImage('logoUrl')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUploadField label="Favicon" value={form.faviconUrl} onChange={handleImage('faviconUrl')} />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Contatti</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Email" fullWidth value={form.contactEmail} onChange={field('contactEmail')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Numero WhatsApp (visualizzato)" fullWidth value={form.whatsappNumber} onChange={field('whatsappNumber')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Link WhatsApp (wa.me/...)" fullWidth value={form.whatsappLink} onChange={field('whatsappLink')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Area servita (es. Napoli e provincia)" fullWidth value={form.contactArea} onChange={field('contactArea')} />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Social</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Instagram" fullWidth value={form.instagramUrl} onChange={field('instagramUrl')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Facebook" fullWidth value={form.facebookUrl} onChange={field('facebookUrl')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="TikTok" fullWidth value={form.tiktokUrl} onChange={field('tiktokUrl')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Threads" fullWidth value={form.threadsUrl} onChange={field('threadsUrl')} />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Sezione Hero (home page)</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Titolo" fullWidth value={form.heroTitle} onChange={field('heroTitle')} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Sottotitolo"
                fullWidth
                multiline
                minRows={2}
                value={form.heroSubtitle}
                onChange={field('heroSubtitle')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUploadField label="Immagine hero" value={form.heroImageUrl} onChange={handleImage('heroImageUrl')} />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Sezione "La mia storia" (testi e statistiche)</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Intro" fullWidth multiline minRows={2} value={form.aboutIntro} onChange={field('aboutIntro')} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Paragrafo 1"
                fullWidth
                multiline
                minRows={2}
                value={form.aboutParagraph1}
                onChange={field('aboutParagraph1')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Paragrafo 2"
                fullWidth
                multiline
                minRows={2}
                value={form.aboutParagraph2}
                onChange={field('aboutParagraph2')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUploadField label="Immagine chi-siamo" value={form.aboutImageUrl} onChange={handleImage('aboutImageUrl')} />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Statistiche (3 numeri mostrati a corredo)</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1.5}>
                <TextField label="Valore 1 (es. 8+)" fullWidth value={form.statYearsValue} onChange={field('statYearsValue')} />
                <TextField label="Etichetta 1" fullWidth value={form.statYearsLabel} onChange={field('statYearsLabel')} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1.5}>
                <TextField label="Valore 2 (es. 150+)" fullWidth value={form.statEventsValue} onChange={field('statEventsValue')} />
                <TextField label="Etichetta 2" fullWidth value={form.statEventsLabel} onChange={field('statEventsLabel')} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={1.5}>
                <TextField label="Valore 3 (es. 100%)" fullWidth value={form.statIngredientsValue} onChange={field('statIngredientsValue')} />
                <TextField label="Etichetta 3" fullWidth value={form.statIngredientsLabel} onChange={field('statIngredientsLabel')} />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: '#FBF6EC' }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Recensioni Google</Typography>
          <Typography sx={{ color: '#5C5246', fontSize: '0.92rem', lineHeight: 1.7 }}>
            La homepage mostra automaticamente le recensioni Google reali del locale al posto delle testimonianze
            manuali, quando l'integrazione è configurata. Per attivarla il tuo sviluppatore deve impostare, solo
            lato server (mai in questo pannello, per sicurezza), le variabili d'ambiente{' '}
            <code>GOOGLE_PLACES_API_KEY</code> (la chiave API di Google Cloud) e{' '}
            <code>GOOGLE_PLACES_PLACE_ID</code> (l'identificativo della tua scheda Google). Finché non sono
            impostate, il sito continua a mostrare le testimonianze inserite manualmente qui sopra.
          </Typography>
        </Paper>

        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            {saving ? 'Salvataggio…' : 'Salva modifiche'}
          </Button>
        </Box>
      </Stack>

      <Snackbar
        open={savedOpen}
        autoHideDuration={3000}
        onClose={() => setSavedOpen(false)}
        message="Impostazioni salvate"
      />
    </Box>
  )
}
