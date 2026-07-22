// Espone i contenuti caricati dal backend (store.siteContent) con una shape
// equivalente alle vecchie costanti statiche di lib/content.ts (BRAND,
// CONTACT, SOCIAL_LINKS, ecc.), così i componenti che le usavano richiedono
// modifiche minime: sostituiscono l'import statico con questo hook.

import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/redux'
import type { SocialLink } from '@/types'

export function useSiteContent() {
  const {
    settings,
    services,
    dishes,
    activeMenu,
    activeEventsMenu,
    eventTypes,
    testimonials,
    about,
    texts,
    status,
  } = useAppSelector((state) => state.siteContent)

  const brand = useMemo(
    () => ({
      name: settings?.brandName ?? '',
      handle: settings?.brandHandle ?? '',
      role: settings?.brandRole ?? '',
      city: settings?.brandCity ?? '',
      payoff: settings?.brandPayoff ?? '',
      logoUrl: settings?.logoUrl ?? null,
    }),
    [settings],
  )

  const contact = useMemo(
    () => ({
      email: settings?.contactEmail ?? '',
      whatsappNumber: settings?.whatsappNumber ?? '',
      whatsappLink: settings?.whatsappLink ?? '',
      area: settings?.contactArea ?? '',
      mapAddress: settings?.mapAddress ?? '',
    }),
    [settings],
  )

  const socialLinks: SocialLink[] = useMemo(() => {
    if (!settings) return []
    const links: SocialLink[] = []
    if (settings.instagramUrl) links.push({ id: 'instagram', label: 'Instagram', href: settings.instagramUrl, icon: 'instagram' })
    if (settings.facebookUrl) links.push({ id: 'facebook', label: 'Facebook', href: settings.facebookUrl, icon: 'facebook' })
    if (settings.tiktokUrl) links.push({ id: 'tiktok', label: 'TikTok', href: settings.tiktokUrl, icon: 'tiktok' })
    if (settings.threadsUrl) links.push({ id: 'threads', label: 'Threads', href: settings.threadsUrl, icon: 'threads' })
    if (settings.whatsappLink) links.push({ id: 'whatsapp', label: 'WhatsApp', href: settings.whatsappLink, icon: 'whatsapp' })
    return links
  }, [settings])

  /** Restituisce il testo configurabile per `key`, o `fallback` se non ancora caricato/impostato. */
  const t = (key: string, fallback: string) => texts[key] ?? fallback

  return {
    settings,
    brand,
    contact,
    socialLinks,
    services,
    dishes,
    activeMenu,
    activeEventsMenu,
    eventTypes,
    testimonials,
    about,
    texts,
    t,
    status,
  }
}

export const NAV_ITEMS = [
  { label: 'La mia storia', sectionId: 'la-mia-storia', path: '/la-mia-storia' },
  { label: 'Servizi', sectionId: 'servizi', path: '/servizi' },
  { label: 'A MoDo mio', sectionId: 'a-modo-mio', path: '/a-modo-mio' },
  { label: 'Eventi', sectionId: 'eventi', path: '/eventi' },
  { label: 'Contatti', sectionId: 'contatti', path: '/contatti' },
]
