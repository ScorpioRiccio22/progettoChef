import { Box, Button, Container, Stack, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function HeroSection() {
  const { brand, contact, settings } = useSiteContent()
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const heroTitle = settings?.heroTitle || 'La cucina napoletana, portata a casa tua.'
  const heroSubtitle =
    settings?.heroSubtitle ||
    `Sono ${brand.name}: chef a domicilio per cene private, eventi e nuove attività che vogliono partire con il piede giusto in cucina.`

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1C1712',
        overflow: 'hidden',
      }}
    >
      {/* Silhouette del Vesuvio, elemento di firma del brand, in scala monumentale */}
      <Box
        component="svg"
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: { xs: '38%', md: '52%' },
          opacity: 1,
        }}
      >
        <path
          d="M0 320 L310 95 C330 80 352 80 368 98 L410 148 L460 70 C474 48 500 48 514 70 L568 152 L612 86 C628 64 654 64 670 88 L1000 320 Z"
          fill="#241D16"
        />
        <path
          d="M0 320 L260 145 C278 130 298 130 312 146 L344 184 L460 70 C474 48 500 48 514 70 L660 250 L700 200 C714 182 738 182 752 202 L1000 320 Z"
          fill="#2E2519"
        />
        <circle cx="460" cy="70" r="5" fill="#B8893E" opacity="0.85" />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at top right, rgba(184,137,62,0.18), transparent 55%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: { xs: 14, md: 10 } }}>
        <Stack spacing={3} sx={{ maxWidth: 640 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box sx={{ width: 34, height: 1, backgroundColor: '#B8893E' }} />
            <Typography
              sx={{
                color: '#D9B679',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              {brand.role} a {brand.city}
            </Typography>
          </Stack>

          <Typography
            variant="h1"
            sx={{
              color: '#FBF6EC',
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.4rem' },
              lineHeight: 1.05,
            }}
          >
            {heroTitle}
          </Typography>

          <Typography sx={{ color: 'rgba(251,246,236,0.78)', fontSize: '1.15rem', maxWidth: 480, lineHeight: 1.7 }}>
            {heroSubtitle}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
            <Button
              size="large"
              variant="contained"
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon />}
              sx={{
                backgroundColor: '#B8893E',
                color: '#1C1712',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#D9B679' },
              }}
            >
              Prenota una consulenza
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => scrollTo('servizi')}
              sx={{
                color: '#FBF6EC',
                borderColor: 'rgba(251,246,236,0.4)',
                fontSize: '1rem',
                '&:hover': { borderColor: '#FBF6EC', backgroundColor: 'rgba(251,246,236,0.08)' },
              }}
            >
              Scopri i servizi
            </Button>
          </Stack>
        </Stack>
      </Container>

      <Box
        component="button"
        onClick={() => scrollTo('chi-siamo')}
        aria-label="Scorri verso la sezione Chi siamo"
        sx={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          background: 'none',
          border: 'none',
          color: 'rgba(251,246,236,0.7)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          '&:hover': { color: '#FBF6EC' },
        }}
      >
        <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Scorri
        </Typography>
        <ArrowDownwardIcon fontSize="small" sx={{ animation: 'bounce 2s infinite' }} />
      </Box>

      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `@keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }`,
        }}
      />
    </Box>
  )
}
