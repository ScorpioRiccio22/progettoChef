import { Box, Button, Container } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import DishCard from '@/components/ui/DishCard'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function RecipesPreviewSection() {
  const { dishes } = useSiteContent()
  const featured = dishes.slice(0, 3)

  if (dishes.length === 0) return null

  return (
    <Box id="ricettario" sx={{ backgroundColor: '#FBF6EC', py: { xs: 9, md: 13 } }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Il ricettario"
          title="Un assaggio di quello che cucino"
          description="Ricette di famiglia e qualche idea più creativa: ogni menu nasce da questo ricettario, adattato ai tuoi gusti e all'occasione."
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 5,
          }}
        >
          {featured.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/ricettario"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderColor: '#B8893E',
              color: '#8A6428',
              '&:hover': { borderColor: '#8A6428', backgroundColor: 'rgba(184,137,62,0.08)' },
            }}
          >
            Vedi tutto il ricettario
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
