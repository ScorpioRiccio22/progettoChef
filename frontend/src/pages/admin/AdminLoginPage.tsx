import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Container, Stack, TextField, Typography, Alert } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { loginAdmin, clearError } from '@/store/slices/authSlice'

export default function AdminLoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { token, status, error } = useAppSelector((state) => state.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (token) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin/texts'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    dispatch(clearError())
    const result = await dispatch(loginAdmin({ username, password }))
    if (loginAdmin.fulfilled.match(result)) {
      navigate('/admin/texts', { replace: true })
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#1C1712',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            backgroundColor: '#FBF6EC',
            borderRadius: 3,
            p: 4.5,
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          }}
        >
          <Stack spacing={0.5} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: 'rgba(184,137,62,0.16)',
                color: '#8A6428',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <LockOutlinedIcon />
            </Box>
            <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.4rem', fontWeight: 600 }}>
              Area Admin
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#332A21', textAlign: 'center' }}>
              Accedi per gestire testi, piatti ed eventi del sito.
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                fullWidth
                autoFocus
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={status === 'loading'}
                sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#8A6428' } }}
              >
                {status === 'loading' ? 'Accesso in corso…' : 'Accedi'}
              </Button>
            </Stack>
          </Box>

          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(28,23,18,0.5)', textAlign: 'center', mt: 2.5 }}>
            Demo: andrea / andrea123 — login mock, sostituito dal backend reale in seguito.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
