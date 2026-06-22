import { Box, Button, Container, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CelebrationIcon from '@mui/icons-material/Celebration'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SchoolIcon from '@mui/icons-material/School'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import { EVENTS } from '@/lib/content'

const ICONS = {
  private: CelebrationIcon,
  corporate: BusinessCenterIcon,
  catering: RestaurantIcon,
  'cooking-class': SchoolIcon,
}

export default function EventsPreviewSection() {
  return (
    <Box id="eventi" sx={{ backgroundColor: '#1C1712', py: { xs: 9, md: 13 } }}>
      <Container maxWidth="lg">
        <SectionHeading
          light
          eyebrow="Eventi"
          title="Un servizio per ogni occasione"
          description="Dalla cena intima al matrimonio con cento invitati: definiamo insieme menu, formula di servizio e tempistiche."
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 5,
          }}
        >
          {EVENTS.map((event) => {
            const Icon = ICONS[event.icon]
            return (
              <Box
                key={event.id}
                sx={{
                  border: '1px solid rgba(251,246,236,0.12)',
                  borderRadius: 3,
                  p: 3,
                  '&:hover': { borderColor: 'rgba(184,137,62,0.5)', backgroundColor: 'rgba(184,137,62,0.06)' },
                  transition: 'all 0.25s ease',
                }}
              >
                <Box sx={{ color: '#D9B679', mb: 2 }}>
                  <Icon />
                </Box>
                <Typography sx={{ color: '#FBF6EC', fontFamily: '"Fraunces", serif', fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
                  {event.title}
                </Typography>
                <Typography sx={{ color: 'rgba(251,246,236,0.65)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {event.description}
                </Typography>
              </Box>
            )
          })}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/eventi"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            Scopri tutti gli eventi
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
