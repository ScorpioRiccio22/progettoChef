import { useState, type FormEvent } from 'react'
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { subscribeToNewsletter, resetNewsletterStatus } from '@/store/slices/newsletterSlice'
import VesuvioMark from '@/components/ui/VesuvioMark'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.newsletter)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    dispatch(resetNewsletterStatus())
    dispatch(subscribeToNewsletter(email))
  }

  return (
    <Box id="newsletter" sx={{ backgroundColor: '#1C1712', py: { xs: 9, md: 11 }, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: -40, right: -20, color: 'rgba(184,137,62,0.15)', width: 260 }}>
        <VesuvioMark className="w-full" color="currentColor" />
      </Box>
      <Container maxWidth="sm" sx={{ position: 'relative', textAlign: 'center' }}>
        <Box sx={{ color: '#D9B679', mb: 2 }}>
          <MailOutlineIcon fontSize="large" />
        </Box>
        <Typography variant="h2" sx={{ color: '#FBF6EC', fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1.5 }}>
          Ricette, eventi e novità via email
        </Typography>
        <Typography sx={{ color: 'rgba(251,246,236,0.7)', mb: 4 }}>
          Una mail ogni tanto, niente spam: nuove ricette del ricettario, disponibilità per gli eventi e qualche
          consiglio di cucina napoletana.
        </Typography>

        {status === 'success' ? (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            Iscrizione completata! Controlla la tua casella email a breve.
          </Alert>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}
          >
            <TextField
              required
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              size="medium"
              aria-label="Indirizzo email per la newsletter"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FBF6EC',
                  borderRadius: 999,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={status === 'submitting'}
              sx={{
                backgroundColor: '#B8893E',
                color: '#1C1712',
                px: 4,
                whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: '#D9B679' },
              }}
            >
              {status === 'submitting' ? <CircularProgress size={20} sx={{ color: '#1C1712' }} /> : 'Iscrivimi'}
            </Button>
          </Box>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Typography sx={{ mt: 2.5, fontSize: '0.78rem', color: 'rgba(251,246,236,0.45)' }}>
          Iscrivendoti accetti di ricevere comunicazioni periodiche. Puoi annullare l'iscrizione in qualsiasi momento.
        </Typography>
      </Container>
    </Box>
  )
}
