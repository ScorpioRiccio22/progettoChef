import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardActionArea, CardContent, Chip, Grid, Stack, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import CelebrationIcon from '@mui/icons-material/Celebration'
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
      description: 'Brand, logo, contatti, social, hero e testi della pagina Chi siamo.',
      icon: <SettingsIcon fontSize="large" />,
    },
    {
      to: '/admin/servizi',
      title: 'Servizi',
      description: 'I servizi offerti, mostrati nella home page.',
      icon: <RoomServiceIcon fontSize="large" />,
    },
    {
      to: '/admin/ricettario',
      title: 'Ricettario',
      description: 'I piatti del ricettario, con categorie, tag e immagini.',
      icon: <RestaurantMenuIcon fontSize="large" />,
    },
    {
      to: '/admin/eventi',
      title: 'Eventi',
      description: 'Le tipologie di eventi proposte, con dettagli e immagini.',
      icon: <CelebrationIcon fontSize="large" />,
    },
    {
      to: '/admin/testimonianze',
      title: 'Testimonianze',
      description: 'Le recensioni dei clienti mostrate sul sito.',
      icon: <FormatQuoteIcon fontSize="large" />,
    },
    {
      to: '/admin/chi-siamo',
      title: 'Chi siamo',
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
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
          Bentornato{user ? `, ${user.fullName}` : ''}
        </Typography>
        <Typography sx={{ color: '#332A21', mt: 0.5 }}>
          Gestisci da qui ogni contenuto del sito: i cambiamenti sono visibili immediatamente sul sito pubblico.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.to}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardActionArea component={RouterLink} to={card.to} sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ color: '#B8893E' }}>{card.icon}</Box>
                    {card.badge !== undefined && card.badge > 0 && (
                      <Chip label={card.badge} size="small" color="warning" />
                    )}
                  </Stack>
                  <Typography sx={{ fontWeight: 700, mt: 1.5 }}>{card.title}</Typography>
                  <Typography sx={{ color: '#5C5246', fontSize: '0.88rem', mt: 0.5 }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
