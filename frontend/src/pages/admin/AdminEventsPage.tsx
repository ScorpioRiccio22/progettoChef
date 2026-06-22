import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CelebrationIcon from '@mui/icons-material/Celebration'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SchoolIcon from '@mui/icons-material/School'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { addEvent, updateEvent, deleteEvent } from '@/store/slices/contentSlice'
import ImageUploadField from '@/components/admin/ImageUploadField'
import SaveBar from '@/components/admin/SaveBar'
import type { EventType } from '@/types'

const ICON_OPTIONS: { value: EventType['icon']; label: string; Icon: typeof CelebrationIcon }[] = [
  { value: 'private', label: 'Eventi privati', Icon: CelebrationIcon },
  { value: 'corporate', label: 'Eventi aziendali', Icon: BusinessCenterIcon },
  { value: 'catering', label: 'Catering', Icon: RestaurantIcon },
  { value: 'cooking-class', label: 'Cooking class', Icon: SchoolIcon },
]

type EventFormState = Omit<EventType, 'id'> & { id?: string }

const EMPTY_FORM: EventFormState = {
  title: '',
  description: '',
  details: [],
  icon: 'private',
  imageUrl: undefined,
}

export default function AdminEventsPage() {
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.content.events)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<EventFormState>(EMPTY_FORM)
  const [detailsInput, setDetailsInput] = useState('')

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setDetailsInput('')
    setDialogOpen(true)
  }

  const openEdit = (event: EventType) => {
    setForm(event)
    setDetailsInput(event.details.join('\n'))
    setDialogOpen(true)
  }

  const closeDialog = () => setDialogOpen(false)

  const handleSubmit = () => {
    const details = detailsInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const payload = { ...form, details }

    if (form.id) {
      dispatch(updateEvent(payload as EventType))
    } else {
      dispatch(addEvent(payload))
    }
    closeDialog()
  }

  const handleDelete = (id: string) => {
    if (confirm('Eliminare questo evento?')) {
      dispatch(deleteEvent(id))
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, mb: 0.5 }}>
            Eventi
          </Typography>
          <Typography sx={{ color: '#332A21', fontSize: '0.9rem' }}>
            Gestisci le tipologie di evento mostrate sul sito pubblico.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#8A6428' } }}
        >
          Nuovo evento
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        {events.map((event) => {
          const Icon = ICON_OPTIONS.find((opt) => opt.value === event.icon)?.Icon ?? CelebrationIcon
          return (
            <Stack
              key={event.id}
              direction="row"
              alignItems="flex-start"
              spacing={2}
              sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(28,23,18,0.08)',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(184,137,62,0.14)',
                  color: '#8A6428',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon fontSize="small" />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{event.title}</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#332A21', mt: 0.3, mb: 0.5 }}>
                  {event.description}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: 'rgba(28,23,18,0.55)' }}>
                  {event.details.length} dettagli elencati
                </Typography>
              </Box>

              <IconButton onClick={() => openEdit(event)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleDelete(event.id)} size="small" color="error">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          )
        })}
      </Stack>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Modifica evento' : 'Nuovo evento'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <ImageUploadField
              label="Foto dell'evento"
              value={form.imageUrl}
              onChange={(imageUrl) => setForm((prev) => ({ ...prev, imageUrl }))}
            />
            <TextField
              label="Titolo evento"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              select
              label="Icona / tipo evento"
              value={form.icon}
              onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value as EventType['icon'] }))}
              fullWidth
            >
              {ICON_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Descrizione"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Dettagli (uno per riga)"
              value={detailsInput}
              onChange={(event) => setDetailsInput(event.target.value)}
              fullWidth
              multiline
              minRows={4}
              placeholder={'Compleanni e anniversari\nCene romantiche\nPranzi di famiglia'}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog}>Annulla</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.title.trim()}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#8A6428' } }}
          >
            {form.id ? 'Salva modifiche' : 'Crea evento'}
          </Button>
        </DialogActions>
      </Dialog>

      <SaveBar />
    </Box>
  )
}
