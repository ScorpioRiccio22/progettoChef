import { Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import CelebrationIcon from '@mui/icons-material/Celebration'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'

const ICONS: Record<string, typeof HomeIcon> = {
  home: HomeIcon,
  event: CelebrationIcon,
  business: TrendingUpIcon,
}

export default function ServicesSection() {
  const { services, t } = useSiteContent()

  if (services.length === 0) return null

  return (
    <div id="servizi" className="bg-ivory-deep py-[72px] md:py-[104px]">
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow={t('home.services.eyebrow', 'Cosa offro')}
          title={t('home.services.title', 'Tre modi per portare la mia cucina da te')}
          description={t(
            'home.services.description',
            "Dalla cena tra amici al lancio della tua attività: ogni servizio è pensato su misura, partendo da quello che ti serve davvero.",
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((service) => {
            const Icon = ICONS[service.icon] ?? RestaurantIcon
            return (
              <RouterLink
                key={service.id}
                to={`/servizi/${service.slug}`}
                className="block rounded-2xl border border-ink/[0.06] bg-ivory p-8 no-underline transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(28,23,18,0.1)]"
              >
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt={service.title} className="mb-6 h-40 w-full rounded-xl object-cover" />
                ) : (
                  <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gold-500/[0.14] text-gold-600">
                    <Icon />
                  </div>
                )}
                <p className="mb-1 font-display text-[1.35rem] font-semibold">{service.title}</p>
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
  )
}
