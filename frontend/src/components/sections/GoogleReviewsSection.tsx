import { Button, Container, Rating } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import GoogleIcon from '@mui/icons-material/Google'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'
import { useAppSelector } from '@/hooks/redux'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function GoogleReviewsSection() {
  const { testimonials, t } = useSiteContent()
  const { data: googleData, status } = useAppSelector((state) => state.googleReviews)

  const hasGoogleReviews = googleData?.configured && googleData.reviews.length > 0
  const hasFallback = testimonials.length > 0

  // Finché non sappiamo se Google è configurato, evitiamo un flash del
  // fallback statico: se ci sono comunque testimonianze manuali le mostriamo
  // subito, altrimenti aspettiamo la risposta prima di decidere se non
  // renderizzare nulla.
  if (!hasGoogleReviews && !hasFallback) return null
  if (status === 'loading' && !hasFallback) return null

  return (
    <div className="bg-ivory-deep py-[72px] md:py-[104px]">
      <Container maxWidth="lg">
        {hasGoogleReviews ? (
          <>
            <SectionHeading
              eyebrow={t('home.reviews.eyebrowGoogle', 'Recensioni Google')}
              title={t('home.reviews.titleGoogle', 'Cosa dicono i miei ospiti su Google')}
            />
            <div className="mb-12 flex flex-col items-start justify-center gap-3 text-center sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <GoogleIcon className="text-gold-500" />
                {googleData?.rating != null && (
                  <>
                    <span className="text-[1.15rem] font-bold text-ink">{googleData.rating.toFixed(1)}</span>
                    <Rating value={googleData.rating} precision={0.1} readOnly size="small" />
                  </>
                )}
                {googleData?.totalReviews != null && (
                  <span className="text-[0.9rem] text-gold-600">({googleData.totalReviews} recensioni)</span>
                )}
              </div>
              {googleData?.mapsUrl && (
                <Button
                  href={googleData.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  className="font-semibold normal-case text-gold-600 hover:bg-transparent hover:text-ink"
                >
                  {t('home.reviews.leaveReviewButton', 'Lascia una recensione')}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {googleData!.reviews.map((review) => (
                <div
                  key={`${review.authorName}-${review.timestamp}`}
                  className="flex flex-col rounded-2xl border border-ink/[0.06] bg-ivory p-8"
                >
                  <div className="mb-4 flex items-center gap-3">
                    {review.authorPhotoUrl ? (
                      <img
                        src={review.authorPhotoUrl}
                        alt={review.authorName}
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/[0.16] font-bold text-gold-600">
                        {initials(review.authorName)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-ink">{review.authorName}</p>
                      <p className="text-[0.78rem] text-gold-600">{review.relativeTime}</p>
                    </div>
                  </div>
                  <Rating value={review.rating} readOnly size="small" className="mb-3" />
                  <p className="flex-grow leading-relaxed text-ink-soft">{review.text}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <SectionHeading
              eyebrow={t('home.reviews.eyebrowFallback', 'Le voci di chi ha assaggiato')}
              title={t('home.reviews.titleFallback', 'Cosa raccontano i miei ospiti')}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="rounded-2xl border border-ink/[0.06] bg-ivory p-8">
                  <FormatQuoteIcon className="mb-2 text-[2.2rem] text-gold-300" />
                  <p className="mb-6 italic leading-[1.75] text-ink-soft">{testimonial.quote}</p>
                  <p className="font-semibold text-ink">{testimonial.author}</p>
                  <p className="text-[0.85rem] text-gold-600">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  )
}
