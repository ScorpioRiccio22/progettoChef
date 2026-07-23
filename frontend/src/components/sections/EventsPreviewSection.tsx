import { Button, Container } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CelebrationIcon from '@mui/icons-material/Celebration'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SchoolIcon from '@mui/icons-material/School'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'

const ICONS: Record<string, typeof CelebrationIcon> = {
  private: CelebrationIcon,
  corporate: BusinessCenterIcon,
  catering: RestaurantIcon,
  'cooking-class': SchoolIcon,
}

export default function EventsPreviewSection() {
  const { eventTypes, t } = useSiteContent()

  if (eventTypes.length === 0) return null

  return (
    <div id="eventi" className="bg-ink py-[72px] md:py-[104px]">
      <Container maxWidth="lg">
        <SectionHeading
          light
          eyebrow={t('home.events.eyebrow', 'Eventi')}
          title={t('home.events.title', 'Un servizio per ogni occasione')}
          description={t(
            'home.events.description',
            'Dalla cena intima al matrimonio con cento invitati: definiamo insieme menu, formula di servizio e tempistiche.',
          )}
        />
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {eventTypes.map((event) => {
            const Icon = ICONS[event.icon] ?? CelebrationIcon
            return (
              <div
                key={event.id}
                className="rounded-2xl border border-ivory/10 p-6 transition duration-300 ease-out hover:border-gold-500/50 hover:bg-gold-500/[0.06]"
              >
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="mb-4 h-[100px] w-full rounded-xl object-cover" />
                ) : (
                  <div className="mb-4 text-gold-300">
                    <Icon />
                  </div>
                )}
                <p className="mb-2 font-display text-[1.1rem] font-semibold text-ivory">{event.title}</p>
                <p className="text-[0.9rem] leading-relaxed text-ivory/65">{event.description}</p>
              </div>
            )
          })}
        </div>
        <div className="text-center">
          <Button
            component={RouterLink}
            to="/eventi"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            {t('home.events.ctaButton', 'Scopri tutti gli eventi')}
          </Button>
        </div>
      </Container>
    </div>
  )
}
