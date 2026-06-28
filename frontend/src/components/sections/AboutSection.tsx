import { Box, Button, Container, Stack, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AboutSection() {
  const { brand, settings } = useSiteContent()

  const aboutIntro =
    settings?.aboutIntro ||
    "Cresciuto tra i fornelli di casa e le cucine professionali di Napoli, porto la tradizione partenopea dove serve davvero: sulla tua tavola. Ogni servizio nasce da un'idea semplice — la cucina di qualità non ha bisogno di un ristorante, ha bisogno di cura."

  const stats = [
    { value: settings?.statYearsValue || '8+', label: settings?.statYearsLabel || 'anni di esperienza' },
    { value: settings?.statEventsValue || '150+', label: settings?.statEventsLabel || 'eventi curati' },
    { value: settings?.statIngredientsValue || '100%', label: settings?.statIngredientsLabel || 'materie prime locali' },
  ]

  return (
    <Box id="chi-siamo" sx={{ backgroundColor: '#FBF6EC', py: { xs: 9, md: 13 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: '#1C1712',
              display: 'flex',
              alignItems: 'flex-end',
              p: 4,
            }}
          >
            {settings?.aboutImageUrl ? (
              <Box
                component="img"
                src={settings.aboutImageUrl}
                alt={brand.name}
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 30% 20%, rgba(184,137,62,0.35), transparent 60%), linear-gradient(160deg, #2E2519, #1C1712)',
                }}
              />
            )}
            <Typography sx={{ position: 'relative', color: '#D9B679', fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontStyle: 'italic' }}>
              "Ogni piatto racconta una storia di famiglia."
            </Typography>
          </Box>

          <Box>
            <SectionHeading
              align="left"
              eyebrow="Chi siamo"
              title={`La cucina di ${brand.name}`}
              description={aboutIntro}
            />
            <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat) => (
                <Box key={stat.label}>
                  <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.8rem', color: '#8A6428', fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#332A21', maxWidth: 110 }}>{stat.label}</Typography>
                </Box>
              ))}
            </Stack>
            <Button
              component={RouterLink}
              to="/chi-siamo"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: '#8A6428', fontWeight: 600, px: 0, '&:hover': { backgroundColor: 'transparent', color: '#1C1712' } }}
            >
              Scopri la mia storia
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
