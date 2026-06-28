import { Box, Container, Typography } from '@mui/material'
import VesuvioMark from './VesuvioMark'

interface PageHeroProps {
  eyebrow: string
  title: string
  description?: string
}

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <Box sx={{ backgroundColor: '#1C1712', pt: { xs: 16, md: 18 }, pb: { xs: 8, md: 10 }, position: 'relative', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at top right, rgba(184,137,62,0.16), transparent 55%)',
        }}
      />
      <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.2, mb: 2, color: '#D9B679' }}>
          <VesuvioMark className="w-7 h-4" color="currentColor" />
          <Typography sx={{ fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            {eyebrow}
          </Typography>
        </Box>
        <Typography variant="h1" sx={{ color: '#FBF6EC', fontSize: { xs: '2.2rem', md: '3rem' }, mb: description ? 2 : 0 }}>
          {title}
        </Typography>
        {description && (
          <Typography sx={{ color: 'rgba(251,246,236,0.75)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 560, mx: 'auto' }}>
            {description}
          </Typography>
        )}
      </Container>
    </Box>
  )
}
