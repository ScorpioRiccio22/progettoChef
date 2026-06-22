import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux'

// Protegge tutte le rotte sotto /admin: se non c'è un token valido in Redux,
// reindirizza al login conservando la pagina di destinazione originale.
export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
