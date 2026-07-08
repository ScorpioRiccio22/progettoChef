import { Box, Button, Container, Rating, Stack, Typography } from '@mui/material'
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
  const { testimonials } = useSiteContent()
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
    <Box sx={{ backgroundColor: '#F3E9D6', py: { xs: 9, md: 13 } }}>
      <Container maxWidth="lg">
        {hasGoogleReviews ? (
          <>
            <SectionHeading eyebrow="Recensioni Google" title="Cosa dicono i miei ospiti su Google" />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="center"
              sx={{ mb: 6, textAlign: 'center' }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <GoogleIcon sx={{ color: '#B8893E' }} />
                {googleData?.rating != null && (
                  <>
                    <Typography sx={{ fontWeight: 700, color: '#1C1712', fontSize: '1.15rem' }}>
                      {googleData.rating.toFixed(1)}
                    </Typography>
                    <Rating value={googleData.rating} precision={0.1} readOnly size="small" />
                  </>
                )}
                {googleData?.totalReviews != null && (
                  <Typography sx={{ color: '#8A6428', fontSize: '0.9rem' }}>
                    ({googleData.totalReviews} recensioni)
                  </Typography>
                )}
              </Stack>
              {googleData?.mapsUrl && (
                <Button
                  href={googleData.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  sx={{ color: '#8A6428', fontWeight: 600, '&:hover': { backgroundColor: 'transparent', color: '#1C1712' } }}
                >
                  Lascia una recensione
                </Button>
              )}
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {googleData!.reviews.map((review) => (
                <Box
                  key={`${review.authorName}-${review.timestamp}`}
                  sx={{
                    backgroundColor: '#FBF6EC',
                    borderRadius: 3,
                    p: 4,
                    border: '1px solid rgba(28,23,18,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    {review.authorPhotoUrl ? (
                      <Box
                        component="img"
                        src={review.authorPhotoUrl}
                        alt={review.authorName}
                        referrerPolicy="no-referrer"
                        sx={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(184,137,62,0.16)',
                          color: '#8A6428',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {initials(review.authorName)}
                      </Box>
                    )}
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#1C1712' }}>{review.authorName}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#8A6428' }}>{review.relativeTime}</Typography>
                    </Box>
                  </Stack>
                  <Rating value={review.rating} readOnly size="small" sx={{ mb: 1.5 }} />
                  <Typography sx={{ color: '#332A21', lineHeight: 1.7, flexGrow: 1 }}>{review.text}</Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <>
            <SectionHeading eyebrow="Le voci di chi ha assaggiato" title="Cosa raccontano i miei ospiti" />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {testimonials.map((testimonial) => (
                <Box
                  key={testimonial.id}
                  sx={{
                    backgroundColor: '#FBF6EC',
                    borderRadius: 3,
                    p: 4,
                    border: '1px solid rgba(28,23,18,0.06)',
                  }}
                >
                  <FormatQuoteIcon sx={{ color: '#D9B679', fontSize: '2.2rem', mb: 1 }} />
                  <Typography sx={{ color: '#332A21', lineHeight: 1.75, mb: 3, fontStyle: 'italic' }}>
                    {testimonial.quote}
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1C1712' }}>{testimonial.author}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#8A6428' }}>{testimonial.role}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
}
