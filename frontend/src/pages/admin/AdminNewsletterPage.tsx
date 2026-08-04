import { useEffect, useState } from 'react'
import { Alert, Button, CircularProgress } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  adminDeleteNewsletterSubscriber,
  adminExportNewsletterSubscribers,
  adminListNewsletterSubscribers,
} from '@/services/leadsApi'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import AdminRowActions from '@/components/admin/AdminRowActions'
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
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold">Iscritti newsletter</h1>
          <p className="text-clay">
            {items.length} {items.length === 1 ? 'iscritto' : 'iscritti'} alla newsletter.
          </p>
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
        <p className="text-clay">Nessun iscritto ancora.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((s) => (
            <div key={s.id} className="rounded-xl border border-black/10 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-[180px] flex-1">
                  <p className="font-semibold">{[s.firstName, s.lastName].filter(Boolean).join(' ') || '—'}</p>
                  <p className="text-[0.85rem] text-clay">{s.email}</p>
                </div>
                <p className="whitespace-nowrap text-[0.78rem] text-clay">iscritto il {formatDate(s.subscribedAt)}</p>
                <AdminRowActions
                  actions={[
                    {
                      key: 'delete',
                      label: 'Elimina',
                      icon: <DeleteIcon fontSize="small" />,
                      onClick: () => setDeleteTarget(s),
                      danger: true,
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        itemLabel={deleteTarget?.email ?? ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
