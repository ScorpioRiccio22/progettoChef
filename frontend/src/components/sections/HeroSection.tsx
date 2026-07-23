import { Button, Container } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function HeroSection() {
  const { brand, contact, settings, t } = useSiteContent()
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const heroTitle = settings?.heroTitle || 'La cucina napoletana, portata a casa tua.'
  const heroSubtitle =
    settings?.heroSubtitle ||
    `Sono ${brand.name}: chef a domicilio per cene private, eventi e nuove attività che vogliono partire con il piede giusto in cucina.`
  const heroImageUrl = settings?.heroImageUrl // <-- verifica il nome esatto in @/types (SiteSettings)

  return (
    <div id="home" className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      {heroImageUrl ? (
        // Se è presente un'immagine hero nel CMS, usala come sfondo
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt={heroTitle}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
      ) : (
        // Altrimenti, silhouette del Vesuvio, elemento di firma del brand, in scala monumentale
        <svg viewBox="0 0 1000 320" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-[38%] w-full md:h-[52%]">
          <path
            d="M0 320 L310 95 C330 80 352 80 368 98 L410 148 L460 70 C474 48 500 48 514 70 L568 152 L612 86 C628 64 654 64 670 88 L1000 320 Z"
            fill="#241D16"
          />
          <path
            d="M0 320 L260 145 C278 130 298 130 312 146 L344 184 L460 70 C474 48 500 48 514 70 L660 250 L700 200 C714 182 738 182 752 202 L1000 320 Z"
            fill="#2E2519"
          />
          <circle cx="460" cy="70" r="5" fill="#B8893E" opacity="0.85" />
        </svg>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,137,62,0.18),transparent_55%)]" />

      <Container maxWidth="lg" className="relative z-[2] pt-28 md:pt-20">
        <div className="flex max-w-[640px] flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-[34px] bg-gold-500" />
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-gold-300">
              {brand.role} a {brand.city}
            </p>
          </div>

          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] text-ivory sm:text-[3.4rem] md:text-[4.4rem]">
            {heroTitle}
          </h1>

          <p className="max-w-[480px] text-[1.15rem] leading-relaxed text-ivory/[.78]">{heroSubtitle}</p>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Button
              size="large"
              variant="contained"
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon />}
              className="bg-gold-500 text-base text-ink normal-case hover:bg-gold-300"
            >
              {t('home.hero.ctaPrimary', 'Prenota una consulenza')}
            </Button>
            <Button
              size="large"
              variant="outlined"
              onClick={() => scrollTo('servizi')}
              className="border-ivory/40 text-base text-ivory normal-case hover:border-ivory hover:bg-ivory/[.08]"
            >
              {t('home.hero.ctaSecondary', 'Scopri i servizi')}
            </Button>
          </div>
        </div>
      </Container>

      <button
        onClick={() => scrollTo('la-mia-storia')}
        aria-label="Scorri verso la sezione La mia storia"
        className="absolute bottom-7 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-1 border-none bg-none text-ivory/70 hover:text-ivory"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.18em]">{t('home.hero.scrollLabel', 'Scorri')}</span>
        <ArrowDownwardIcon fontSize="small" className="animate-bounce-soft" />
      </button>
    </div>
  )
}