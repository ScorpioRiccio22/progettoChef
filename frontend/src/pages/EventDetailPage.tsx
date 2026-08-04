import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { Button, CircularProgress, Container } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PageHero from '@/components/ui/PageHero'
import MediaCarousel from '@/components/ui/MediaCarousel'
import { publicGetEventTypeBySlug } from '@/services/contentApi'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { EventType } from '@/types'
import NotFoundPage from '@/pages/NotFoundPage'

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { contact, t } = useSiteContent()
  const [event, setEvent] = useState<EventType | null>(null)
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading')

  useEffect(() => {
    if (!slug) return
    setStatus('loading')
    publicGetEventTypeBySlug(slug)
      .then((data) => {
        setEvent(data)
        setStatus('found')
      })
      .catch(() => setStatus('not-found'))
  }, [slug])

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-32">
        <CircularProgress />
      </div>
    )
  }

  if (status === 'not-found' || !event) {
    return <NotFoundPage />
  }

  // Gli eventi "privati" restano volutamente minimali: solo qualche foto/video
  // e una descrizione sintetica, senza il lungo testo o l'elenco dettagli.
  const isPrivate = event.icon === 'private'

  const paragraphs = isPrivate
    ? []
    : (event.bodyContent || event.description || '')
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)

  return (
    <>
      <PageHero
        eyebrow={t('events.page.eyebrow', 'Eventi')}
        title={event.title}
        description={isPrivate ? undefined : event.description}
      />

      {event.videoUrl ? (
        <div className="bg-ink">
          <Container maxWidth="md" className="py-10 md:py-14">
            <video
              src={event.videoUrl}
              poster={event.imageUrl ?? undefined}
              controls
              playsInline
              preload="metadata"
              className="max-h-[480px] w-full rounded-xl bg-black"
            />
          </Container>
        </div>
      ) : event.imageUrl ? (
        <img src={event.imageUrl} alt={event.title} className="block max-h-[420px] w-full object-cover" />
      ) : null}

      <div className="bg-ivory py-14 md:py-20">
        <Container maxWidth="md">
          <Button
            component={RouterLink}
            to="/eventi"
            startIcon={<ArrowBackIcon />}
            className="mb-6 pl-0 normal-case text-gold-600"
          >
            {t('events.detail.backLabel', 'Tutti gli eventi')}
          </Button>

          {isPrivate ? (
            // Landing minimale: solo la descrizione breve (già nell'hero) e le foto.
            <p className={`leading-loose text-ink-soft ${event.galleryImageUrls.length ? 'mb-10' : ''}`}>
              {event.description}
            </p>
          ) : (
            <>
              <div className="mb-8 flex flex-col gap-5">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => (
                    <p key={i} className="text-[1.05rem] leading-loose text-ink-soft">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="leading-loose text-ink-soft">{event.description}</p>
                )}
              </div>

              {event.details.length > 0 && (
                <div className={`flex flex-col gap-2 ${event.galleryImageUrls.length ? 'mb-10' : ''}`}>
                  {event.details.map((detail) => (
                    <div key={detail} className="flex items-start gap-2">
                      <CheckCircleOutlineIcon className="mt-0.5 text-[1.1rem] text-gold-600" />
                      <p className="text-ink-soft">{detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {event.galleryImageUrls.length > 0 && <MediaCarousel items={event.galleryImageUrls} />}
        </Container>
      </div>

      <div className="bg-ivory-deep py-16 md:py-20">
        <Container maxWidth="sm" className="text-center">
          <h2 className="mb-3 font-display text-2xl font-semibold md:text-3xl">
            {t('events.detail.cta.title', 'Hai già una data in mente?')}
          </h2>
          <p className="mb-6 text-ink-soft">
            {t(
              'events.detail.cta.description',
              'Scrivimi su WhatsApp con i dettagli del tuo evento: ti rispondo con disponibilità e prima proposta.',
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
            {t('events.detail.cta.button', 'Scrivimi su WhatsApp')}
          </Button>
        </Container>
      </div>
    </>
  )
}
