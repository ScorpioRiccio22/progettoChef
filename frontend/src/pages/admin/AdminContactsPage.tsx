import { useEffect, useState } from 'react'
import {
  Box, Typography, Stack, Chip, Tooltip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Pagination, CircularProgress, Alert,
  Collapse, FormControlLabel, Switch
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { leadsApi } from '@/services/leadsApi'
import type { ContactLeadDto, Page } from '@/types'

function ContactRow({ contact, onMarkRead, onDelete }: {
  contact: ContactLeadDto
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow
        sx={{
          backgroundColor: contact.read ? 'transparent' : 'rgba(217,182,121,0.08)',
          '& td': { borderBottom: 'none' },
        }}
      >
        <TableCell sx={{ width: 40, py: 0.5 }}>
          <IconButton size="small" onClick={() => setOpen(o => !o)}>
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack>
            <Typography variant="body2" sx={{ fontWeight: contact.read ? 400 : 700 }}>
              {contact.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7B6A58' }}>{contact.email}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{contact.subject}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" sx={{ color: '#7B6A58' }}>
            {new Date(contact.createdAt).toLocaleDateString('it-IT', {
              day: '2-digit', month: 'short', year: 'numeric'
            })}
          </Typography>
        </TableCell>
        <TableCell align="center">
          {!contact.read && (
            <Chip label="Nuovo" size="small" sx={{ backgroundColor: '#D9B679', color: '#1C1712', fontWeight: 600 }} />
          )}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          {!contact.read && (
            <Tooltip title="Segna come letto">
              <IconButton size="small" onClick={() => onMarkRead(contact.id)}>
                <MarkEmailReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Elimina">
            <IconButton size="small" onClick={() => onDelete(contact.id)} sx={{ color: '#c0392b' }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 2, backgroundColor: '#F5EFE3', borderRadius: 2, mb: 1 }}>
              {contact.phone && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Telefono:</strong> {contact.phone}
                </Typography>
              )}
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {contact.message}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function AdminContactsPage() {
  const [data, setData] = useState<Page<ContactLeadDto> | null>(null)
  const [page, setPage] = useState(0)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await leadsApi.getContacts(page, 15, unreadOnly)
      setData(res)
    } catch {
      setError('Impossibile caricare i messaggi. Controlla la connessione al backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, unreadOnly])

  const handleMarkRead = async (id: number) => {
    await leadsApi.markRead(id)
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questo messaggio?')) return
    await leadsApi.deleteContact(id)
    load()
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Messaggi di contatto
          </Typography>
          {data && (
            <Typography variant="body2" sx={{ color: '#7B6A58', mt: 0.5 }}>
              {data.totalElements} messaggi totali
            </Typography>
          )}
        </Box>
        <FormControlLabel
          control={<Switch checked={unreadOnly} onChange={e => { setUnreadOnly(e.target.checked); setPage(0) }} />}
          label="Solo non letti"
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#D9B679' }} />
        </Box>
      ) : data && data.content.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography sx={{ color: '#7B6A58' }}>Nessun messaggio{unreadOnly ? ' non letto' : ''}.</Typography>
        </Paper>
      ) : data && (
        <>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: '#7B6A58' } }}>
                  <TableCell />
                  <TableCell>Mittente</TableCell>
                  <TableCell>Oggetto</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="center">Stato</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.content.map(c => (
                  <ContactRow key={c.id} contact={c} onMarkRead={handleMarkRead} onDelete={handleDelete} />
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
