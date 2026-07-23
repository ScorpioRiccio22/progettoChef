import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
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
    <div>
      <h1 className="mb-1 font-display text-xl font-semibold">La mia storia</h1>
      <p className="mb-6 text-clay">
        Tappe del percorso e principi della cucina. I testi introduttivi e le statistiche si modificano in{' '}
        <strong>Impostazioni sito</strong>.
      </p>

      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Milestones */}
      <div className="mb-3 flex items-center justify-between">
        <p className="font-bold">Tappe del percorso</p>
        <Button size="small" startIcon={<AddIcon />} onClick={openCreateMilestone} className="normal-case">
          Aggiungi tappa
        </Button>
      </div>

      {!loadingMilestones && milestones.length === 0 && <p className="mb-3 text-clay">Nessuna tappa ancora.</p>}

      <ReorderableList
        items={milestones}
        onReorder={reorderMilestones}
        renderItem={(item) => (
          <div className="rounded-xl border border-black/10 p-4">
            <div className="flex items-center gap-4">
              <p className="min-w-[56px] font-bold text-gold-500">{item.year}</p>
              <p className="flex-1 text-ink-soft">{item.text}</p>
              <IconButton onClick={() => openEditMilestone(item)} aria-label="Modifica">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setDeleteMilestoneTarget(item)} aria-label="Elimina">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        )}
      />

      <Divider className="my-8" />

      {/* Core values */}
      <div className="mb-3 flex items-center justify-between">
        <p className="font-bold">Principi della cucina</p>
        <Button size="small" startIcon={<AddIcon />} onClick={openCreateValue} className="normal-case">
          Aggiungi principio
        </Button>
      </div>

      {!loadingValues && values.length === 0 && <p className="mb-3 text-clay">Nessun principio ancora.</p>}

      <ReorderableList
        items={values}
        onReorder={reorderValues}
        renderItem={(item) => (
          <div className="rounded-xl border border-black/10 p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold">{item.title}</p>
                <p className="text-[0.88rem] text-clay">{item.text}</p>
              </div>
              <IconButton onClick={() => openEditValue(item)} aria-label="Modifica">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setDeleteValueTarget(item)} aria-label="Elimina">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        )}
      />

      {/* Dialog tappa */}
      <Dialog open={milestoneDialogOpen} onClose={() => setMilestoneDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMilestoneId ? 'Modifica tappa' : 'Nuova tappa'}</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMilestoneDialogOpen(false)} disabled={saving} className="normal-case">
            Annulla
          </Button>
          <Button
            onClick={saveMilestone}
            variant="contained"
            disabled={saving || !milestoneForm.year || !milestoneForm.text}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
          >
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog principio */}
      <Dialog open={valueDialogOpen} onClose={() => setValueDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingValueId ? 'Modifica principio' : 'Nuovo principio'}</DialogTitle>
        <DialogContent>
          <div className="mt-2 flex flex-col gap-5">
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValueDialogOpen(false)} disabled={saving} className="normal-case">
            Annulla
          </Button>
          <Button
            onClick={saveValue}
            variant="contained"
            disabled={saving || !valueForm.title || !valueForm.text}
            className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
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
    </div>
  )
}
