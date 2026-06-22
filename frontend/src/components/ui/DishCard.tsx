import { Box, Chip, Stack, Typography } from '@mui/material'
import type { Dish } from '@/types'

const CATEGORY_LABELS: Record<Dish['category'], string> = {
  antipasti: 'Antipasto',
  primi: 'Primo',
  secondi: 'Secondo',
  dolci: 'Dolce',
}

export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <Box
      sx={{
        backgroundColor: '#FBF6EC',
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
        border: '1px solid rgba(28,23,18,0.06)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 28px rgba(28,23,18,0.1)' },
      }}
    >
      {dish.imageUrl && (
        <Box
          component="img"
          src={dish.imageUrl}
          alt={dish.name}
          sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
        />
      )}
      <Box sx={{ p: 3.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Chip
            label={CATEGORY_LABELS[dish.category]}
            size="small"
            sx={{ backgroundColor: 'rgba(184,137,62,0.14)', color: '#8A6428', fontWeight: 600 }}
          />
        </Stack>
        <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.2rem', fontWeight: 600, mb: 1 }}>
          {dish.name}
        </Typography>
        <Typography sx={{ color: '#332A21', fontSize: '0.93rem', lineHeight: 1.7, mb: 2 }}>
          {dish.description}
        </Typography>
        <Stack direction="row" spacing={0.8} flexWrap="wrap">
          {dish.tags.map((tag) => (
            <Typography
              key={tag}
              component="span"
              sx={{ fontSize: '0.75rem', color: '#6E4F20', backgroundColor: '#F3E9D6', px: 1, py: 0.3, borderRadius: 999 }}
            >
              #{tag}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
