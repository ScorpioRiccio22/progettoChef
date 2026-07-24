import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { clearAuthError, login } from '@/store/slices/authSlice'
import type { LoginFormValues } from '@/types'

const EMPTY_FORM: LoginFormValues = { email: '', password: '' }

export default function AdminLoginPage() {
  const [form, setForm] = useState<LoginFormValues>(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-[420px] rounded-3xl bg-ivory p-8 md:p-10">
        <div className="mb-6 flex flex-col items-center gap-1">
          <VesuvioMark className="h-20 w-20" />
          <h1 className="font-display text-xl font-semibold text-ink">Area Admin</h1>
          <p className="text-center text-[0.9rem] text-ink-soft">
            Accedi per gestire i contenuti del sito di Andrea Moio Chef.
          </p>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-5">
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
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              required
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <LockOutlinedIcon />}
              className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
            >
              {isSubmitting ? 'Accesso in corso…' : 'Accedi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
