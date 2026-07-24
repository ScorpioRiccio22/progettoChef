import VesuvioMark from './VesuvioMark'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const isCenter = align === 'center'
  return (
    <div
      className={`mb-10 flex flex-col md:mb-14 ${
        isCenter ? 'mx-auto max-w-[680px] items-center text-center' : 'max-w-[560px] items-start text-left'
      }`}
    >
      <div className={`mb-4 flex items-center gap-2 ${light ? 'text-gold-300' : 'text-gold-500'}`}>
        <VesuvioMark className="h-8 w-8" />
        <span className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.18em]">{eyebrow}</span>
      </div>
      <h2
        className={`font-display text-[1.9rem] font-semibold leading-[1.15] md:text-[2.6rem] ${
          light ? 'text-ivory' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-[1.05rem] leading-relaxed ${light ? 'text-ivory/[.78]' : 'text-ink-soft'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
