import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  adminCreateCoreValue,
  adminCreateMilestone,
  adminDeleteCoreValue,
  adminDeleteMilestone,
  adminListCoreValues,
  adminListMilestones,
  adminReorderCoreValues,
  adminReorderMilestones,
  adminUpdateCoreValue,
  adminUpdateMilestone,
  type CoreValueRequest,
  type MilestoneRequest,
} from '@/services/contentApi'
import ReorderableList from '@/components/admin/ReorderableList'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { CoreValue, Milestone } from '@/types'

const EMPTY_MILESTONE: MilestoneRequest = { year: '', text: '' }
const EMPTY_VALUE: CoreValueRequest = { title: '', text: '' }

export default function AdminAboutPage() {
  // --- Milestones --------------------------------------------------------
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loadingMilestones, setLoadingMilestones] = useState(true)
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false)
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(null)
  const [milestoneForm, setMilestoneForm] = useState<MilestoneRequest>(EMPTY_MILESTONE)
  const [deleteMilestoneTarget, setDeleteMilestoneTarget] = useState<Milestone | null>(null)

  // --- Core values ---------------------------------------------------------
  const [values, setValues] = useState<CoreValue[]>([])
  const [loadingValues, setLoadingValues] = useState(true)
  const [valueDialogOpen, setValueDialogOpen] = useState(false)
  const [editingValueId, setEditingValueId] = useState<number | null>(null)
  const [valueForm, setValueForm] = useState<CoreValueRequest>(EMPTY_VALUE)
  const [deleteValueTarget, setDeleteValueTarget] = useState<CoreValue | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMilestones = () => {
    setLoadingMilestones(true)
    adminListMilestones()
      .then(setMilestones)
      .catch(() => setError('Impossibile caricare le tappe del percorso'))
      .finally(() => setLoadingMilestones(false))
  }

  const loadValues = () => {
    setLoadingValues(true)
    adminListCoreValues()
      .then(setValues)
      .catch(() => setError('Impossibile caricare i principi della cucina'))
      .finally(() => setLoadingValues(false))
  }

  useEffect(() => {
    loadMilestones()
    loadValues()
  }, [])

  // --- Handlers milestones ------------------------------------------------

  const openCreateMilestone = () => {
    setEditingMilestoneId(null)
    setMilestoneForm(EMPTY_MILESTONE)
    setMilestoneDialogOpen(true)
  }

  const openEditMilestone = (item: Milestone) => {
    setEditingMilestoneId(item.id)
    setMilestoneForm({ year: item.year, text: item.text })
    setMilestoneDialogOpen(true)
  }

  const saveMilestone = async () => {
    setSaving(true)
    try {
      if (editingMilestoneId) {
        await adminUpdateMilestone(editingMilestoneId, milestoneForm)
      } else {
        await adminCreateMilestone(milestoneForm)
      }
      setMilestoneDialogOpen(false)
      loadMilestones()
    } catch {
      setError('Salvataggio non riuscito')
    } finally {
      setSaving(false)
    }
  }

  const deleteMilestone = async () => {
    if (!deleteMilestoneTarget) return
    try {
      await adminDeleteMilestone(deleteMilestoneTarget.id)
      setDeleteMilestoneTarget(null)
      loadMilestones()
    } catch {
      setError('Eliminazione non riuscita')
    }
  }

  const reorderMilestones = async (orderedIds: number[]) => {
    setMilestones((prev) => orderedIds.map((id) => prev.find((i) => i.id === id)!).filter(Boolean))
    await adminReorderMilestones(orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  // --- Handlers core values ------------------------------------------------

  const openCreateValue = () => {
    setEditingValueId(null)
    setValueForm(EMPTY_VALUE)
    setValueDialogOpen(true)
  }

  const openEditValue = (item: CoreValue) => {
    setEditingValueId(item.id)
    setValueForm({ title: item.title, text: item.text })
    setValueDialogOpen(true)
  }

  const saveValue = async () => {
    setSaving(true)
    try {
      if (editingValueId) {
        await adminUpdateCoreValue(editingValueId, valueForm)
      } else {
        await adminCreateCoreValue(valueForm)
      }
      setValueDialogOpen(false)
      loadValues()
    } catch {
      setError('Salvataggio non riuscito')
    } finally {
      setSaving(false)
    }
  }

  const deleteValue = async () => {
    if (!deleteValueTarget) return
    try {
      await adminDeleteCoreValue(deleteValueTarget.id)
      setDeleteValueTarget(null)
      loadValues()
    } catch {
      setError('Eliminazione non riuscita')
    }
  }

  const reorderValues = async (orderedIds: number[]) => {
    setValues((prev) => orderedIds.map((id) => prev.find((i) => i.id === id)!).filter(Boolean))
    await adminReorderCoreValues(orderedIds).catch(() => setError('Riordino non salvato, riprova'))
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600, mb: 0.5 }}>
        Chi siamo
      </Typography>
      <Typography sx={{ color: '#5C5246', mb: 3 }}>
        Tappe del percorso e principi della cucina. I testi introduttivi e le statistiche si modificano in{' '}
        <strong>Impostazioni sito</strong>.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Milestones */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 700 }}>Tappe del percorso</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={openCreateMilestone}>
          Aggiungi tappa
        </Button>
      </Stack>

      {!loadingMilestones && milestones.length === 0 && (
        <Typography sx={{ color: '#5C5246', mb: 2 }}>Nessuna tappa ancora.</Typography>
      )}

      <ReorderableList
        items={milestones}
        onReorder={reorderMilestones}
        renderItem={(item) => (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography sx={{ fontWeight: 700, color: '#B8893E', minWidth: 56 }}>{item.year}</Typography>
              <Typography sx={{ flex: 1, color: '#332A21' }}>{item.text}</Typography>
              <IconButton onClick={() => openEditMilestone(item)} aria-label="Modifica">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setDeleteMilestoneTarget(item)} aria-label="Elimina">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        )}
      />

      <Divider sx={{ my: 4 }} />

      {/* Core values */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 700 }}>Principi della cucina</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={openCreateValue}>
          Aggiungi principio
        </Button>
      </Stack>

      {!loadingValues && values.length === 0 && (
        <Typography sx={{ color: '#5C5246', mb: 2 }}>Nessun principio ancora.</Typography>
      )}

      <ReorderableList
        items={values}
        onReorder={reorderValues}
        renderItem={(item) => (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                <Typography sx={{ color: '#5C5246', fontSize: '0.88rem' }}>{item.text}</Typography>
              </Box>
              <IconButton onClick={() => openEditValue(item)} aria-label="Modifica">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setDeleteValueTarget(item)} aria-label="Elimina">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        )}
      />

      {/* Dialog tappa */}
      <Dialog open={milestoneDialogOpen} onClose={() => setMilestoneDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMilestoneId ? 'Modifica tappa' : 'Nuova tappa'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Anno (o 'Oggi')"
              fullWidth
              value={milestoneForm.year}
              onChange={(e) => setMilestoneForm((p) => ({ ...p, year: e.target.value }))}
              required
            />
            <TextField
              label="Testo"
              fullWidth
              multiline
              minRows={2}
              value={milestoneForm.text}
              onChange={(e) => setMilestoneForm((p) => ({ ...p, text: e.target.value }))}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMilestoneDialogOpen(false)} disabled={saving}>
            Annulla
          </Button>
          <Button
            onClick={saveMilestone}
            variant="contained"
            disabled={saving || !milestoneForm.year || !milestoneForm.text}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog principio */}
      <Dialog open={valueDialogOpen} onClose={() => setValueDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingValueId ? 'Modifica principio' : 'Nuovo principio'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Titolo"
              fullWidth
              value={valueForm.title}
              onChange={(e) => setValueForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <TextField
              label="Testo"
              fullWidth
              multiline
              minRows={2}
              value={valueForm.text}
              onChange={(e) => setValueForm((p) => ({ ...p, text: e.target.value }))}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValueDialogOpen(false)} disabled={saving}>
            Annulla
          </Button>
          <Button
            onClick={saveValue}
            variant="contained"
            disabled={saving || !valueForm.title || !valueForm.text}
            sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
          >
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteMilestoneTarget}
        itemLabel={deleteMilestoneTarget?.year ?? ''}
        onCancel={() => setDeleteMilestoneTarget(null)}
        onConfirm={deleteMilestone}
      />
      <ConfirmDeleteDialog
        open={!!deleteValueTarget}
        itemLabel={deleteValueTarget?.title ?? ''}
        onCancel={() => setDeleteValueTarget(null)}
        onConfirm={deleteValue}
      />
    </Box>
  )
}
