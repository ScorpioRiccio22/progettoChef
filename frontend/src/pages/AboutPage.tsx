import { Box, Container, Stack, Typography } from '@mui/material'
import PageHero from '@/components/ui/PageHero'
import NewsletterSection from '@/components/sections/NewsletterSection'
import { BRAND } from '@/lib/content'

const MILESTONES = [
  { year: '2016', text: 'Primi passi in cucina nei ristoranti storici del centro di Napoli.' },
  { year: '2019', text: 'Specializzazione in cucina tradizionale e nei grandi classici partenopei.' },
  { year: '2022', text: 'Avvio dell\'attività di chef a domicilio ed eventi privati.' },
  { year: 'Oggi', text: 'Consulenza per nuove attività di ristorazione, oltre a cene ed eventi su misura.' },
]

const VALUES = [
  { title: 'Materie prime locali', text: 'Pescato e prodotti dell\'orto scelti ogni settimana dai produttori della zona.' },
  { title: 'Tradizione, non nostalgia', text: 'Le ricette di famiglia restano il punto di partenza, non il limite.' },
  { title: 'Cura del servizio', text: 'Dalla mise en place al saluto finale, il dettaglio fa la differenza.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        title={`La storia di ${BRAND.name}`}
        description="Una cucina che nasce in famiglia e cresce tra le cucine professionali di Napoli, fino a diventare un servizio su misura per chi vuole offrire un'esperienza autentica."
      />

      <Box sx={{ backgroundColor: '#FBF6EC', py: { xs: 8, md: 11 } }}>
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ mb: 8 }}>
            <Typography sx={{ color: '#332A21', fontSize: '1.1rem', lineHeight: 1.85 }}>
              Sono Andrea, e cucino da quando ero un bambino seduto al bancone di cucina di mia nonna, a guardare
              come si prepara una vera genovese. Quella tavola è il punto da cui parte ancora oggi ogni mio menu:
              ingredienti semplici, tempi lunghi e rispetto per la materia prima.
            </Typography>
            <Typography sx={{ color: '#332A21', fontSize: '1.1rem', lineHeight: 1.85 }}>
              Dopo anni nelle cucine di alcuni ristoranti storici di Napoli, ho deciso di portare quella stessa
              cura fuori dalle quattro mura di un locale: a casa tua, nel tuo ufficio, nella location del tuo
              evento. Oggi affianco famiglie per cene speciali, aziende per i loro eventi e nuove attività che
              vogliono partire con un'identità di cucina chiara.
            </Typography>
          </Stack>

          <Typography
            sx={{ fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.78rem', color: '#8A6428', mb: 3 }}
          >
            Il percorso
          </Typography>
          <Stack spacing={0} sx={{ mb: 8, borderLeft: '2px solid #E6C588', pl: 4 }}>
            {MILESTONES.map((milestone) => (
              <Box key={milestone.year} sx={{ position: 'relative', pb: 4 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -45,
                    top: 2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#B8893E',
                  }}
                />
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, color: '#1C1712', mb: 0.5 }}>
                  {milestone.year}
                </Typography>
                <Typography sx={{ color: '#332A21' }}>{milestone.text}</Typography>
              </Box>
            ))}
          </Stack>

          <Typography
            sx={{ fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.78rem', color: '#8A6428', mb: 3 }}
          >
            I principi della mia cucina
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {VALUES.map((value) => (
              <Box key={value.title} sx={{ backgroundColor: '#F3E9D6', borderRadius: 3, p: 3.5 }}>
                <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, mb: 1 }}>{value.title}</Typography>
                <Typography sx={{ color: '#332A21', fontSize: '0.92rem', lineHeight: 1.7 }}>{value.text}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <NewsletterSection />
    </>
  )
}
