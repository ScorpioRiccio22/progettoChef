import { Container, IconButton, Link as MuiLink } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { Link as RouterLink } from 'react-router-dom'

import VesuvioMark from '@/components/ui/VesuvioMark'
import { useSiteContent } from '@/hooks/useSiteContent'

const SOCIAL_ICON_CLASS =
  'flex h-10 w-10 items-center justify-center border border-ivory/25 text-ivory hover:border-gold-500 hover:bg-gold-500/25'

const IMG_ICON_CLASS = 'h-4 w-4 object-contain'

const FOOTER_LINK_CLASS = 'text-ivory/75 hover:text-gold-300'
const FOOTER_HEADING_CLASS =
  'mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-gold-300'

function BadgeIcon({ label, href }: { label: string; href: string }) {
  return (
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${SOCIAL_ICON_CLASS} text-[0.75rem] font-bold`}
    >
      {label.slice(0, 2).toUpperCase()}
    </IconButton>
  )
}

function SvgIconImg({ src, label }: { src: string; label: string }) {
  return <img src={src} alt={label} className={IMG_ICON_CLASS} />
}

const ICONS: Record<string, JSX.Element> = {
  instagram: <InstagramIcon fontSize="small" />,
  facebook: <FacebookIcon fontSize="small" />,
  whatsapp: <WhatsAppIcon fontSize="small" />,
}

type SocialLink = {
  id: string
  icon: string
  href: string
  label: string
}

export default function Footer() {
  const { brand, contact, socialLinks, t } = useSiteContent()

  const tagline = t(
    'footer.tagline',
    'Chef a domicilio, eventi privati e consulenza per nuove attività a {city}.',
  ).replace('{city}', brand.city)

  const getSocialContent = (social: SocialLink) => {
    if (social.icon === 'threads') {
      return <SvgIconImg src="/threads.svg" label={social.label} />
    }

    if (social.icon === 'tiktok') {
      return <SvgIconImg src="/tiktok.svg" label={social.label} />
    }

    if (ICONS[social.icon]) {
      return ICONS[social.icon]
    }

    return <BadgeIcon label={social.label} href={social.href} />
  }

  return (
    <footer className="bg-ink pb-4 pt-16 text-ivory">
      <Container maxWidth="lg">
        <div className="grid grid-cols-1 gap-10 border-b border-ivory/10 pb-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-gold-500 text-gold-300">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <VesuvioMark className="h-10 w-10" />
                )}
              </div>

              <p className="font-display text-[1.2rem] font-semibold">{brand.name}</p>
            </div>

            <p className="max-w-[320px] leading-relaxed text-ivory/70">
              {brand.payoff}. {tagline}
            </p>

            <div className="mt-6 flex gap-3">
              {socialLinks.map((social: SocialLink) => (
                <IconButton
                  key={social.id}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={SOCIAL_ICON_CLASS}
                >
                  {getSocialContent(social)}
                </IconButton>
              ))}
            </div>
          </div>

          <div>
            <p className={FOOTER_HEADING_CLASS}>
              {t('footer.sitemapHeading', 'Mappa del sito')}
            </p>

            <div className="flex flex-col gap-3">
              {[
                { label: 'La mia storia', to: '/la-mia-storia' },
                { label: 'A MoDo mio', to: '/a-modo-mio' },
                { label: 'Eventi', to: '/eventi' },
                { label: 'Servizi', to: '/servizi' },
                { label: 'Contatti', to: '/contatti' },
              ].map((link) => (
                <MuiLink
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  underline="none"
                  className={FOOTER_LINK_CLASS}
                >
                  {link.label}
                </MuiLink>
              ))}
            </div>
          </div>

          <div>
            <p className={FOOTER_HEADING_CLASS}>
              {t('footer.contactHeading', 'Contatti')}
            </p>

            <div className="flex flex-col gap-3">
              <MuiLink
                href={`mailto:${contact.email}`}
                underline="none"
                className={FOOTER_LINK_CLASS}
              >
                {contact.email}
              </MuiLink>

              <MuiLink
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                className={FOOTER_LINK_CLASS}
              >
                {contact.whatsappNumber} (WhatsApp)
              </MuiLink>

              <p className="text-ivory/55">{contact.area}</p>
            </div>
          </div>
        </div>

        <p className="pt-6 text-center text-[0.82rem] text-ivory/45">
          © {new Date().getFullYear()} {brand.name} — {brand.role}. Tutti i diritti riservati.
        </p>
      </Container>
    </footer>
  )
}