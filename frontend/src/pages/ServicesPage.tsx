import { Box, Button, Container, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import HomeIcon from '@mui/icons-material/Home'
import CelebrationIcon from '@mui/icons-material/Celebration'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import PageHero from '@/components/ui/PageHero'
import { useSiteContent } from '@/hooks/useSiteContent'

// Stessa mappa icone usata in ServicesSection.tsx (home), per coerenza visiva
// tra l'anteprima in homepage e la pagina dedicata.
const ICONS: Record<string, typeof HomeIcon> = {
  home: HomeIcon,
  event: CelebrationIcon,
  business: TrendingUpIcon,
}

export default function ServicesPage() {
  const { services, contact } = useSiteContent()

  return (
    <>
      <PageHero
        eyebrow="Servizi"
        title="Tre modi per portare la mia cucina da te"
        description="Dalla cena tra amici al lancio della tua attività: ogni servizio è pensato su misura, partendo da quello che ti serve davvero."
      />

      <Box sx={{ backgroundColor: '#FBF6EC', py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {services.map((service) => {
              const Icon = ICONS[service.icon] ?? RestaurantIcon
              return (
                <Box
                  key={service.id}
                  sx={{
                    backgroundColor: '#F3E9D6',
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
                  {service.imageUrl ? (
                    <Box
                      component="img"
                      src={service.imageUrl}
                      alt={service.title}
                      sx={{ width: '100%', height: 160, borderRadius: 2, objectFit: 'cover', mb: 2.5 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(184,137,62,0.16)',
                        color: '#8A6428',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                      }}
                    >
                      <Icon />
                    </Box>
                  )}
                  <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.3rem', fontWeight: 600, mb: 0.5 }}>
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

      <Box sx={{ backgroundColor: '#F3E9D6', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: 1.5 }}>
            Non sai quale servizio fa per te?
          </Typography>
          <Typography sx={{ color: '#332A21', mb: 3 }}>
            Scrivimi su WhatsApp raccontandomi cosa hai in mente: ti aiuto a capire la formula più adatta.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            sx={{ backgroundColor: '#3A4430', color: '#FBF6EC', '&:hover': { backgroundColor: '#2C3424' } }}
          >
            Scrivimi su WhatsApp
          </Button>
        </Container>
      </Box>
    </>
  )
}
