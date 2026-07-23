import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Card, CardActionArea, CardContent, Chip } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CelebrationIcon from '@mui/icons-material/Celebration'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import InfoIcon from '@mui/icons-material/Info'
import MailIcon from '@mui/icons-material/Mail'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import { useAppSelector } from '@/hooks/redux'
import { adminCountUnreadMessages, adminListNewsletterSubscribers } from '@/services/leadsApi'

interface DashboardCard {
  to: string
  title: string
  description: string
  icon: React.ReactNode
  badge?: number
}

export default function AdminDashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const [unreadCount, setUnreadCount] = useState<number | null>(null)
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)

  useEffect(() => {
    adminCountUnreadMessages().then(setUnreadCount).catch(() => setUnreadCount(null))
    adminListNewsletterSubscribers()
      .then((list) => setSubscriberCount(list.length))
      .catch(() => setSubscriberCount(null))
  }, [])

  const cards: DashboardCard[] = [
    {
      to: '/admin/impostazioni',
      title: 'Impostazioni sito',
      description: 'Brand, logo, contatti, social, hero e testi della pagina La mia storia.',
      icon: <SettingsIcon fontSize="large" />,
    },
    {
      to: '/admin/testi',
      title: 'Testi del sito',
      description: 'Titoli, descrizioni e testo dei pulsanti di ogni pagina, tutti modificabili qui.',
      icon: <TextFieldsIcon fontSize="large" />,
    },
    {
      to: '/admin/servizi',
      title: 'Servizi',
      description: 'I servizi offerti, mostrati nella home page.',
      icon: <RoomServiceIcon fontSize="large" />,
    },
    {
      to: '/admin/a-modo-mio',
      title: 'A MoDo mio',
      description: 'I piatti di "A MoDo mio", con categorie, tag e immagini.',
      icon: <RestaurantMenuIcon fontSize="large" />,
    },
    {
      to: '/admin/a-modo-mio/menu',
      title: 'Menu del negozio',
      description: 'Liste di piatti con prezzo; segna quale è attivo ora nel negozio fisico.',
      icon: <StorefrontIcon fontSize="large" />,
    },
    {
      to: '/admin/eventi',
      title: 'Eventi',
      description: 'Le tipologie di eventi proposte, con dettagli e immagini.',
      icon: <CelebrationIcon fontSize="large" />,
    },
    {
      to: '/admin/eventi/menu',
      title: 'Menu eventi',
      description: 'Liste di piatti con prezzo dedicate agli eventi; segna quale è in evidenza.',
      icon: <MenuBookIcon fontSize="large" />,
    },
    {
      to: '/admin/testimonianze',
      title: 'Testimonianze',
      description: 'Le recensioni dei clienti mostrate sul sito.',
      icon: <FormatQuoteIcon fontSize="large" />,
    },
    {
      to: '/admin/la-mia-storia',
      title: 'La mia storia',
      description: 'Tappe del percorso e principi della cucina.',
      icon: <InfoIcon fontSize="large" />,
    },
    {
      to: '/admin/messaggi',
      title: 'Messaggi',
      description: 'I messaggi ricevuti dal form di contatto.',
      icon: <MailIcon fontSize="large" />,
      badge: unreadCount ?? undefined,
    },
    {
      to: '/admin/newsletter',
      title: 'Newsletter',
      description: 'Gli iscritti alla newsletter, con export CSV.',
      icon: <MarkEmailUnreadIcon fontSize="large" />,
      badge: subscriberCount ?? undefined,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Bentornato{user ? `, ${user.fullName}` : ''}</h1>
        <p className="mt-1 text-ink-soft">
          Gestisci da qui ogni contenuto del sito: i cambiamenti sono visibili immediatamente sul sito pubblico.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.to} variant="outlined" className="h-full rounded-2xl">
            <CardActionArea component={RouterLink} to={card.to} className="h-full">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="text-gold-500">{card.icon}</div>
                  {card.badge !== undefined && card.badge > 0 && <Chip label={card.badge} size="small" color="warning" />}
                </div>
                <p className="mt-3 font-bold">{card.title}</p>
                <p className="mt-1 text-[0.88rem] text-clay">{card.description}</p>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  )
}
