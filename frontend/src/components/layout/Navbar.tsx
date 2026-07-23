import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Button, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { NAV_ITEMS, useSiteContent } from '@/hooks/useSiteContent'

export default function Navbar() {
  const { brand, contact } = useSiteContent()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

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
        className={`!shadow-none transition-all duration-300 ${
          isTransparent ? '!bg-transparent' : '!border-b !border-ink/[.08] !bg-ivory/[.92] backdrop-blur-md'
        }`}
      >
        <Toolbar className="justify-between px-4 py-2 md:px-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 border-none bg-none p-0" aria-label="Torna alla home">
            <div
              className={`flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full border-[1.5px] ${
                isTransparent ? 'border-ivory text-ivory' : 'border-gold-500 text-gold-500'
              }`}
            >
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt={brand.name} className="h-full w-full object-cover" />
              ) : (
                <VesuvioMark className="h-8 w-8" color="currentColor" />
              )}
            </div>
            <div className="text-left">
              <p className={`font-display text-[1.05rem] font-semibold leading-tight ${isTransparent ? 'text-ivory' : 'text-ink'}`}>
                {brand.name}
              </p>
              <p className={`text-[0.68rem] uppercase tracking-[0.16em] ${isTransparent ? 'text-ivory/75' : 'text-gold-600'}`}>
                {brand.role} · {brand.city}
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                onClick={() => goToSection(item.sectionId, item.path)}
                className={`rounded-full px-4 text-[0.92rem] font-medium normal-case ${
                  isTransparent
                    ? 'text-ivory hover:bg-ivory/[.12]'
                    : 'text-ink hover:bg-gold-500/10'
                }`}
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
              className="ml-3 bg-gold-500 text-ink normal-case hover:bg-gold-600"
            >
              Scrivimi
            </Button>
          </div>

          <IconButton
            className={`flex lg:hidden ${isTransparent ? 'text-ivory' : 'text-ink'}`}
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
        PaperProps={{ className: 'w-[280px] bg-ink text-ivory' }}
      >
        <div className="flex justify-end p-4">
          <IconButton onClick={() => setDrawerOpen(false)} className="text-ivory" aria-label="Chiudi il menu">
            <CloseIcon />
          </IconButton>
        </div>
        <List className="px-2">
          {NAV_ITEMS.map((item) => (
            <ListItemButton key={item.label} onClick={() => goToSection(item.sectionId, item.path)} className="rounded-lg">
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '1.05rem' }} />
            </ListItemButton>
          ))}
        </List>
        <div className="mt-auto p-4">
          <Button
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            startIcon={<WhatsAppIcon />}
            variant="contained"
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            Scrivimi su WhatsApp
          </Button>
        </div>
      </Drawer>
    </>
  )
}
