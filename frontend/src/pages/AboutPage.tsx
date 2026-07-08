import { Box, Container, Stack, Typography } from '@mui/material'
import PageHero from '@/components/ui/PageHero'
import NewsletterSection from '@/components/sections/NewsletterSection'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AboutPage() {
  const { brand, settings, about } = useSiteContent()

  const paragraph1 =
    settings?.aboutParagraph1 ||
    "Sono Andrea, e cucino da quando ero un bambino seduto al bancone di cucina di mia nonna, a guardare come si prepara una vera genovese. Quella tavola è il punto da cui parte ancora oggi ogni mio menu: ingredienti semplici, tempi lunghi e rispetto per la materia prima."
  const paragraph2 =
    settings?.aboutParagraph2 ||
    "Dopo anni nelle cucine di alcuni ristoranti storici di Napoli, ho deciso di portare quella stessa cura fuori dalle quattro mura di un locale: a casa tua, nel tuo ufficio, nella location del tuo evento. Oggi affianco famiglie per cene speciali, aziende per i loro eventi e nuove attività che vogliono partire con un'identità di cucina chiara."

  const milestones = about?.milestones ?? []
  const values = about?.values ?? []

  return (
    <>
      <PageHero
        eyebrow="La mia storia"
        title={`La storia di ${brand.name}`}
        description="Non un'azienda, ma un percorso: dalla cucina di famiglia alle cucine professionali di Napoli, fino a diventare il servizio su misura che porto oggi sulla tua tavola."
      />

      <Box sx={{ backgroundColor: '#FBF6EC', py: { xs: 8, md: 11 } }}>
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ mb: 8 }}>
            <Typography sx={{ color: '#332A21', fontSize: '1.1rem', lineHeight: 1.85 }}>{paragraph1}</Typography>
            <Typography sx={{ color: '#332A21', fontSize: '1.1rem', lineHeight: 1.85 }}>{paragraph2}</Typography>
          </Stack>

          {milestones.length > 0 && (
            <>
              <Typography
                sx={{ fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.78rem', color: '#8A6428', mb: 3 }}
              >
                Le tappe della mia storia
              </Typography>
              <Stack spacing={0} sx={{ mb: 8, borderLeft: '2px solid #E6C588', pl: 4 }}>
                {milestones.map((milestone) => (
                  <Box key={milestone.id} sx={{ position: 'relative', pb: 4 }}>
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
            </>
          )}

          {values.length > 0 && (
            <>
              <Typography
                sx={{ fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.78rem', color: '#8A6428', mb: 3 }}
              >
                I principi della mia cucina
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {values.map((value) => (
                  <Box key={value.id} sx={{ backgroundColor: '#F3E9D6', borderRadius: 3, p: 3.5 }}>
                    <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, mb: 1 }}>{value.title}</Typography>
                    <Typography sx={{ color: '#332A21', fontSize: '0.92rem', lineHeight: 1.7 }}>{value.text}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Container>
      </Box>

      <NewsletterSection />
    </>
  )
}
