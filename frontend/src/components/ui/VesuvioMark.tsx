interface VesuvioMarkProps {
  className?: string
  color?: string
}

/**
 * Silhouette stilizzata del Vesuvio, lo stesso elemento del logo,
 * usata come firma visiva ricorrente: divisore di sezione, watermark,
 * elemento decorativo nell'hero.
 */
export default function VesuvioMark({ className, color = 'currentColor' }: VesuvioMarkProps) {
  return (
    <svg
      viewBox="0 0 200 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 58 L62 18 C66 15.5 70 15.5 73 19 L82 30 L92 14 C95 9.5 100 9.5 103 14 L114 32 L126 17 C129 14 133.5 14 136.5 17.5 L200 58 Z"
        fill={color}
      />
      <circle cx="92" cy="20" r="2.2" fill={color} opacity="0.6" />
    </svg>
  )
}
