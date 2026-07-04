import { type ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchCurrentUser } from '@/store/slices/authSlice'
import type { AdminRole } from '@/types'

interface ProtectedRouteProps {
  children: ReactNode
  /** Se specificato, oltre all'autenticazione richiede che l'utente abbia uno di questi ruoli. */
  roles?: AdminRole[]
}

/**
 * Protegge le route sotto /admin: se non c'è un utente in stato Redux ma è
 * presente un token salvato (refresh pagina), prova prima a recuperare
 * l'utente corrente con /auth/me; solo se questo fallisce reindirizza al login.
 * Se `roles` è specificato, un utente autenticato ma privo del ruolo richiesto
 * viene reindirizzato alla dashboard invece che poter vedere la pagina.
 */
export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { user, token, isBootstrapping } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser())
    }
  }, [token, user, dispatch])

  if (isBootstrapping) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
