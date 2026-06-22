import { Box, Button, Container, Stack, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PersonIcon from '@mui/icons-material/Person'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import { useAppSelector } from '@/hooks/redux'

export default function AboutSection() {
  const texts = useAppSelector((state) => state.content.texts)
  const about = useAppSelector((state) => state.content.about)
  const images = useAppSelector((state) => state.content.images)

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
            {images.aboutPhoto ? (
              <Box
                component="img"
                src={images.aboutPhoto}
                alt="Chef Andrea Moio"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.7,
                }}
              />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 30% 20%, rgba(184,137,62,0.35), transparent 60%), linear-gradient(160deg, #2E2519, #1C1712)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonIcon sx={{ fontSize: '5rem', color: 'rgba(184,137,62,0.3)' }} />
              </Box>
            )}
            <Typography sx={{ position: 'relative', color: '#D9B679', fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontStyle: 'italic' }}>
              "{texts.aboutQuote}"
            </Typography>
          </Box>

          <Box>
            <SectionHeading
              align="left"
              eyebrow="Chi siamo"
              title={texts.aboutTitle}
              description={texts.aboutDescription}
            />
            <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
              {about.stats.map((stat) => (
                <Box key={stat.id}>
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
