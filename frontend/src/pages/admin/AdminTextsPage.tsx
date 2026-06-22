import { Box, Stack, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { updateTexts } from '@/store/slices/contentSlice'
import SaveBar from '@/components/admin/SaveBar'

export default function AdminTextsPage() {
  const dispatch = useAppDispatch()
  const texts = useAppSelector((state) => state.content.texts)

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, mb: 0.5 }}>
        Testi del sito
      </Typography>
      <Typography sx={{ color: '#332A21', mb: 4, fontSize: '0.9rem' }}>
        Modifica i testi della Home — sezione Hero e Chi siamo. Le modifiche si vedono subito sul sito pubblico.
      </Typography>

      <Stack spacing={4}>
        <Stack spacing={2}>
          <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sezione Hero
          </Typography>
          <TextField
            label="Eyebrow (es. 'Chef a Napoli')"
            value={texts.heroEyebrow}
            onChange={(event) => dispatch(updateTexts({ heroEyebrow: event.target.value }))}
            fullWidth
          />
          <TextField
            label="Titolo principale"
            value={texts.heroTitle}
            onChange={(event) => dispatch(updateTexts({ heroTitle: event.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Descrizione"
            value={texts.heroDescription}
            onChange={(event) => dispatch(updateTexts({ heroDescription: event.target.value }))}
            fullWidth
            multiline
            minRows={3}
          />
        </Stack>

        <Stack spacing={2}>
          <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sezione Chi siamo
          </Typography>
          <TextField
            label="Titolo"
            value={texts.aboutTitle}
            onChange={(event) => dispatch(updateTexts({ aboutTitle: event.target.value }))}
            fullWidth
          />
          <TextField
            label="Descrizione"
            value={texts.aboutDescription}
            onChange={(event) => dispatch(updateTexts({ aboutDescription: event.target.value }))}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Citazione in evidenza"
            value={texts.aboutQuote}
            onChange={(event) => dispatch(updateTexts({ aboutQuote: event.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </Stack>

      <SaveBar />
    </Box>
  )
}
