import { useCallback, useEffect, useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const AUTOPLAY_MS = 4000

/** Un file è considerato video se l'URL termina con un'estensione video nota (i video caricati sono sempre mp4). */
function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url.split('?')[0])
}

interface MediaCarouselProps {
  /** URL di immagini o video, nell'ordine in cui vanno mostrati. */
  items: string[]
  /** Numero di slide visibili contemporaneamente, per breakpoint. Default: 1 mobile, 2 tablet, 4 desktop. */
  slidesPerView?: { xs?: number; sm?: number; md?: number }
  /** Altezza di ogni slide. */
  slideHeight?: number
}

/**
 * Carosello per gallerie di immagini/video (usato nelle pagine di dettaglio di servizi ed eventi).
 * Autoplay ogni 4 secondi, frecce assolute centrate verticalmente, responsive: 4 slide da
 * desktop fino a 1 su mobile. Ogni slide è una singola immagine o un singolo video.
 */
export default function MediaCarousel({
  items,
  slidesPerView = { xs: 1, sm: 2, md: 4 },
  slideHeight = 240,
}: MediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(slidesPerView.md ?? 4)
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calcola quante slide sono visibili in base alla larghezza del contenitore
  // (coerente con i breakpoint MUI: xs < 600, sm 600-899, md >= 900).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateVisibleCount = () => {
      const width = el.offsetWidth
      if (width >= 900) setVisibleCount(slidesPerView.md ?? 4)
      else if (width >= 600) setVisibleCount(slidesPerView.sm ?? 2)
      else setVisibleCount(slidesPerView.xs ?? 1)
    }

    updateVisibleCount()
    const observer = new ResizeObserver(updateVisibleCount)
    observer.observe(el)
    return () => observer.disconnect()
  }, [slidesPerView.xs, slidesPerView.sm, slidesPerView.md])

  const maxIndex = Math.max(0, items.length - visibleCount)

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const goNext = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1))
  }, [maxIndex])

  // Autoplay: avanza di una slide ogni 4000ms, in pausa quando l'utente interagisce (hover) o non serve scorrere.
  useEffect(() => {
    if (paused || maxIndex === 0) return
    const timer = setInterval(goNext, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, maxIndex, goNext])

  if (items.length === 0) return null

  const showArrows = items.length > visibleCount
  const slideWidthPercent = 100 / visibleCount

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      <div className="overflow-hidden">
        {/* Percentuale calcolata a runtime in base a quante slide sono visibili: resta inline. */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * slideWidthPercent}%)` }}
        >
          {items.map((url, i) => (
            <div
              key={url + i}
              className="box-border shrink-0 px-2"
              style={{ flex: `0 0 ${slideWidthPercent}%`, maxWidth: `${slideWidthPercent}%` }}
            >
              {isVideoUrl(url) ? (
                <video
                  src={url}
                  controls
                  playsInline
                  preload="metadata"
                  className="block w-full rounded-xl bg-ink object-cover"
                  style={{ height: slideHeight }}
                />
              ) : (
                <img src={url} alt="" className="block w-full rounded-xl object-cover" style={{ height: slideHeight }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <IconButton
            onClick={goPrev}
            aria-label="Immagine precedente"
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-ink/[.55] text-ivory hover:bg-ink/80"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={goNext}
            aria-label="Immagine successiva"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-ink/[.55] text-ivory hover:bg-ink/80"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </div>
  )
}
