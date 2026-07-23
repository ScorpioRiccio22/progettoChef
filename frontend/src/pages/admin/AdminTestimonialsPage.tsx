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
  Switch,
  TextField,
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
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">Testimonianze (fallback)</h1>
          <p className="text-clay">
            Mostrate sul sito solo se le recensioni Google non sono configurate o non disponibili. Per le recensioni
            Google vere e proprie, imposta la chiave API in <strong>Impostazioni sito</strong>.
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          className="whitespace-nowrap bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          Nuova testimonianza
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
        <p className="text-clay">Nessuna testimonianza ancora. Aggiungine una.</p>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <div className="rounded-xl border border-black/10 p-4">
              <div className="flex items-start gap-4">
                <FormatQuoteIcon className="mt-0.5 text-gold-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-[0.8rem] text-clay">· {item.role}</p>
                    {!item.published && <Chip label="Non pubblicato" size="small" color="default" />}
                  </div>
                  <p className="text-[0.88rem] text-clay">{item.quote}</p>
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
        <DialogTitle>{editingId ? 'Modifica testimonianza' : 'Nuova testimonianza'}</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving} className="normal-case">
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.author || !form.quote}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
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
    </div>
  )
}
