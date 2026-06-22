import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Box, Stack, Typography, Button, Chip } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import CelebrationIcon from '@mui/icons-material/Celebration'
import PersonIcon from '@mui/icons-material/Person'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { logout } from '@/store/slices/authSlice'

const NAV = [
  { label: 'Chi siamo & Immagini', path: '/admin/about', icon: PersonIcon },
  { label: 'Servizi', path: '/admin/services', icon: MiscellaneousServicesIcon },
  { label: 'Piatti', path: '/admin/dishes', icon: RestaurantMenuIcon },
  { label: 'Eventi', path: '/admin/events', icon: CelebrationIcon },
  { label: 'Contatti & Social', path: '/admin/contact', icon: ContactMailIcon },
  { label: 'Newsletter', path: '/admin/newsletter', icon: MailOutlineIcon },
]

export default function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FBF6EC' }}>
      <Box
        component="aside"
        sx={{
          width: 240,
          flexShrink: 0,
          backgroundColor: '#1C1712',
          color: '#FBF6EC',
          display: 'flex',
          flexDirection: 'column',
          py: 3,
          px: 2.5,
        }}
      >
        <Stack spacing={0.3} sx={{ mb: 4, px: 1 }}>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.2rem', fontWeight: 600, color: '#D9B679' }}>
            Pannello Admin
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(251,246,236,0.55)' }}>
            Andrea Moio Chef
          </Typography>
        </Stack>

        <Chip
          icon={<DashboardIcon sx={{ color: '#8A6428 !important' }} />}
          label={user ? `Ciao, ${user.username}` : 'Admin'}
          sx={{ backgroundColor: 'rgba(184,137,62,0.16)', color: '#D9B679', mb: 3, justifyContent: 'flex-start' }}
        />

        <Stack spacing={0.5} sx={{ flex: 1 }}>
          {NAV.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                startIcon={<Icon />}
                sx={{
                  justifyContent: 'flex-start',
                  color: active ? '#1C1712' : '#FBF6EC',
                  backgroundColor: active ? '#D9B679' : 'transparent',
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.88rem',
                  '&:hover': { backgroundColor: active ? '#D9B679' : 'rgba(251,246,236,0.08)' },
                }}
              >
                {item.label}
              </Button>
            )
          })}
        </Stack>

        <Stack spacing={1} sx={{ mt: 3 }}>
          <Button
            component={RouterLink}
            to="/"
            target="_blank"
            startIcon={<OpenInNewIcon />}
            sx={{ justifyContent: 'flex-start', color: 'rgba(251,246,236,0.7)', textTransform: 'none' }}
          >
            Vedi il sito pubblico
          </Button>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ justifyContent: 'flex-start', color: '#E0A458', textTransform: 'none' }}
          >
            Esci
          </Button>
        </Stack>
      </Box>

      <Box component="main" sx={{ flex: 1, p: { xs: 3, md: 5 }, overflowY: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
