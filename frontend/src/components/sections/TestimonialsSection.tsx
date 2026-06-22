import { Box, Container, Typography } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import SectionHeading from '@/components/ui/SectionHeading'
import { TESTIMONIALS } from '@/lib/content'

export default function TestimonialsSection() {
  return (
    <Box sx={{ backgroundColor: '#F3E9D6', py: { xs: 9, md: 13 } }}>
      <Container maxWidth="lg">
        <SectionHeading eyebrow="Le voci di chi ha assaggiato" title="Cosa raccontano i miei ospiti" />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {TESTIMONIALS.map((testimonial) => (
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
      </Container>
    </Box>
  )
}
