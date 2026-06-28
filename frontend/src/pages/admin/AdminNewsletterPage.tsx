import { useEffect, useState } from 'react'
import {
  Box, Typography, Stack, Chip, Tooltip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Pagination, CircularProgress, Alert, Button
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/Download'
import { leadsApi } from '@/services/leadsApi'
import type { NewsletterSubscriberDto, Page } from '@/types'

export default function AdminNewsletterPage() {
  const [data, setData] = useState<Page<NewsletterSubscriberDto> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await leadsApi.getSubscribers(page, 20)
      setData(res)
    } catch {
      setError('Impossibile caricare gli iscritti. Controlla la connessione al backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page])

  const handleDelete = async (id: number) => {
    if (!confirm('Rimuovere questo iscritto dalla newsletter?')) return
    await leadsApi.deleteSubscriber(id)
    load()
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await leadsApi.exportCsv()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'newsletter-subscribers.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Export CSV non riuscito.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Iscritti newsletter
          </Typography>
          {data && (
            <Typography variant="body2" sx={{ color: '#7B6A58', mt: 0.5 }}>
              {data.totalElements} iscritti
            </Typography>
          )}
        </Box>
        <Button
          startIcon={<DownloadIcon />}
          variant="outlined"
          onClick={handleExport}
          disabled={exporting}
          sx={{
            borderColor: '#D9B679', color: '#332A21',
            '&:hover': { borderColor: '#C4A060', backgroundColor: 'rgba(217,182,121,0.08)' }
          }}
        >
          Esporta CSV
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#D9B679' }} />
        </Box>
      ) : data && data.content.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography sx={{ color: '#7B6A58' }}>Nessun iscritto alla newsletter.</Typography>
        </Paper>
      ) : data && (
        <>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: '#7B6A58' } }}>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Stato</TableCell>
                  <TableCell>Iscritto il</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.content.map(sub => (
                  <TableRow key={sub.id} hover>
                    <TableCell>
                      <Typography variant="body2">{sub.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={sub.active ? 'Attivo' : 'Disattivo'}
                        size="small"
                        sx={{
                          backgroundColor: sub.active ? 'rgba(39,174,96,0.15)' : 'rgba(0,0,0,0.07)',
                          color: sub.active ? '#27ae60' : '#7B6A58',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#7B6A58' }}>
                        {new Date(sub.subscribedAt).toLocaleDateString('it-IT', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Rimuovi">
                        <IconButton size="small" onClick={() => handleDelete(sub.id)} sx={{ color: '#c0392b' }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={data.totalPages}
                page={page + 1}
                onChange={(_, v) => setPage(v - 1)}
                sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#D9B679', color: '#1C1712' } }}
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  )
}
