import { useEffect, useState } from 'react'
import { Alert, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
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
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">Messaggi di contatto</h1>
          <p className="text-clay">I messaggi inviati dal form pubblico di contatto.</p>
        </div>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={exporting || items.length === 0}
          className="whitespace-nowrap border-gold-500 text-ink normal-case"
        >
          {exporting ? 'Esportazione…' : 'Esporta CSV'}
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
        <p className="text-clay">Nessun messaggio ricevuto finora.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((m) => (
            <div
              key={m.id}
              className={`cursor-pointer rounded-xl border border-black/10 p-4 ${m.read ? 'bg-transparent' : 'bg-gold-500/[.06]'}`}
              onClick={() => openMessage(m)}
            >
              <div className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={m.read ? 'font-medium' : 'font-bold'}>{m.name}</p>
                    <p className="text-[0.8rem] text-clay">· {m.email}</p>
                    {!m.read && <Chip label="Nuovo" size="small" color="warning" />}
                  </div>
                  <p className="truncate text-[0.88rem] text-clay">{m.subject}</p>
                </div>
                <p className="whitespace-nowrap text-[0.78rem] text-clay">{formatDate(m.createdAt)}</p>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteTarget(m)
                  }}
                  aria-label="Elimina"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle className="flex items-center gap-2">
              <MailOpenIcon fontSize="small" /> {selected.subject}
            </DialogTitle>
            <DialogContent>
              <div className="flex flex-col gap-3">
                <p className="text-[0.85rem] text-clay">
                  Da <strong>{selected.name}</strong> ({selected.email})
                  {selected.phone ? ` · ${selected.phone}` : ''} — {formatDate(selected.createdAt)}
                </p>
                <p className="whitespace-pre-wrap text-ink-soft">{selected.message}</p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)} className="normal-case">
                Chiudi
              </Button>
              <Button
                color="error"
                className="normal-case"
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
    </div>
  )
}
