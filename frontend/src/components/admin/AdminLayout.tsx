import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Box, Typography, Button, Container } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { logout } from '@/store/slices/authSlice'

export default function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

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
            <Typography sx={{ color: 'rgba(251,246,236,0.75)', fontSize: '0.9rem', mr: 1 }}>
              {user.fullName}
            </Typography>
          )}
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
        <Outlet />
      </Container>
    </Box>
  )
}
