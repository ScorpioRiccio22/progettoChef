import { Button, Chip, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CelebrationIcon from '@mui/icons-material/Celebration'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SchoolIcon from '@mui/icons-material/School'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'

function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

const ICONS: Record<string, typeof CelebrationIcon> = {
  private: CelebrationIcon,
  corporate: BusinessCenterIcon,
  catering: RestaurantIcon,
  'cooking-class': SchoolIcon,
}

export default function EventsPage() {
  const { eventTypes, activeEventsMenu, contact, t } = useSiteContent()

  const PROCESS = [
    {
      step: '1',
      title: t('events.process.step1.title', "Raccontami l'evento"),
      text: t('events.process.step1.text', 'Data, numero di invitati, location e budget di riferimento.'),
    },
    {
      step: '2',
      title: t('events.process.step2.title', 'Costruiamo il menu'),
      text: t('events.process.step2.text', 'Proposta su misura, con eventuale degustazione preliminare.'),
    },
    {
      step: '3',
      title: t('events.process.step3.title', 'Organizziamo il servizio'),
      text: t('events.process.step3.text', 'Definiamo tempistiche, allestimento e personale di sala se necessario.'),
    },
    {
      step: '4',
      title: t('events.process.step4.title', "Il giorno dell'evento"),
      text: t('events.process.step4.text', 'Arrivo con tutto il necessario: tu pensi solo a goderti la serata.'),
    },
  ]

  return (
    <>
      <PageHero
        eyebrow={t('events.page.eyebrow', 'Eventi')}
        title={t('events.page.title', 'Un servizio per ogni occasione')}
        description={t(
          'events.page.description',
          'Dalla cena per due persone al matrimonio con cento invitati: ogni evento ha una formula di servizio dedicata.',
        )}
      />

      {activeEventsMenu && activeEventsMenu.items.length > 0 && (
        <div className="bg-ivory-deep py-12 md:py-16">
          <Container maxWidth="lg">
            <div className="mb-2 flex items-center gap-3">
              <MenuBookIcon className="text-gold-600" />
              <Chip
                label={t('events.menuBanner.label', 'Menu in evidenza per gli eventi')}
                size="small"
                className="bg-gold-500/20 font-semibold text-gold-600"
              />
            </div>
            <h2 className="mb-2 font-display text-2xl font-semibold md:text-[1.9rem]">{activeEventsMenu.name}</h2>
            {activeEventsMenu.description && (
              <p className="mb-6 max-w-[640px] text-ink-soft">{activeEventsMenu.description}</p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {activeEventsMenu.items.map((item) => (
                <div key={item.id} className="flex items-baseline justify-between gap-4 rounded-xl bg-white p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.name}</p>
                    {item.description && <p className="truncate text-[0.85rem] text-clay">{item.description}</p>}
                  </div>
                  <p className="whitespace-nowrap font-bold text-gold-600">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      <div className="bg-ivory py-16 md:py-[88px]">
        <Container maxWidth="lg">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {eventTypes.map((event) => {
              const Icon = ICONS[event.icon] ?? CelebrationIcon
              return (
                <div key={event.id} className="rounded-2xl border border-ink/[0.06] bg-ivory-deep p-8">
                  {event.videoUrl ? (
                    <video
                      src={event.videoUrl}
                      poster={event.imageUrl ?? undefined}
                      controls
                      playsInline
                      preload="metadata"
                      className="mb-5 h-40 w-full rounded-xl bg-ink object-cover"
                    />
                  ) : event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="mb-5 h-40 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="mb-5 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gold-500/[0.16] text-gold-600">
                      <Icon />
                    </div>
                  )}
                  <p className="mb-2 font-display text-[1.3rem] font-semibold">{event.title}</p>
                  <p className="mb-5 leading-relaxed text-ink-soft">{event.description}</p>
                  <div className="mb-4 flex flex-col gap-2">
                    {event.details.map((detail) => (
                      <div key={detail} className="flex items-start gap-2">
                        <CheckCircleOutlineIcon className="mt-0.5 text-[1.1rem] text-gold-600" />
                        <p className="text-[0.92rem] text-ink-soft">{detail}</p>
                      </div>
                    ))}
                  </div>
                  <RouterLink
                    to={`/eventi/${event.slug}`}
                    className="inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-gold-600 no-underline"
                  >
                    <span>{t('common.discoverMore', 'Scopri di più')}</span>
                    <ArrowForwardIcon className="text-base" />
                  </RouterLink>
                </div>
              )
            })}
          </div>
        </Container>
      </div>

      <div className="bg-ink py-16 md:py-[88px]">
        <Container maxWidth="lg">
          <SectionHeading
            light
            eyebrow={t('events.process.eyebrow', 'Come funziona')}
            title={t('events.process.title', "Dal primo messaggio al giorno dell'evento")}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {PROCESS.map((item) => (
              <div key={item.step}>
                <p className="mb-2 font-display text-[2.2rem] font-semibold text-gold-300">{item.step}</p>
                <p className="mb-1.5 font-semibold text-ivory">{item.title}</p>
                <p className="text-[0.9rem] leading-relaxed text-ivory/65">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <div className="bg-ivory-deep py-16 md:py-20">
        <Container maxWidth="sm" className="text-center">
          <h2 className="mb-3 font-display text-2xl font-semibold md:text-3xl">{t('events.cta.title', 'Hai già una data in mente?')}</h2>
          <p className="mb-6 text-ink-soft">
            {t(
              'events.cta.description',
              'Scrivimi su WhatsApp con i dettagli del tuo evento: ti rispondo con disponibilità e prima proposta di menu.',
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
            {t('events.cta.button', 'Scrivimi su WhatsApp')}
          </Button>
        </Container>
      </div>
    </>
  )
}
