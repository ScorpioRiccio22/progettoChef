import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks/redux'

export default function AdminDashboardPage() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
          Bentornato{user ? `, ${user.fullName}` : ''}
        </Typography>
        <Typography sx={{ color: '#332A21', mt: 0.5 }}>
          Da qui potrai gestire i contenuti del sito (servizi, ricettario, eventi, messaggi e
          newsletter) non appena le relative API saranno collegate.
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Login funzionante ✅</Typography>
          <Typography sx={{ color: '#332A21', fontSize: '0.95rem' }}>
            L'autenticazione admin è collegata al backend Spring Boot (JWT). Le prossime sezioni
            di questa area (messaggi di contatto, iscritti newsletter, gestione contenuti) si
            aggiungeranno qui come nuove pagine protette dallo stesso{' '}
            <code>ProtectedRoute</code>.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  )
}
