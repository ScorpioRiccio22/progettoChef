import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

interface ConfirmDeleteDialogProps {
  open: boolean
  itemLabel: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDeleteDialog({ open, itemLabel, onConfirm, onCancel, loading }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confermi l'eliminazione?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Stai per eliminare <strong>{itemLabel}</strong>. L'operazione non può essere annullata.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Annulla
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          Elimina
        </Button>
      </DialogActions>
    </Dialog>
  )
}
