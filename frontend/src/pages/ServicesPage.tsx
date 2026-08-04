import { Button, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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
  const { services, contact, t } = useSiteContent()

  return (
    <>
      <PageHero
        eyebrow={t('services.page.eyebrow', 'Servizi')}
        title={t('services.page.title', 'Tre modi per portare la mia cucina da te')}
        description={t(
          'services.page.description',
          "Dalla cena tra amici al lancio della tua attività: ogni servizio è pensato su misura, partendo da quello che ti serve davvero.",
        )}
      />

      <div className="bg-ivory py-16 md:py-[88px]">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((service) => {
              const Icon = ICONS[service.icon] ?? RestaurantIcon
              return (
                <RouterLink
                  key={service.id}
                  to={`/servizi/${service.slug}`}
                  className="block rounded-2xl border border-ink/[0.06] bg-ivory-deep p-8 no-underline transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(28,23,18,0.1)]"
                >
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.title} className="mb-5 h-40 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gold-500/[0.16] text-gold-600">
                      <Icon />
                    </div>
                  )}
                  <p className="mb-1 font-display text-[1.3rem] font-semibold">{service.title}</p>
                  <p className="mb-3 text-[0.88rem] font-semibold text-gold-600">{service.tagline}</p>
                  <p className="leading-relaxed text-ink-soft">{service.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[0.88rem] font-semibold text-gold-600">
                    <span>{t('common.discoverMore', 'Scopri di più')}</span>
                    <ArrowForwardIcon className="text-base" />
                  </div>
                </RouterLink>
              )
            })}
          </div>
        </Container>
      </div>

      <div className="bg-ivory-deep py-16 md:py-20">
        <Container maxWidth="sm" className="text-center">
          <h2 className="mb-3 font-display text-2xl font-semibold md:text-3xl">
            {t('services.cta.title', 'Non sai quale servizio fa per te?')}
          </h2>
          <p className="mb-6 text-ink-soft">
            {t(
              'services.cta.description',
              'Scrivimi su WhatsApp raccontandomi cosa hai in mente: ti aiuto a capire la formula più adatta.',
            )}
          </p>
          <Button
            variant="contained"
            size="large"
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            className="bg-olive text-ivory normal-case hover:bg-[#2C3424]"
          >
            {t('services.cta.button', 'Scrivimi su WhatsApp')}
          </Button>
        </Container>
      </div>
    </>
  )
}
