import { NavLink } from 'react-router-dom'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CelebrationIcon from '@mui/icons-material/Celebration'
import RestaurantMenuIcon2 from '@mui/icons-material/MenuBook'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import InfoIcon from '@mui/icons-material/Info'
import MailIcon from '@mui/icons-material/Mail'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import { useAppSelector } from '@/hooks/redux'
import type { AdminRole } from '@/types'

interface NavLinkItem {
  to: string
  label: string
  icon: JSX.Element
  /** Se omesso, la voce è visibile a tutti i ruoli admin. */
  roles?: AdminRole[]
}

// Il ruolo EDITOR ("solo grafica") vede solo i contenuti visivi del sito:
// piatti, servizi, eventi, testimonianze, la mia storia e i testi del sito.
// Impostazioni, messaggi, newsletter e gestione account restano riservati ad
// ADMIN/SUPERADMIN.
const NAV_LINKS: NavLinkItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/admin/impostazioni', label: 'Impostazioni sito', icon: <SettingsIcon />, roles: ['ADMIN', 'SUPERADMIN'] },
  { to: '/admin/testi', label: 'Testi del sito', icon: <TextFieldsIcon /> },
  { to: '/admin/servizi', label: 'Servizi', icon: <RoomServiceIcon /> },
  { to: '/admin/a-modo-mio', label: 'A MoDo mio', icon: <RestaurantMenuIcon /> },
  { to: '/admin/a-modo-mio/menu', label: 'Menu del negozio', icon: <StorefrontIcon /> },
  { to: '/admin/eventi', label: 'Eventi', icon: <CelebrationIcon /> },
  { to: '/admin/eventi/menu', label: 'Menu eventi', icon: <RestaurantMenuIcon2 /> },
  { to: '/admin/testimonianze', label: 'Testimonianze', icon: <FormatQuoteIcon /> },
  { to: '/admin/la-mia-storia', label: 'La mia storia', icon: <InfoIcon /> },
  { to: '/admin/messaggi', label: 'Messaggi', icon: <MailIcon />, roles: ['ADMIN', 'SUPERADMIN'] },
  { to: '/admin/newsletter', label: 'Newsletter', icon: <MarkEmailUnreadIcon />, roles: ['ADMIN', 'SUPERADMIN'] },
  { to: '/admin/account', label: 'Gestione account', icon: <AdminPanelSettingsIcon />, roles: ['SUPERADMIN'] },
]

export default function AdminSidebar() {
  const role = useAppSelector((state) => state.auth.user?.role)
  const links = NAV_LINKS.filter((item) => !item.roles || (role && item.roles.includes(role)))

  return (
    <nav className="w-full flex-shrink-0 self-start rounded-2xl border border-ink/[0.08] bg-white p-2 md:sticky md:top-24 md:w-[248px]">
      <List dense disablePadding>
        {links.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.to === '/admin' || item.to === '/admin/a-modo-mio' || item.to === '/admin/eventi'}
            className="mb-1 rounded-xl text-ink-soft [&.active]:bg-gold-500/[.14] [&.active]:font-semibold [&.active]:text-ink"
          >
            <ListItemIcon className="min-w-[36px] text-inherit">{item.icon}</ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.92rem' }}>{item.label}</ListItemText>
          </ListItemButton>
        ))}
      </List>
    </nav>
  )
}
