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
import {
  adminCreateEventType,
  adminDeleteEventType,
  adminListEventTypes,
  adminReorderEventTypes,
  adminUpdateEventType,
  type EventTypeRequest,
} from '@/services/contentApi'
import ImageUploadField from '@/components/admin/ImageUploadField'
import VideoUploadField from '@/components/admin/VideoUploadField'
import GalleryMediaEditor from '@/components/admin/GalleryMediaEditor'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { EventType } from '@/types'

const EMPTY_FORM: EventTypeRequest = {
  title: '',
  slug: '',
  description: '',
  bodyContent: '',
  icon: '',
  imageUrl: null,
  videoUrl: null,
  details: [],
  galleryImageUrls: [],
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
      slug: item.slug,
      description: item.description,
      bodyContent: item.bodyContent,
      icon: item.icon,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      details: item.details,
      galleryImageUrls: item.galleryImageUrls,
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
      galleryImageUrls: (form.galleryImageUrls ?? []).filter(Boolean),
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
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">Eventi</h1>
          <p className="text-clay">
            Le tipologie di evento mostrate nella pagina "Eventi". Ognuna ha anche una sua landing page dedicata,
            raggiungibile da "Scopri di più" sul sito (per gli eventi "privati" resta volutamente minimale: solo
            foto/video e descrizione breve).
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          className="whitespace-nowrap bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          Nuova tipologia
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
        <p className="text-clay">Nessuna tipologia di evento ancora. Aggiungine una.</p>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <div className="rounded-xl border border-black/10 p-4">
              <div className="flex items-start gap-4">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="h-14 w-14 rounded-md object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{item.title}</p>
                    {!item.published && <Chip label="Non pubblicato" size="small" color="default" />}
                    {item.videoUrl && <Chip label="Video" size="small" className="bg-gold-300 text-ink" />}
                    {item.galleryImageUrls.length > 0 && (
                      <Chip label={`${item.galleryImageUrls.length} foto galleria`} size="small" />
                    )}
                  </div>
                  <p className="text-[0.85rem] text-clay">
                    /eventi/{item.slug} · {item.description}
                  </p>
                  <p className="mt-1 text-[0.78rem] text-clay">{item.details.length} dettagli elencati</p>
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
        <DialogTitle>{editingId ? 'Modifica tipologia evento' : 'Nuova tipologia evento'}</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
            <TextField
              label="Titolo"
              fullWidth
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <TextField
              label="Slug URL (opzionale)"
              fullWidth
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              helperText={`Lascia vuoto per generarlo dal titolo. Landing page: /eventi/${form.slug || '...'}`}
            />
            <TextField
              label="Descrizione breve"
              fullWidth
              multiline
              minRows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              helperText="Mostrata nella card e, per gli eventi 'privati', anche nella landing page"
            />
            <TextField
              label="Testo esteso (landing page)"
              fullWidth
              multiline
              minRows={4}
              value={form.bodyContent}
              onChange={(e) => setForm((p) => ({ ...p, bodyContent: e.target.value }))}
              helperText="Ignorato per gli eventi 'privati' (restano volutamente minimali: solo foto/video e descrizione breve)"
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
            <VideoUploadField
              label="Video (mp4, opzionale)"
              value={form.videoUrl ?? null}
              onChange={(url) => setForm((p) => ({ ...p, videoUrl: url }))}
            />

            <GalleryMediaEditor
              label="Galleria immagini/video (landing page)"
              helperText="Mostrata sul sito come carosello con autoplay. Puoi aggiungere sia immagini che video."
              value={form.galleryImageUrls ?? []}
              onChange={(urls) => setForm((p) => ({ ...p, galleryImageUrls: urls }))}
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
            disabled={saving || !form.title}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
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
    </div>
  )
}
