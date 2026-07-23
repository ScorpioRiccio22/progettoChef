import { useEffect, useState } from 'react'
import {
  Alert,
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
  Switch,
  TextField,
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
      .catch(() => setError('Impossibile caricare "A MoDo mio"'))
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
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">A MoDo mio</h1>
          <p className="text-clay">I piatti mostrati nella pagina "A MoDo mio".</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          className="whitespace-nowrap bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          Nuovo piatto
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : items.length === 0 ? (
        <p className="text-clay">Nessun piatto ancora. Aggiungine uno.</p>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <div className="rounded-xl border border-black/10 p-4">
              <div className="flex items-center gap-4">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="h-14 w-14 rounded-md object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.name}</p>
                    <Chip label={CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category} size="small" />
                    {!item.published && <Chip label="Non pubblicato" size="small" color="default" />}
                  </div>
                  <p className="truncate text-[0.85rem] text-clay">{item.tags.join(' · ')}</p>
                </div>
                <IconButton onClick={() => openEdit(item)} aria-label="Modifica">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteTarget(item)} aria-label="Elimina">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          )}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Modifica piatto' : 'Nuovo piatto'}</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving} className="normal-case">
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.name}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
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
    </div>
  )
}
