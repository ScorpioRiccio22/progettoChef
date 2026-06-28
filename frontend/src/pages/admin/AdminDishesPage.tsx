import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  adminCreateDish,
  adminDeleteDish,
  adminListDishes,
  adminReorderDishes,
  adminUpdateDish,
  type DishRequest,
} from '@/services/contentApi'
import ImageUploadField from '@/components/admin/ImageUploadField'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { Dish } from '@/types'

const CATEGORIES = [
  { value: 'antipasti', label: 'Antipasti' },
  { value: 'primi', label: 'Primi' },
  { value: 'secondi', label: 'Secondi' },
  { value: 'dolci', label: 'Dolci' },
]

const EMPTY_FORM: DishRequest = {
  name: '',
  category: 'primi',
  description: '',
  imageUrl: null,
  tags: [],
  published: true,
}

export default function AdminDishesPage() {
  const [items, setItems] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<DishRequest>(EMPTY_FORM)
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Dish | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminListDishes()
      .then(setItems)
      .catch(() => setError('Impossibile caricare il ricettario'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setTagsInput('')
    setDialogOpen(true)
  }

  const openEdit = (item: Dish) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      tags: item.tags,
      published: item.published,
    })
    setTagsInput(item.tags.join(', '))
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: DishRequest = {
      ...form,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    try {
      if (editingId) {
        await adminUpdateDish(editingId, payload)
      } else {
        await adminCreateDish(payload)
      }
      setDialogOpen(false)
      load()
    } catch {
      setError('Salvataggio non riuscito')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminDeleteDish(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch {
      setError('Eliminazione non riuscita')
    } finally {
      setDeleting(false)
    }
  }

  const handleReorder = async (orderedIds: number[]) => {
    setItems((prev) => orderedIds.map((id) => prev.find((i) => i.id === id)!).filter(Boolean))
    await adminReorderDishes(orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Ricettario
          </Typography>
          <Typography sx={{ color: '#5C5246' }}>I piatti mostrati nella pagina "Ricettario".</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
        >
          Nuovo piatto
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography sx={{ color: '#5C5246' }}>Nessun piatto ancora. Aggiungine uno.</Typography>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {item.imageUrl && (
                  <Box component="img" src={item.imageUrl} alt="" sx={{ width: 56, height: 56, borderRadius: 1.5, objectFit: 'cover' }} />
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    <Chip label={CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category} size="small" />
                    {!item.published && <Chip label="Non pubblicato" size="small" color="default" />}
                  </Stack>
                  <Typography sx={{ color: '#5C5246', fontSize: '0.85rem' }} noWrap>
                    {item.tags.join(' · ')}
                  </Typography>
                </Box>
                <IconButton onClick={() => openEdit(item)} aria-label="Modifica">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteTarget(item)} aria-label="Elimina">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          )}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Modifica piatto' : 'Nuovo piatto'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              fullWidth
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <TextField
              select
              label="Categoria"
              fullWidth
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Descrizione"
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            <TextField
              label="Tag (separati da virgola)"
              fullWidth
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              helperText="Es: tradizione, comfort food"
            />
            <ImageUploadField
              label="Immagine"
              value={form.imageUrl ?? null}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.published ?? true}
                  onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                />
              }
              label="Pubblicato (visibile sul sito)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.name}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemLabel={deleteTarget?.name ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  )
}
