import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { Button, CircularProgress, Container } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PageHero from '@/components/ui/PageHero'
import MediaCarousel from '@/components/ui/MediaCarousel'
import { publicGetServiceBySlug } from '@/services/contentApi'
import { useSiteContent } from '@/hooks/useSiteContent'
import type { ServiceOffering } from '@/types'
import NotFoundPage from '@/pages/NotFoundPage'

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { contact, t } = useSiteContent()
  const [service, setService] = useState<ServiceOffering | null>(null)
  const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading')

  useEffect(() => {
    if (!slug) return
    setStatus('loading')
    publicGetServiceBySlug(slug)
      .then((data) => {
        setService(data)
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

  if (status === 'not-found' || !service) {
    return <NotFoundPage />
  }

  const paragraphs = (service.bodyContent || service.description || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <>
      <PageHero eyebrow={t('services.page.eyebrow', 'Servizi')} title={service.title} description={service.tagline} />

      {service.videoUrl ? (
        <div className="bg-ink">
          <Container maxWidth="md" className="py-10 md:py-14">
            <video
              src={service.videoUrl}
              poster={service.imageUrl ?? undefined}
              controls
              playsInline
              preload="metadata"
              className="max-h-[480px] w-full rounded-xl bg-black"
            />
          </Container>
        </div>
      ) : service.imageUrl ? (
        <img src={service.imageUrl} alt={service.title} className="block max-h-[420px] w-full object-cover" />
      ) : null}

      <div className="bg-ivory py-14 md:py-20">
        <Container maxWidth="md">
          <Button
            component={RouterLink}
            to="/servizi"
            startIcon={<ArrowBackIcon />}
            className="mb-6 pl-0 normal-case text-gold-600"
          >
            {t('services.detail.backLabel', 'Tutti i servizi')}
          </Button>

          <div className={`flex flex-col gap-5 ${paragraphs.length ? 'mb-10' : ''}`}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-[1.05rem] leading-loose text-ink-soft">
                  {p}
                </p>
              ))
            ) : (
              <p className="leading-loose text-ink-soft">{service.description}</p>
            )}
          </div>

          {service.galleryImageUrls.length > 0 && <MediaCarousel items={service.galleryImageUrls} />}
        </Container>
      </div>

      <div className="bg-ivory-deep py-16 md:py-20">
        <Container maxWidth="sm" className="text-center">
          <h2 className="mb-3 font-display text-2xl font-semibold md:text-3xl">
            {t('services.detail.cta.title', 'Ti interessa questo servizio?')}
          </h2>
          <p className="mb-6 text-ink-soft">
            {t(
              'services.detail.cta.description',
              'Scrivimi su WhatsApp raccontandomi cosa hai in mente: ti rispondo con disponibilità e prima proposta.',
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
            {t('services.detail.cta.button', 'Scrivimi su WhatsApp')}
          </Button>
        </Container>
      </div>
    </>
  )
}
