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
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { addDish, updateDish, deleteDish } from '@/store/slices/contentSlice'
import ImageUploadField from '@/components/admin/ImageUploadField'
import SaveBar from '@/components/admin/SaveBar'
import type { Dish } from '@/types'

const CATEGORIES: { value: Dish['category']; label: string }[] = [
  { value: 'antipasti', label: 'Antipasto' },
  { value: 'primi', label: 'Primo' },
  { value: 'secondi', label: 'Secondo' },
  { value: 'dolci', label: 'Dolce' },
]

type DishFormState = Omit<Dish, 'id'> & { id?: string }

const EMPTY_FORM: DishFormState = {
  name: '',
  category: 'primi',
  description: '',
  tags: [],
  imageUrl: undefined,
}

export default function AdminDishesPage() {
  const dispatch = useAppDispatch()
  const dishes = useAppSelector((state) => state.content.dishes)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<DishFormState>(EMPTY_FORM)
  const [tagsInput, setTagsInput] = useState('')

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setTagsInput('')
    setDialogOpen(true)
  }

  const openEdit = (dish: Dish) => {
    setForm(dish)
    setTagsInput(dish.tags.join(', '))
    setDialogOpen(true)
  }

  const closeDialog = () => setDialogOpen(false)

  const handleSubmit = () => {
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    const payload = { ...form, tags }

    if (form.id) {
      dispatch(updateDish(payload as Dish))
    } else {
      dispatch(addDish(payload))
    }
    closeDialog()
  }

  const handleDelete = (id: string) => {
    if (confirm('Eliminare questo piatto?')) {
      dispatch(deleteDish(id))
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, mb: 0.5 }}>
            Piatti
          </Typography>
          <Typography sx={{ color: '#332A21', fontSize: '0.9rem' }}>
            Gestisci il ricettario mostrato sul sito pubblico.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#8A6428' } }}
        >
          Nuovo piatto
        </Button>
      </Stack>

      <Stack spacing={1.5}>
        {dishes.map((dish) => (
          <Stack
            key={dish.id}
            direction="row"
            alignItems="center"
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
                width: 56,
                height: 56,
                borderRadius: 1.5,
                backgroundColor: '#F3E9D6',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {dish.imageUrl ? (
                <Box component="img" src={dish.imageUrl} alt={dish.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(28,23,18,0.4)' }}>Nessuna foto</Typography>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontWeight: 600 }}>{dish.name}</Typography>
                <Chip
                  label={CATEGORIES.find((c) => c.value === dish.category)?.label}
                  size="small"
                  sx={{ backgroundColor: 'rgba(184,137,62,0.14)', color: '#8A6428' }}
                />
              </Stack>
              <Typography sx={{ fontSize: '0.85rem', color: '#332A21', mt: 0.3 }}>{dish.description}</Typography>
            </Box>

            <IconButton onClick={() => openEdit(dish)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => handleDelete(dish.id)} size="small" color="error">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Modifica piatto' : 'Nuovo piatto'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <ImageUploadField
              label="Foto del piatto"
              value={form.imageUrl}
              onChange={(imageUrl) => setForm((prev) => ({ ...prev, imageUrl }))}
            />
            <TextField
              label="Nome del piatto"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
              required
            />
            <TextField
              select
              label="Categoria"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as Dish['category'] }))}
              fullWidth
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
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
              label="Tag (separati da virgola)"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              fullWidth
              placeholder="es. tradizione, comfort food"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog}>Annulla</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.name.trim()}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#8A6428' } }}
          >
            {form.id ? 'Salva modifiche' : 'Crea piatto'}
          </Button>
        </DialogActions>
      </Dialog>

      <SaveBar />
    </Box>
  )
}
