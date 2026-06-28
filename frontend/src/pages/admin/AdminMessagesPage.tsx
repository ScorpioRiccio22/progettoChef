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
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import MailOpenIcon from '@mui/icons-material/DraftsOutlined'
import {
  adminDeleteContactMessage,
  adminExportContactMessages,
  adminListContactMessages,
  adminMarkMessageRead,
} from '@/services/leadsApi'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { ContactMessage } from '@/types'

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null)
  const [exporting, setExporting] = useState(false)

  const load = () => {
    setLoading(true)
    adminListContactMessages()
      .then(setItems)
      .catch(() => setError('Impossibile caricare i messaggi'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openMessage = async (message: ContactMessage) => {
    setSelected(message)
    if (!message.read) {
      try {
        const updated = await adminMarkMessageRead(message.id, true)
        setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      } catch {
        // la lettura del messaggio non deve bloccare la visualizzazione
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await adminDeleteContactMessage(deleteTarget.id)
      setDeleteTarget(null)
      setSelected(null)
      load()
    } catch {
      setError('Eliminazione non riuscita')
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await adminExportContactMessages()
    } catch {
      setError('Esportazione non riuscita')
    } finally {
      setExporting(false)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Messaggi di contatto
          </Typography>
          <Typography sx={{ color: '#5C5246' }}>I messaggi inviati dal form pubblico di contatto.</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={exporting || items.length === 0}
          sx={{ borderColor: '#B8893E', color: '#1C1712' }}
        >
          {exporting ? 'Esportazione…' : 'Esporta CSV'}
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
        <Typography sx={{ color: '#5C5246' }}>Nessun messaggio ricevuto finora.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {items.map((m) => (
            <Paper
              key={m.id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: m.read ? 'transparent' : 'rgba(184,137,62,0.06)',
              }}
              onClick={() => openMessage(m)}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: m.read ? 500 : 700 }}>{m.name}</Typography>
                    <Typography sx={{ color: '#8A7F70', fontSize: '0.8rem' }}>· {m.email}</Typography>
                    {!m.read && <Chip label="Nuovo" size="small" color="warning" />}
                  </Stack>
                  <Typography sx={{ color: '#5C5246', fontSize: '0.88rem' }} noWrap>
                    {m.subject}
                  </Typography>
                </Box>
                <Typography sx={{ color: '#8A7F70', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {formatDate(m.createdAt)}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteTarget(m)
                  }}
                  aria-label="Elimina"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MailOpenIcon fontSize="small" /> {selected.subject}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={1.5}>
                <Typography sx={{ color: '#8A7F70', fontSize: '0.85rem' }}>
                  Da <strong>{selected.name}</strong> ({selected.email})
                  {selected.phone ? ` · ${selected.phone}` : ''} — {formatDate(selected.createdAt)}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', color: '#332A21' }}>{selected.message}</Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)}>Chiudi</Button>
              <Button
                color="error"
                onClick={() => {
                  setDeleteTarget(selected)
                }}
              >
                Elimina
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemLabel={deleteTarget ? `il messaggio di ${deleteTarget.name}` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}
