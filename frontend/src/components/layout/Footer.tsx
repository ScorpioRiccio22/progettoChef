import { Box, Container, IconButton, Stack, Typography, Link as MuiLink } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { Link as RouterLink } from 'react-router-dom'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { BRAND, CONTACT, SOCIAL_LINKS } from '@/lib/content'

// TikTok e Threads non hanno un'icona dedicata in @mui/icons-material:
// li rappresentiamo con le iniziali in un badge circolare coerente con lo stile.
function BadgeIcon({ label, href }: { label: string; href: string }) {
  return (
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      sx={{
        width: 40,
        height: 40,
        border: '1px solid rgba(251,246,236,0.25)',
        color: '#FBF6EC',
        fontSize: '0.75rem',
        fontWeight: 700,
        '&:hover': { backgroundColor: 'rgba(184,137,62,0.25)', borderColor: '#B8893E' },
      }}
    >
      {label.slice(0, 2).toUpperCase()}
    </IconButton>
  )
}

const ICONS: Record<string, JSX.Element> = {
  instagram: <InstagramIcon />,
  facebook: <FacebookIcon />,
  whatsapp: <WhatsAppIcon />,
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#1C1712', color: '#FBF6EC', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr 1fr' },
            gap: 5,
            pb: 6,
            borderBottom: '1px solid rgba(251,246,236,0.12)',
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '1.5px solid #B8893E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D9B679',
                }}
              >
                <VesuvioMark className="w-5 h-3" color="currentColor" />
              </Box>
              <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.2rem', fontWeight: 600 }}>
                {BRAND.name}
              </Typography>
            </Stack>
            <Typography sx={{ color: 'rgba(251,246,236,0.7)', maxWidth: 320, lineHeight: 1.7 }}>
              {BRAND.payoff}. Chef a domicilio, eventi privati e consulenza per nuove attività a {BRAND.city}.
            </Typography>
            <Stack direction="row" spacing={1.2} sx={{ mt: 3 }}>
              {SOCIAL_LINKS.map((social) =>
                ICONS[social.icon] ? (
                  <IconButton
                    key={social.id}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '1px solid rgba(251,246,236,0.25)',
                      color: '#FBF6EC',
                      '&:hover': { backgroundColor: 'rgba(184,137,62,0.25)', borderColor: '#B8893E' },
                    }}
                  >
                    {ICONS[social.icon]}
                  </IconButton>
                ) : (
                  <BadgeIcon key={social.id} label={social.label} href={social.href} />
                ),
              )}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.78rem', mb: 2, color: '#D9B679' }}>
              Mappa del sito
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: 'Chi siamo', to: '/chi-siamo' },
                { label: 'Ricettario', to: '/ricettario' },
                { label: 'Eventi', to: '/eventi' },
                { label: 'Contatti', to: '/contatti' },
              ].map((link) => (
                <MuiLink
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  sx={{ color: 'rgba(251,246,236,0.75)', '&:hover': { color: '#D9B679' } }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.78rem', mb: 2, color: '#D9B679' }}>
              Contatti
            </Typography>
            <Stack spacing={1.2}>
              <MuiLink href={`mailto:${CONTACT.email}`} underline="none" sx={{ color: 'rgba(251,246,236,0.75)', '&:hover': { color: '#D9B679' } }}>
                {CONTACT.email}
              </MuiLink>
              <MuiLink
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ color: 'rgba(251,246,236,0.75)', '&:hover': { color: '#D9B679' } }}
              >
                {CONTACT.whatsappNumber} (WhatsApp)
              </MuiLink>
              <Typography sx={{ color: 'rgba(251,246,236,0.55)' }}>{CONTACT.area}</Typography>
            </Stack>
          </Box>
        </Box>

        <Typography sx={{ pt: 3, fontSize: '0.82rem', color: 'rgba(251,246,236,0.45)', textAlign: 'center' }}>
          © {new Date().getFullYear()} {BRAND.name} — {BRAND.role}. Tutti i diritti riservati.
        </Typography>
      </Container>
    </Box>
  )
}
