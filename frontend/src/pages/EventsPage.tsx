import { Box, Button, Container, Stack, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CelebrationIcon from '@mui/icons-material/Celebration'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SchoolIcon from '@mui/icons-material/School'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'

const ICONS: Record<string, typeof CelebrationIcon> = {
  private: CelebrationIcon,
  corporate: BusinessCenterIcon,
  catering: RestaurantIcon,
  'cooking-class': SchoolIcon,
}

const PROCESS = [
  { step: '1', title: 'Raccontami l\'evento', text: 'Data, numero di invitati, location e budget di riferimento.' },
  { step: '2', title: 'Costruiamo il menu', text: 'Proposta su misura, con eventuale degustazione preliminare.' },
  { step: '3', title: 'Organizziamo il servizio', text: 'Definiamo tempistiche, allestimento e personale di sala se necessario.' },
  { step: '4', title: 'Il giorno dell\'evento', text: 'Arrivo con tutto il necessario: tu pensi solo a goderti la serata.' },
]

export default function EventsPage() {
  const { eventTypes, contact } = useSiteContent()

  return (
    <>
      <PageHero
        eyebrow="Eventi"
        title="Un servizio per ogni occasione"
        description="Dalla cena per due persone al matrimonio con cento invitati: ogni evento ha una formula di servizio dedicata."
      />

      <Box sx={{ backgroundColor: '#FBF6EC', py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {eventTypes.map((event) => {
              const Icon = ICONS[event.icon] ?? CelebrationIcon
              return (
                <Box
                  key={event.id}
                  sx={{
                    backgroundColor: '#F3E9D6',
                    borderRadius: 3,
                    p: 4,
                    border: '1px solid rgba(28,23,18,0.06)',
                  }}
                >
                  {event.imageUrl ? (
                    <Box
                      component="img"
                      src={event.imageUrl}
                      alt={event.title}
                      sx={{ width: '100%', height: 160, borderRadius: 2, objectFit: 'cover', mb: 2.5 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
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
                  <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.3rem', fontWeight: 600, mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography sx={{ color: '#332A21', mb: 2.5, lineHeight: 1.7 }}>{event.description}</Typography>
                  <Stack spacing={1}>
                    {event.details.map((detail) => (
                      <Stack key={detail} direction="row" spacing={1} alignItems="flex-start">
                        <CheckCircleOutlineIcon sx={{ color: '#8A6428', fontSize: '1.1rem', mt: 0.2 }} />
                        <Typography sx={{ fontSize: '0.92rem', color: '#332A21' }}>{detail}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )
            })}
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: '#1C1712', py: { xs: 8, md: 11 } }}>
        <Container maxWidth="lg">
          <SectionHeading light eyebrow="Come funziona" title="Dal primo messaggio al giorno dell'evento" />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {PROCESS.map((item) => (
              <Box key={item.step}>
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '2.2rem', color: '#D9B679', fontWeight: 600, mb: 1 }}>
                  {item.step}
                </Typography>
                <Typography sx={{ color: '#FBF6EC', fontWeight: 600, mb: 0.8 }}>{item.title}</Typography>
                <Typography sx={{ color: 'rgba(251,246,236,0.65)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: '#F3E9D6', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: 1.5 }}>
            Hai già una data in mente?
          </Typography>
          <Typography sx={{ color: '#332A21', mb: 3 }}>
            Scrivimi su WhatsApp con i dettagli del tuo evento: ti rispondo con disponibilità e prima proposta di menu.
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
