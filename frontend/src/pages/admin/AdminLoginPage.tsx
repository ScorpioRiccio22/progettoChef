import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { clearAuthError, login } from '@/store/slices/authSlice'
import type { LoginFormValues } from '@/types'

const EMPTY_FORM: LoginFormValues = { email: '', password: '' }

export default function AdminLoginPage() {
  const [form, setForm] = useState<LoginFormValues>(EMPTY_FORM)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status, error, token, user } = useAppSelector((state) => state.auth)

  // Già autenticato: non mostrare di nuovo il form di login.
  if (token && user) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/admin'
    return <Navigate to={redirectTo} replace />
  }

  const handleChange = (field: keyof LoginFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    dispatch(clearAuthError())
    dispatch(login(form)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/admin', { replace: true })
      }
    })
  }

  const isSubmitting = status === 'loading'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1712',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 420,
          width: '100%',
          p: { xs: 4, md: 5 },
          borderRadius: 3,
          backgroundColor: '#FBF6EC',
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <VesuvioMark className="h-10 w-28" color="#B8893E" />
          <Typography
            variant="h5"
            sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, color: '#1C1712' }}
          >
            Area Admin
          </Typography>
          <Typography sx={{ color: '#332A21', fontSize: '0.9rem', textAlign: 'center' }}>
            Accedi per gestire i contenuti del sito di Andrea Moio Chef.
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
              fullWidth
              autoComplete="username"
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              required
              fullWidth
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <LockOutlinedIcon />}
              sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
            >
              {isSubmitting ? 'Accesso in corso…' : 'Accedi'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
