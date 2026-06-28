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
  adminCreateEventType,
  adminDeleteEventType,
  adminListEventTypes,
  adminReorderEventTypes,
  adminUpdateEventType,
  type EventTypeRequest,
} from '@/services/contentApi'
import ImageUploadField from '@/components/admin/ImageUploadField'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { EventType } from '@/types'

const EMPTY_FORM: EventTypeRequest = {
  title: '',
  description: '',
  icon: '',
  imageUrl: null,
  details: [],
  published: true,
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventTypeRequest>(EMPTY_FORM)
  const [detailsInput, setDetailsInput] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<EventType | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminListEventTypes()
      .then(setItems)
      .catch(() => setError('Impossibile caricare gli eventi'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setDetailsInput('')
    setDialogOpen(true)
  }

  const openEdit = (item: EventType) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      description: item.description,
      icon: item.icon,
      imageUrl: item.imageUrl,
      details: item.details,
      published: item.published,
    })
    setDetailsInput(item.details.join('\n'))
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: EventTypeRequest = {
      ...form,
      details: detailsInput
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean),
    }
    try {
      if (editingId) {
        await adminUpdateEventType(editingId, payload)
      } else {
        await adminCreateEventType(payload)
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
      await adminDeleteEventType(deleteTarget.id)
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
    await adminReorderEventTypes(orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Eventi
          </Typography>
          <Typography sx={{ color: '#5C5246' }}>Le tipologie di evento mostrate nella pagina "Eventi".</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
        >
          Nuova tipologia
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
        <Typography sx={{ color: '#5C5246' }}>Nessuna tipologia di evento ancora. Aggiungine una.</Typography>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {item.imageUrl && (
                  <Box component="img" src={item.imageUrl} alt="" sx={{ width: 56, height: 56, borderRadius: 1.5, objectFit: 'cover' }} />
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    {!item.published && <Chip label="Non pubblicato" size="small" color="default" />}
                  </Stack>
                  <Typography sx={{ color: '#5C5246', fontSize: '0.85rem' }}>{item.description}</Typography>
                  <Typography sx={{ color: '#8A7F70', fontSize: '0.78rem', mt: 0.5 }}>
                    {item.details.length} dettagli elencati
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
        <DialogTitle>{editingId ? 'Modifica tipologia evento' : 'Nuova tipologia evento'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Titolo"
              fullWidth
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <TextField
              label="Descrizione"
              fullWidth
              multiline
              minRows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            <TextField
              label="Icona (nome, es. private / corporate / catering / cooking-class)"
              fullWidth
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
            />
            <TextField
              label="Dettagli (uno per riga)"
              fullWidth
              multiline
              minRows={4}
              value={detailsInput}
              onChange={(e) => setDetailsInput(e.target.value)}
              helperText="Ogni riga diventa un punto elenco nella card dell'evento"
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
            disabled={saving || !form.title}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemLabel={deleteTarget?.title ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  )
}
