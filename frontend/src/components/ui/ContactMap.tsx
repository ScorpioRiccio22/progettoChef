import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import markerIcon2xPng from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

// Il bundler di Leaflet per le icone di default si aspetta risorse risolte
// via URL relativi al CSS: con Vite vanno reimpostate esplicitamente,
// altrimenti il marker sulla mappa risulta un'icona rotta.
const markerIcon = L.icon({
  iconUrl: markerIconPng,
  iconRetinaUrl: markerIcon2xPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface GeocodeResult {
  lat: number
  lon: number
  displayName: string
}

const CACHE_KEY_PREFIX = 'geocode:'

/**
 * Geocodifica un indirizzo con Nominatim (OpenStreetMap), con cache in
 * sessionStorage per evitare di richiamare l'API ad ogni render/navigazione
 * e per rispettare la policy di utilizzo di Nominatim (max ~1 richiesta al
 * secondo, uso leggero non commerciale).
 */
async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const cacheKey = CACHE_KEY_PREFIX + address
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) {
    return cached === 'null' ? null : (JSON.parse(cached) as GeocodeResult)
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('Geocoding non riuscito')

  const data = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>
  const result: GeocodeResult | null = data[0]
    ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), displayName: data[0].display_name }
    : null

  sessionStorage.setItem(cacheKey, result ? JSON.stringify(result) : 'null')
  return result
}

interface ContactMapProps {
  /** Indirizzo completo configurato in admin (Impostazioni sito -> Contatti). */
  address: string
  className?: string
}

/**
 * Mini mappa della pagina Contatti: geocodifica l'indirizzo configurato in
 * admin tramite Nominatim e mostra un marker su una mappa Leaflet (tile
 * OpenStreetMap). Se l'indirizzo non è configurato o non viene trovato, il
 * componente non renderizza nulla (fallback silenzioso).
 */
export default function ContactMap({ address, className = '' }: ContactMapProps) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [result, setResult] = useState<GeocodeResult | null>(null)

  useEffect(() => {
    if (!address?.trim()) {
      setState('error')
      return
    }
    let cancelled = false
    setState('loading')
    geocodeAddress(address)
      .then((res) => {
        if (cancelled) return
        setResult(res)
        setState(res ? 'ready' : 'error')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [address])

  if (state === 'loading') {
    return (
      <div className={`flex h-56 items-center justify-center rounded-2xl bg-ivory-deep text-sm text-clay ${className}`}>
        Carico la mappa…
      </div>
    )
  }

  // Indirizzo assente o non geolocalizzabile: niente mappa, nessun errore in vista.
  if (state === 'error' || !result) {
    return null
  }

  const position: [number, number] = [result.lat, result.lon]

  return (
    <div className={`overflow-hidden rounded-2xl border border-black/10 ${className}`}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-56 w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={markerIcon}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
