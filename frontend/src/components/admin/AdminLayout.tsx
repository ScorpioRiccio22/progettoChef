import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Box, Typography, Button, Container, Stack, Chip } from '@mui/material'
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FBF6EC' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ backgroundColor: '#1C1712', borderBottom: '1px solid #332A21' }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <VesuvioMark className="h-7 w-20" color="#D9B679" />
          <Typography
            sx={{ flexGrow: 1, fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: '0.02em' }}
          >
            Area Admin — Andrea Moio Chef
          </Typography>
          {user && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
              <Typography sx={{ color: 'rgba(251,246,236,0.75)', fontSize: '0.9rem' }}>
                {user.fullName}
              </Typography>
              <Chip
                label={ROLE_LABELS[user.role]}
                size="small"
                sx={{ backgroundColor: 'rgba(217,182,121,0.18)', color: '#D9B679', fontWeight: 600 }}
              />
            </Stack>
          )}
          <Button
            onClick={() => setPasswordDialogOpen(true)}
            startIcon={<LockResetIcon />}
            sx={{ color: '#FBF6EC', '&:hover': { backgroundColor: 'rgba(251,246,236,0.08)' } }}
          >
            Password
          </Button>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: '#FBF6EC', '&:hover': { backgroundColor: 'rgba(251,246,236,0.08)' } }}
          >
            Esci
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <AdminSidebar />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Outlet />
          </Box>
        </Stack>
      </Container>

      <ChangePasswordDialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} />
    </Box>
  )
}
