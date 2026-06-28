import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, IconButton, Paper, Stack, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  adminDeleteNewsletterSubscriber,
  adminExportNewsletterSubscribers,
  adminListNewsletterSubscribers,
} from '@/services/leadsApi'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import type { NewsletterSubscriber } from '@/types'

export default function AdminNewsletterPage() {
  const [items, setItems] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null)
  const [exporting, setExporting] = useState(false)

  const load = () => {
    setLoading(true)
    adminListNewsletterSubscribers()
      .then(setItems)
      .catch(() => setError('Impossibile caricare gli iscritti'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await adminDeleteNewsletterSubscriber(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch {
      setError('Eliminazione non riuscita')
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await adminExportNewsletterSubscribers()
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
            Iscritti newsletter
          </Typography>
          <Typography sx={{ color: '#5C5246' }}>
            {items.length} {items.length === 1 ? 'iscritto' : 'iscritti'} alla newsletter.
          </Typography>
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
        <Typography sx={{ color: '#5C5246' }}>Nessun iscritto ancora.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {items.map((s) => (
            <Paper key={s.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography sx={{ flex: 1 }}>{s.email}</Typography>
                <Typography sx={{ color: '#8A7F70', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  iscritto il {formatDate(s.subscribedAt)}
                </Typography>
                <IconButton onClick={() => setDeleteTarget(s)} aria-label="Elimina">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemLabel={deleteTarget?.email ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}
