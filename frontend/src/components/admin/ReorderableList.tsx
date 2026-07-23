import type { ReactNode } from 'react'
import { IconButton } from '@mui/material'
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
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-start gap-1">
          <div className="flex flex-col pt-0.5">
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
          </div>
          <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  )
}
