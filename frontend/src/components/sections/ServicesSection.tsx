import { Box, Container, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import CelebrationIcon from '@mui/icons-material/Celebration'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SectionHeading from '@/components/ui/SectionHeading'
import { SERVICES } from '@/lib/content'

const ICONS = {
  home: HomeIcon,
  event: CelebrationIcon,
  business: TrendingUpIcon,
}

export default function ServicesSection() {
  return (
    <Box id="servizi" sx={{ backgroundColor: '#F3E9D6', py: { xs: 9, md: 13 } }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Cosa offro"
          title="Tre modi per portare la mia cucina da te"
          description="Dalla cena tra amici al lancio della tua attività: ogni servizio è pensato su misura, partendo da quello che ti serve davvero."
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon]
            return (
              <Box
                key={service.id}
                sx={{
                  backgroundColor: '#FBF6EC',
                  borderRadius: 3,
                  p: 4,
                  border: '1px solid rgba(28,23,18,0.06)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 32px rgba(28,23,18,0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(184,137,62,0.14)',
                    color: '#8A6428',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Icon />
                </Box>
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.35rem', fontWeight: 600, mb: 0.5 }}>
                  {service.title}
                </Typography>
                <Typography sx={{ color: '#8A6428', fontSize: '0.88rem', fontWeight: 600, mb: 1.5 }}>
                  {service.tagline}
                </Typography>
                <Typography sx={{ color: '#332A21', lineHeight: 1.7 }}>{service.description}</Typography>
              </Box>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}
