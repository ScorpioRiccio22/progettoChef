import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Button, Container, Chip } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import LockResetIcon from '@mui/icons-material/LockReset'
import VesuvioMark from '@/components/ui/VesuvioMark'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ChangePasswordDialog from '@/components/admin/ChangePasswordDialog'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { logout } from '@/store/slices/authSlice'
import type { AdminRole } from '@/types'

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPERADMIN: 'Superadmin',
  ADMIN: 'Admin',
  EDITOR: 'Solo grafica',
}

export default function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AppBar position="sticky" elevation={0} className="!border-b !border-ink-soft !bg-ink">
        <Toolbar className="gap-4">
          <VesuvioMark className="h-7 w-20" color="#D9B679" />
          <p className="flex-grow font-display font-semibold tracking-[0.02em] text-ivory">
            Area Admin — Andrea Moio Chef
          </p>
          {user && (
            <div className="mr-2 flex items-center gap-2">
              <span className="text-[0.9rem] text-ivory/75">{user.fullName}</span>
              <Chip label={ROLE_LABELS[user.role]} size="small" className="bg-gold-300/[.18] font-semibold text-gold-300" />
            </div>
          )}
          <Button
            onClick={() => setPasswordDialogOpen(true)}
            startIcon={<LockResetIcon />}
            className="text-ivory normal-case hover:bg-ivory/[.08]"
          >
            Password
          </Button>
          <Button onClick={handleLogout} startIcon={<LogoutIcon />} className="text-ivory normal-case hover:bg-ivory/[.08]">
            Esci
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row">
          <AdminSidebar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </Container>

      <ChangePasswordDialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} />
    </div>
  )
}
