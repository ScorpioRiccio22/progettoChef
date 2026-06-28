import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Typography, Button, Container,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, useMediaQuery, useTheme, Divider
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EmailIcon from '@mui/icons-material/Email'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import StarIcon from '@mui/icons-material/Star'
import SettingsIcon from '@mui/icons-material/Settings'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { logout } from '@/store/slices/authSlice'

const DRAWER_WIDTH = 220

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Messaggi', path: '/admin/contatti', icon: <EmailIcon fontSize="small" /> },
  { label: 'Newsletter', path: '/admin/newsletter', icon: <PeopleIcon fontSize="small" /> },
  { label: 'Ricettario', path: '/admin/ricettario', icon: <MenuBookIcon fontSize="small" /> },
  { label: 'Testimonianze', path: '/admin/testimonianze', icon: <StarIcon fontSize="small" /> },
  { label: 'Brand', path: '/admin/brand', icon: <SettingsIcon fontSize="small" /> },
]

export default function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin/login', { replace: true })
  }

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1C1712', color: '#FBF6EC' }}>
      <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <VesuvioMark className="h-6 w-16" color="#D9B679" />
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(251,246,236,0.5)', mt: 0.5 }}>
          Area admin
        </Typography>
      </Box>
      <List sx={{ flex: 1, py: 1 }}>
        {NAV.map(item => {
          const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
          return (
            <ListItemButton
              key={item.path}
              onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false) }}
              sx={{
                mx: 1, borderRadius: 2, mb: 0.25,
                backgroundColor: active ? 'rgba(217,182,121,0.15)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(217,182,121,0.1)' },
                color: active ? '#D9B679' : 'rgba(251,246,236,0.75)',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.88rem' }} />
            </ListItemButton>
          )
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ p: 2 }}>
        {user && (
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(251,246,236,0.5)', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.fullName}
          </Typography>
        )}
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{ color: 'rgba(251,246,236,0.75)', justifyContent: 'flex-start', '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' }, textTransform: 'none', fontSize: '0.88rem' }}
        >
          Esci
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FBF6EC' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#1C1712', borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ gap: 1 }}>
            <IconButton onClick={() => setMobileOpen(o => !o)} sx={{ color: '#FBF6EC' }}>
              <MenuIcon />
            </IconButton>
            <VesuvioMark className="h-6 w-16" color="#D9B679" />
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent"
          sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
          {drawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box component="main" sx={{ flex: 1, pt: isMobile ? 8 : 0, minWidth: 0 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
