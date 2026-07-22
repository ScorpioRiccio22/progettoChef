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
  adminCreateService,
  adminDeleteService,
  adminListServices,
  adminReorderServices,
  adminUpdateService,
  type ServiceOfferingRequest,
} from '@/services/contentApi'
import ImageUploadField from '@/components/admin/ImageUploadField'
import VideoUploadField from '@/components/admin/VideoUploadField'
import GalleryMediaEditor from '@/components/admin/GalleryMediaEditor'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { ServiceOffering } from '@/types'

const EMPTY_FORM: ServiceOfferingRequest = {
  title: '',
  slug: '',
  tagline: '',
  description: '',
  bodyContent: '',
  icon: '',
  imageUrl: null,
  videoUrl: null,
  galleryImageUrls: [],
  published: true,
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceOffering[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ServiceOfferingRequest>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<ServiceOffering | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminListServices()
      .then(setItems)
      .catch(() => setError('Impossibile caricare i servizi'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (item: ServiceOffering) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      slug: item.slug,
      tagline: item.tagline,
      description: item.description,
      bodyContent: item.bodyContent,
      icon: item.icon,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      galleryImageUrls: item.galleryImageUrls,
      published: item.published,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: ServiceOfferingRequest = {
      ...form,
      galleryImageUrls: (form.galleryImageUrls ?? []).filter(Boolean),
    }
    try {
      if (editingId) {
        await adminUpdateService(editingId, payload)
      } else {
        await adminCreateService(payload)
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
      await adminDeleteService(deleteTarget.id)
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
    await adminReorderServices(orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">Servizi</h1>
          <p className="text-clay">
            I servizi mostrati in home e nella pagina "Servizi". Ogni servizio ha anche una sua pagina di dettaglio
            (testo esteso, video e galleria immagini), raggiungibile cliccando sulla card sul sito.
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          className="whitespace-nowrap bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          Nuovo servizio
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
        <p className="text-clay">Nessun servizio ancora. Aggiungine uno.</p>
      ) : (
        <ReorderableList
          items={items}
          onReorder={handleReorder}
          renderItem={(item) => (
            <div className="rounded-xl border border-black/10 p-4">
              <div className="flex items-center gap-4">
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
                  <p className="truncate text-[0.85rem] text-clay">
                    /servizi/{item.slug} · {item.tagline}
                  </p>
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
        <DialogTitle>{editingId ? 'Modifica servizio' : 'Nuovo servizio'}</DialogTitle>
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
              helperText={`Lascia vuoto per generarlo dal titolo. Pagina pubblica: /servizi/${form.slug || '...'}`}
            />
            <TextField
              label="Tagline"
              fullWidth
              value={form.tagline}
              onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
            />
            <TextField
              label="Descrizione breve"
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              helperText="Mostrata nelle card di anteprima (home e pagina Servizi)"
            />
            <TextField
              label="Testo esteso (pagina di dettaglio)"
              fullWidth
              multiline
              minRows={5}
              value={form.bodyContent}
              onChange={(e) => setForm((p) => ({ ...p, bodyContent: e.target.value }))}
              helperText="Vai a capo due volte per separare i paragrafi. Se lasciato vuoto, viene usata la descrizione breve."
            />
            <TextField
              label="Icona (nome, es. home / event / business)"
              fullWidth
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
              helperText="Usata dal frontend per scegliere l'icona da mostrare"
            />
            <ImageUploadField
              label="Immagine di copertina"
              value={form.imageUrl ?? null}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
            />
            <VideoUploadField
              label="Video (mp4, opzionale, mostrato nella pagina di dettaglio)"
              value={form.videoUrl ?? null}
              onChange={(url) => setForm((p) => ({ ...p, videoUrl: url }))}
            />

            <GalleryMediaEditor
              label="Galleria immagini/video (pagina di dettaglio)"
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
