import { NavLink } from 'react-router-dom'
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import CelebrationIcon from '@mui/icons-material/Celebration'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import InfoIcon from '@mui/icons-material/Info'
import MailIcon from '@mui/icons-material/Mail'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/admin/impostazioni', label: 'Impostazioni sito', icon: <SettingsIcon /> },
  { to: '/admin/servizi', label: 'Servizi', icon: <RoomServiceIcon /> },
  { to: '/admin/ricettario', label: 'Ricettario', icon: <RestaurantMenuIcon /> },
  { to: '/admin/eventi', label: 'Eventi', icon: <CelebrationIcon /> },
  { to: '/admin/testimonianze', label: 'Testimonianze', icon: <FormatQuoteIcon /> },
  { to: '/admin/chi-siamo', label: 'Chi siamo', icon: <InfoIcon /> },
  { to: '/admin/messaggi', label: 'Messaggi', icon: <MailIcon /> },
  { to: '/admin/newsletter', label: 'Newsletter', icon: <MarkEmailUnreadIcon /> },
]

export default function AdminSidebar() {
  return (
    <Box
      component="nav"
      sx={{
        width: { xs: '100%', md: 248 },
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        border: '1px solid rgba(28,23,18,0.08)',
        p: 1,
        position: { md: 'sticky' },
        top: { md: 96 },
        alignSelf: { md: 'flex-start' },
      }}
    >
      <List dense disablePadding>
        {NAV_LINKS.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.to === '/admin'}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: '#332A21',
              '&.active': {
                backgroundColor: 'rgba(184,137,62,0.14)',
                color: '#1C1712',
                fontWeight: 600,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.92rem' }}>{item.label}</ListItemText>
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
