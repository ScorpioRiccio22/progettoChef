import { useEffect, useState } from 'react'
import {
  Box, Typography, Stack, Chip, Tooltip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Pagination, CircularProgress, Alert, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Switch, FormControlLabel
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { contentApi } from '@/services/contentApi'
import type { TestimonialDto, Page } from '@/types'

const EMPTY: Partial<TestimonialDto> = { author: '', role: '', quote: '', approved: false, displayOrder: 0 }

function TestimonialDialog({ open, item, onClose, onSave }: {
  open: boolean; item: Partial<TestimonialDto>; onClose: () => void; onSave: (d: Partial<TestimonialDto>) => void
}) {
  const [form, setForm] = useState<Partial<TestimonialDto>>(item)
  useEffect(() => setForm(item), [item])
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
        {form.id ? 'Modifica testimonianza' : 'Nuova testimonianza'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField label="Autore" value={form.author ?? ''} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} fullWidth />
          <TextField label="Ruolo / Occasione" value={form.role ?? ''} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} fullWidth />
          <TextField label="Testo" value={form.quote ?? ''} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} multiline rows={4} fullWidth />
          <TextField label="Ordine visualizzazione" type="number" value={form.displayOrder ?? 0} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))} fullWidth />
          <FormControlLabel control={<Switch checked={form.approved ?? false} onChange={e => setForm(f => ({ ...f, approved: e.target.checked }))} />} label="Approvata" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#7B6A58' }}>Annulla</Button>
        <Button onClick={() => onSave(form)} variant="contained" sx={{ backgroundColor: '#D9B679', color: '#1C1712', '&:hover': { backgroundColor: '#C4A060' } }}>Salva</Button>
      </DialogActions>
    </Dialog>
  )
}

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<Page<TestimonialDto> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogItem, setDialogItem] = useState<Partial<TestimonialDto> | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try { setData(await contentApi.getTestimonials(page, 15)) }
    catch { setError('Impossibile caricare le testimonianze.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page])

  const handleSave = async (formData: Partial<TestimonialDto>) => {
    try {
      if (formData.id) await contentApi.updateTestimonial(formData.id, formData)
      else await contentApi.createTestimonial(formData)
      setDialogItem(null); load()
    } catch { setError('Salvataggio non riuscito.') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questa testimonianza?')) return
    await contentApi.deleteTestimonial(id); load()
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>Testimonianze</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogItem(EMPTY)}
          sx={{ backgroundColor: '#D9B679', color: '#1C1712', '&:hover': { backgroundColor: '#C4A060' } }}>
          Nuova
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: '#D9B679' }} /></Box>
      ) : data && (
        <>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: '#7B6A58' } }}>
                  <TableCell>Autore</TableCell>
                  <TableCell>Testo</TableCell>
                  <TableCell align="center">Stato</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.content.map(t => (
                  <TableRow key={t.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{t.author}</Typography>
                      <Typography variant="caption" sx={{ color: '#7B6A58' }}>{t.role}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2">{t.quote.slice(0, 80)}…</Typography></TableCell>
                    <TableCell align="center">
                      <Chip label={t.approved ? 'Approvata' : 'In attesa'} size="small"
                        sx={{ backgroundColor: t.approved ? 'rgba(39,174,96,0.15)' : 'rgba(217,182,121,0.25)', color: t.approved ? '#27ae60' : '#7B6A58', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Modifica"><IconButton size="small" onClick={() => setDialogItem(t)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Elimina"><IconButton size="small" onClick={() => handleDelete(t.id)} sx={{ color: '#c0392b' }}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination count={data.totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)}
                sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#D9B679', color: '#1C1712' } }} />
            </Box>
          )}
        </>
      )}

      {dialogItem && <TestimonialDialog open item={dialogItem} onClose={() => setDialogItem(null)} onSave={handleSave} />}
    </Stack>
  )
}
