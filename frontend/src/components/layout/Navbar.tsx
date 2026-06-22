import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { NAV_ITEMS, BRAND } from '@/lib/content'
import { useAppSelector } from '@/hooks/redux'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const contact = useAppSelector((state) => state.content.contact)
  const images = useAppSelector((state) => state.content.images)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (sectionId: string, path: string) => {
    setDrawerOpen(false)
    if (location.pathname === '/' && path === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (path === '/') {
      navigate('/')
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
      return
    }
    navigate(path)
  }

  const isTransparent = !scrolled && location.pathname === '/'

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: isTransparent ? 'transparent' : 'rgba(251,246,236,0.92)',
          backdropFilter: isTransparent ? 'none' : 'blur(10px)',
          borderBottom: isTransparent ? 'none' : '1px solid rgba(28,23,18,0.08)',
          transition: 'all 0.35s ease',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 2, md: 4 } }}>
          <Box
            component="button"
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              p: 0,
            }}
            aria-label="Torna alla home"
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: `1.5px solid ${isTransparent ? '#FBF6EC' : '#B8893E'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isTransparent ? '#FBF6EC' : '#B8893E',
                overflow: 'hidden',
              }}
            >
              {images.logo ? (
                <Box component="img" src={images.logo} alt="Logo" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <VesuvioMark className="w-5 h-3" color="currentColor" />
              )}
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", serif',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  color: isTransparent ? '#FBF6EC' : '#1C1712',
                  lineHeight: 1.1,
                }}
              >
                {BRAND.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: isTransparent ? 'rgba(251,246,236,0.75)' : '#8A6428',
                }}
              >
                {BRAND.role} · {BRAND.city}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                onClick={() => goToSection(item.sectionId, item.path)}
                sx={{
                  color: isTransparent ? '#FBF6EC' : '#1C1712',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  borderRadius: 999,
                  px: 1.8,
                  '&:hover': {
                    backgroundColor: isTransparent ? 'rgba(251,246,236,0.12)' : 'rgba(184,137,62,0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon />}
              variant="contained"
              sx={{
                ml: 1.5,
                backgroundColor: '#B8893E',
                color: '#1C1712',
                '&:hover': { backgroundColor: '#8A6428' },
              }}
            >
              Scrivimi
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: 'flex', lg: 'none' }, color: isTransparent ? '#FBF6EC' : '#1C1712' }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Apri il menu di navigazione"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, backgroundColor: '#1C1712', color: '#FBF6EC' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#FBF6EC' }} aria-label="Chiudi il menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton key={item.label} onClick={() => goToSection(item.sectionId, item.path)} sx={{ borderRadius: 2 }}>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '1.05rem' }} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            startIcon={<WhatsAppIcon />}
            variant="contained"
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            Scrivimi su WhatsApp
          </Button>
        </Box>
      </Drawer>
    </>
  )
}
