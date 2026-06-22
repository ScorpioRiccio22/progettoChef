import { useState } from 'react'
import {
  Box, Button, Chip, Collapse, Divider, IconButton, MenuItem,
  Select, Stack, TextField, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import HomeIcon from '@mui/icons-material/Home'
import CelebrationIcon from '@mui/icons-material/Celebration'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { addService, updateService, deleteService } from '@/store/slices/contentSlice'
import SaveBar from '@/components/admin/SaveBar'
import type { ServiceOffering } from '@/types'

const ICON_OPTIONS: { value: ServiceOffering['icon']; label: string; Icon: typeof HomeIcon }[] = [
  { value: 'home', label: 'Casa / Domicilio', Icon: HomeIcon },
  { value: 'event', label: 'Evento', Icon: CelebrationIcon },
  { value: 'business', label: 'Business / Start-up', Icon: TrendingUpIcon },
]

function ServiceCard({ service }: { service: ServiceOffering }) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)

  const update = (patch: Partial<ServiceOffering>) =>
    dispatch(updateService({ ...service, ...patch }))

  return (
    <Box sx={{ backgroundColor: '#FBF6EC', borderRadius: 2, border: '1px solid rgba(28,23,18,0.1)', overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ px: 2.5, py: 2, cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
      >
        {ICON_OPTIONS.find((o) => o.value === service.icon)?.Icon &&
          (() => {
            const { Icon } = ICON_OPTIONS.find((o) => o.value === service.icon)!
            return <Icon sx={{ color: '#8A6428', flexShrink: 0 }} />
          })()
        }
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, color: '#1C1712' }} noWrap>{service.title || 'Nuovo servizio'}</Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#8A6428' }} noWrap>{service.tagline}</Typography>
        </Box>
        <Tooltip title="Elimina servizio">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => { e.stopPropagation(); dispatch(deleteService(service.id)) }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <IconButton size="small" onClick={() => setOpen((o) => !o)}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>

      <Collapse in={open}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              size="small"
              label="Titolo"
              value={service.title}
              onChange={(e) => update({ title: e.target.value })}
              fullWidth
            />
            <Select
              size="small"
              value={service.icon}
              onChange={(e) => update({ icon: e.target.value as ServiceOffering['icon'] })}
              sx={{ minWidth: 180 }}
            >
              {ICON_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </Stack>
          <TextField
            size="small"
            label="Tagline (breve slogan)"
            value={service.tagline}
            onChange={(e) => update({ tagline: e.target.value })}
            fullWidth
          />
          <TextField
            size="small"
            label="Descrizione"
            value={service.description}
            onChange={(e) => update({ description: e.target.value })}
            fullWidth
            multiline
            minRows={3}
          />
        </Stack>
      </Collapse>
    </Box>
  )
}

export default function AdminServicesPage() {
  const dispatch = useAppDispatch()
  const services = useAppSelector((state) => state.content.services)

  const handleAdd = () => {
    dispatch(addService({ title: 'Nuovo servizio', tagline: '', description: '', icon: 'home' }))
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, mb: 0.5 }}>
        Servizi
      </Typography>
      <Typography sx={{ color: '#332A21', mb: 4, fontSize: '0.9rem' }}>
        Gestisci i servizi mostrati nella sezione Servizi della Home. Clicca su una card per espanderla e modificarla.
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </Stack>

      <Button
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ color: '#8A6428', borderColor: '#B8893E', border: '1px dashed', borderRadius: 2, px: 3, py: 1.2 }}
      >
        Aggiungi servizio
      </Button>

      <SaveBar />
    </Box>
  )
}
