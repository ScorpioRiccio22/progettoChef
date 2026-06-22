import { Box, Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import VesuvioMark from '@/components/ui/VesuvioMark'

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1C1712',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 10 }}>
        <Box sx={{ color: '#D9B679', mb: 3, display: 'flex', justifyContent: 'center' }}>
          <VesuvioMark className="w-24 h-12" color="currentColor" />
        </Box>
        <Typography variant="h1" sx={{ color: '#FBF6EC', fontSize: '2.4rem', mb: 1.5 }}>
          Pagina non trovata
        </Typography>
        <Typography sx={{ color: 'rgba(251,246,236,0.7)', mb: 4 }}>
          Questa pagina non esiste, o è stata spostata. Torna alla home per continuare a curiosare.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
        >
          Torna alla home
        </Button>
      </Container>
    </Box>
  )
}
