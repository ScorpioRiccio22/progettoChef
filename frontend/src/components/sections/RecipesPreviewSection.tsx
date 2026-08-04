import { Button, Container } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import DishCard from '@/components/ui/DishCard'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function RecipesPreviewSection() {
  const { dishes, t } = useSiteContent()
  const featured = dishes.slice(0, 3)

  if (dishes.length === 0) return null

  return (
    <div id="a-modo-mio" className="bg-ivory py-[72px] md:py-[104px]">
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow={t('home.recipes.eyebrow', 'A MoDo mio')}
          title={t('home.recipes.title', 'Un assaggio di quello che cucino')}
          description={t(
            'home.recipes.description',
            'Ricette di famiglia e qualche idea più creativa: ogni menu nasce da "A MoDo mio", adattato ai tuoi gusti e all\'occasione.',
          )}
        />
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featured.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
        <div className="text-center">
          <Button
            component={RouterLink}
            to="/a-modo-mio"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            className="border-gold-500 text-gold-600 normal-case hover:border-gold-600 hover:bg-gold-500/[.08]"
          >
            {t('home.recipes.ctaButton', 'Vedi tutto "A MoDo mio"')}
          </Button>
        </div>
      </Container>
    </div>
  )
}
