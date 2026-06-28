import { useEffect, useState } from 'react'
import { Box, Card, CardActionArea, CardContent, Grid, Stack, Typography, CircularProgress } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import StarIcon from '@mui/icons-material/Star'
import { useNavigate } from 'react-router-dom'
import { leadsApi } from '@/services/leadsApi'
import { contentApi } from '@/services/contentApi'
import { useAppSelector } from '@/hooks/redux'

interface StatCard {
  label: string
  value: number | null
  icon: React.ReactNode
  path: string
  accent?: string
}

export default function AdminDashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [stats, setStats] = useState({ contacts: null as number | null, subscribers: null as number | null, dishes: null as number | null, testimonials: null as number | null })

  useEffect(() => {
    Promise.allSettled([
      leadsApi.getContacts(0, 1, false),
      leadsApi.getSubscribers(0, 1),
      contentApi.getDishes(0, 1),
      contentApi.getTestimonials(0, 1),
    ]).then(([c, s, d, t]) => {
      setStats({
        contacts: c.status === 'fulfilled' ? c.value.totalElements : null,
        subscribers: s.status === 'fulfilled' ? s.value.totalElements : null,
        dishes: d.status === 'fulfilled' ? d.value.totalElements : null,
        testimonials: t.status === 'fulfilled' ? t.value.totalElements : null,
      })
    })
  }, [])

  const cards: StatCard[] = [
    { label: 'Messaggi', value: stats.contacts, icon: <EmailIcon />, path: '/admin/contatti', accent: '#D9B679' },
    { label: 'Iscritti newsletter', value: stats.subscribers, icon: <PeopleIcon />, path: '/admin/newsletter', accent: '#5E8C6C' },
    { label: 'Piatti nel ricettario', value: stats.dishes, icon: <MenuBookIcon />, path: '/admin/ricettario', accent: '#7B6A58' },
    { label: 'Testimonianze', value: stats.testimonials, icon: <StarIcon />, path: '/admin/testimonianze', accent: '#8B4513' },
  ]

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
          Bentornato{user ? `, ${user.fullName}` : ''}
        </Typography>
        <Typography sx={{ color: '#7B6A58', mt: 0.5 }}>
          Panoramica rapida del sito — clicca su una sezione per gestirla.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {cards.map(card => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardActionArea onClick={() => navigate(card.path)} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ color: card.accent, mb: 1.5 }}>{card.icon}</Box>
                  {card.value === null ? (
                    <CircularProgress size={20} sx={{ color: card.accent }} />
                  ) : (
                    <Typography variant="h3" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, color: '#1C1712', lineHeight: 1 }}>
                      {card.value}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: '#7B6A58', mt: 0.5 }}>{card.label}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'rgba(217,182,121,0.4)', backgroundColor: 'rgba(217,182,121,0.05)' }}>
        <CardContent>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Navigazione rapida</Typography>
          <Typography sx={{ color: '#7B6A58', fontSize: '0.9rem' }}>
            Usa il menu laterale (o le card sopra) per accedere a messaggi, newsletter, ricettario, testimonianze e impostazioni del brand.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  )
}
