import { useMemo, useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import PageHero from '@/components/ui/PageHero'
import DishCard from '@/components/ui/DishCard'
import { useAppSelector } from '@/hooks/redux'
import type { Dish } from '@/types'

const CATEGORIES: { key: Dish['category'] | 'tutti'; label: string }[] = [
  { key: 'tutti', label: 'Tutti i piatti' },
  { key: 'antipasti', label: 'Antipasti' },
  { key: 'primi', label: 'Primi' },
  { key: 'secondi', label: 'Secondi' },
  { key: 'dolci', label: 'Dolci' },
]

export default function RecipesPage() {
  const dishes = useAppSelector((state) => state.content.dishes)
  const contact = useAppSelector((state) => state.content.contact)
  const [activeCategory, setActiveCategory] = useState<Dish['category'] | 'tutti'>('tutti')

  const filteredDishes = useMemo(
    () => (activeCategory === 'tutti' ? dishes : dishes.filter((dish) => dish.category === activeCategory)),
    [activeCategory, dishes],
  )

  return (
    <>
      <PageHero
        eyebrow="Ricettario"
        title="Cosa porto sulla tua tavola"
        description="Una selezione del ricettario che uso per costruire i menu: ogni servizio viene poi personalizzato in base ai tuoi gusti, alle stagioni e all'occasione."
      />

      <Box sx={{ backgroundColor: '#FBF6EC', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ mb: 5, rowGap: 1.2 }}>
            {CATEGORIES.map((category) => (
              <Button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                variant={activeCategory === category.key ? 'contained' : 'outlined'}
                size="small"
                sx={
                  activeCategory === category.key
                    ? { backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#8A6428' } }
                    : { borderColor: 'rgba(28,23,18,0.2)', color: '#332A21', '&:hover': { borderColor: '#B8893E' } }
                }
              >
                {category.label}
              </Button>
            ))}
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: '#F3E9D6', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: 1.5 }}>
            Vuoi un menu pensato per te?
          </Typography>
          <Typography sx={{ color: '#332A21', mb: 3 }}>
            Raccontami l'occasione, il numero di invitati e le tue preferenze: costruiamo insieme il menu giusto.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            sx={{ backgroundColor: '#3A4430', color: '#FBF6EC', '&:hover': { backgroundColor: '#2C3424' } }}
          >
            Parliamone su WhatsApp
          </Button>
        </Container>
      </Box>
    </>
  )
}
