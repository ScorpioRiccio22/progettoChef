import { Container } from '@mui/material'
import VesuvioMark from './VesuvioMark'

interface PageHeroProps {
  eyebrow: string
  title: string
  description?: string
}

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-ink pb-16 pt-32 md:pb-20 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,137,62,0.16),transparent_55%)]" />
      <Container maxWidth="md" className="relative text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-gold-300">
          <VesuvioMark className="h-4 w-7" color="currentColor" />
          <span className="text-[0.8rem] font-semibold uppercase tracking-[0.18em]">{eyebrow}</span>
        </div>
        <h1 className={`font-display text-[2.2rem] font-semibold text-ivory md:text-[3rem] ${description ? 'mb-4' : ''}`}>
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-[560px] text-[1.05rem] leading-relaxed text-ivory/75">{description}</p>
        )}
      </Container>
    </div>
  )
}
