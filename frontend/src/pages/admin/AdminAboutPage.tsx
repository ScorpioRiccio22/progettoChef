import { Box, Divider, Stack, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { updateTexts, updateAboutStat, updateImages } from '@/store/slices/contentSlice'
import SaveBar from '@/components/admin/SaveBar'
import ImageUploadField from '@/components/admin/ImageUploadField'

export default function AdminAboutPage() {
  const dispatch = useAppDispatch()
  const texts = useAppSelector((state) => state.content.texts)
  const about = useAppSelector((state) => state.content.about)
  const images = useAppSelector((state) => state.content.images)

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, mb: 0.5 }}>
        Chi siamo & Immagini
      </Typography>
      <Typography sx={{ color: '#332A21', mb: 4, fontSize: '0.9rem' }}>
        Gestisci i testi della sezione Chi siamo, le statistiche in evidenza e le immagini del sito (logo, banner hero, foto profilo).
      </Typography>

      {/* ── Immagini ── */}
      <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 2 }}>
        Immagini del sito
      </Typography>
      <Stack spacing={3} sx={{ mb: 5 }}>
        <ImageUploadField
          label="Logo (navbar e footer) — consigliato: quadrato, sfondo trasparente"
          value={images.logo}
          onChange={(url) => dispatch(updateImages({ logo: url }))}
        />
        <ImageUploadField
          label="Banner Hero (sfondo sezione principale)"
          value={images.heroBanner}
          onChange={(url) => dispatch(updateImages({ heroBanner: url }))}
        />
        <ImageUploadField
          label="Foto Chef (sezione Chi siamo)"
          value={images.aboutPhoto}
          onChange={(url) => dispatch(updateImages({ aboutPhoto: url }))}
        />
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* ── Testi Chi siamo ── */}
      <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 2 }}>
        Testi sezione Chi siamo
      </Typography>
      <Stack spacing={2.5} sx={{ mb: 5 }}>
        <TextField
          label="Titolo"
          value={texts.aboutTitle}
          onChange={(e) => dispatch(updateTexts({ aboutTitle: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Descrizione"
          value={texts.aboutDescription}
          onChange={(e) => dispatch(updateTexts({ aboutDescription: e.target.value }))}
          fullWidth
          multiline
          minRows={4}
        />
        <TextField
          label="Citazione in evidenza (mostrata sull'immagine)"
          value={texts.aboutQuote}
          onChange={(e) => dispatch(updateTexts({ aboutQuote: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* ── Statistiche ── */}
      <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 2 }}>
        Statistiche in evidenza
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {about.stats.map((stat) => (
          <Stack key={stat.id} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              size="small"
              label="Valore (es. 8+)"
              value={stat.value}
              onChange={(e) => dispatch(updateAboutStat({ ...stat, value: e.target.value }))}
              sx={{ width: 140 }}
            />
            <TextField
              size="small"
              label="Etichetta"
              value={stat.label}
              onChange={(e) => dispatch(updateAboutStat({ ...stat, label: e.target.value }))}
              fullWidth
            />
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* ── Testi Hero ── */}
      <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 2 }}>
        Testi sezione Hero
      </Typography>
      <Stack spacing={2.5}>
        <TextField
          label="Eyebrow (es. 'Chef a Napoli')"
          value={texts.heroEyebrow}
          onChange={(e) => dispatch(updateTexts({ heroEyebrow: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Titolo principale"
          value={texts.heroTitle}
          onChange={(e) => dispatch(updateTexts({ heroTitle: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Descrizione"
          value={texts.heroDescription}
          onChange={(e) => dispatch(updateTexts({ heroDescription: e.target.value }))}
          fullWidth
          multiline
          minRows={3}
        />
      </Stack>

      <SaveBar />
    </Box>
  )
}
