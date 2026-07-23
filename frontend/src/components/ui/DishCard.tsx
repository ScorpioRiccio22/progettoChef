import { Chip } from '@mui/material'
import type { Dish } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  antipasti: 'Antipasto',
  primi: 'Primo',
  secondi: 'Secondo',
  dolci: 'Dolce',
}

export default function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="h-full rounded-2xl border border-ink/[0.06] bg-ivory-deep p-7 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(28,23,18,0.1)]">
      {dish.imageUrl && (
        <img src={dish.imageUrl} alt={dish.name} className="mb-4 h-40 w-full rounded-xl object-cover" />
      )}
      <div className="mb-3 flex items-start justify-between">
        <Chip
          label={CATEGORY_LABELS[dish.category] ?? dish.category}
          size="small"
          className="bg-ivory font-semibold text-gold-600"
        />
      </div>
      <p className="mb-2 font-display text-[1.2rem] font-semibold">{dish.name}</p>
      <p className="mb-4 text-[0.93rem] leading-relaxed text-ink-soft">{dish.description}</p>
      <div className="flex flex-wrap gap-2">
        {dish.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-ivory px-2.5 py-1 text-[0.75rem] text-[#000] font-semibold">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
