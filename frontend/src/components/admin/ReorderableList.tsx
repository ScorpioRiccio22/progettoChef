import type { ReactNode } from 'react'
import { Box, IconButton, Stack } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

interface ReorderableListProps<T extends { id: number }> {
  items: T[]
  onReorder: (orderedIds: number[]) => void
  renderItem: (item: T, index: number) => ReactNode
}

/**
 * Mostra una lista con freccette su/giù per riordinare gli elementi e
 * invoca onReorder con la lista completa di id nel nuovo ordine, pronta da
 * passare alle funzioni adminReorder* del client API.
 */
export default function ReorderableList<T extends { id: number }>({
  items,
  onReorder,
  renderItem,
}: ReorderableListProps<T>) {
  const move = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= items.length) return
    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(newIndex, 0, moved)
    onReorder(reordered.map((item) => item.id))
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item, index) => (
        <Stack key={item.id} direction="row" spacing={1} alignItems="flex-start">
          <Stack sx={{ pt: 0.5 }}>
            <IconButton size="small" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Sposta su">
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              disabled={index === items.length - 1}
              onClick={() => move(index, 1)}
              aria-label="Sposta giù"
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Box sx={{ flex: 1, minWidth: 0 }}>{renderItem(item, index)}</Box>
        </Stack>
      ))}
    </Stack>
  )
}
