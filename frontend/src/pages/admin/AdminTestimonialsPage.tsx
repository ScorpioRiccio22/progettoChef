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
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import {
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminListTestimonials,
  adminReorderTestimonials,
  adminUpdateTestimonial,
  type TestimonialRequest,
} from '@/services/contentApi'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { Testimonial } from '@/types'

const EMPTY_FORM: TestimonialRequest = { author: '', role: '', quote: '', published: true }

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<TestimonialRequest>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminListTestimonials()
      .then(setItems)
      .catch(() => setError('Impossibile caricare le testimonianze'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id)
    setForm({ author: item.author, role: item.role, quote: item.quote, published: item.published })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await adminUpdateTestimonial(editingId, form)
      } else {
        await adminCreateTestimonial(form)
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
      await adminDeleteTestimonial(deleteTarget.id)
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
    await adminReorderTestimonials(orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Testimonianze
          </Typography>
          <Typography sx={{ color: '#5C5246' }}>Le recensioni dei clienti mostrate sul sito.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
        >
          Nuova testimonianza
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
        <Typography sx={{ color: '#5C5246' }}>Nessuna testimonianza ancora. Aggiungine una.</Typography>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <FormatQuoteIcon sx={{ color: '#B8893E', mt: 0.5 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 600 }}>{item.author}</Typography>
                    <Typography sx={{ color: '#8A7F70', fontSize: '0.8rem' }}>· {item.role}</Typography>
                    {!item.published && <Chip label="Non pubblicato" size="small" color="default" />}
                  </Stack>
                  <Typography sx={{ color: '#5C5246', fontSize: '0.88rem' }}>{item.quote}</Typography>
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
        <DialogTitle>{editingId ? 'Modifica testimonianza' : 'Nuova testimonianza'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Autore"
              fullWidth
              value={form.author}
              onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
              required
            />
            <TextField
              label="Ruolo / occasione (es. Cena di compleanno)"
              fullWidth
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            />
            <TextField
              label="Testo della recensione"
              fullWidth
              multiline
              minRows={3}
              value={form.quote}
              onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.published ?? true}
                  onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                />
              }
              label="Pubblicata (visibile sul sito)"
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
            disabled={saving || !form.author || !form.quote}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemLabel={deleteTarget?.author ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  )
}
