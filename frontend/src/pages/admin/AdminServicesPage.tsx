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
  adminCreateService,
  adminDeleteService,
  adminListServices,
  adminReorderServices,
  adminUpdateService,
  type ServiceOfferingRequest,
} from '@/services/contentApi'
import ImageUploadField from '@/components/admin/ImageUploadField'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { ServiceOffering } from '@/types'

const EMPTY_FORM: ServiceOfferingRequest = {
  title: '',
  tagline: '',
  description: '',
  icon: '',
  imageUrl: null,
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
      tagline: item.tagline,
      description: item.description,
      icon: item.icon,
      imageUrl: item.imageUrl,
      published: item.published,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await adminUpdateService(editingId, form)
      } else {
        await adminCreateService(form)
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
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Servizi
          </Typography>
          <Typography sx={{ color: '#5C5246' }}>
            I servizi mostrati nella sezione "Servizi" della home page.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
        >
          Nuovo servizio
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
        <Typography sx={{ color: '#5C5246' }}>Nessun servizio ancora. Aggiungine uno.</Typography>
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    {!item.published && <Chip label="Non pubblicato" size="small" color="default" />}
                  </Stack>
                  <Typography sx={{ color: '#5C5246', fontSize: '0.85rem' }} noWrap>
                    {item.tagline}
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
        <DialogTitle>{editingId ? 'Modifica servizio' : 'Nuovo servizio'}</DialogTitle>
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
              label="Tagline"
              fullWidth
              value={form.tagline}
              onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
            />
            <TextField
              label="Descrizione"
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            <TextField
              label="Icona (nome, es. home / event / business)"
              fullWidth
              value={form.icon}
              onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
              helperText="Usata dal frontend per scegliere l'icona da mostrare"
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
