import { useEffect, useState } from 'react'
import {
  Box, Typography, Stack, Chip, Tooltip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Pagination, CircularProgress, Alert, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { contentApi } from '@/services/contentApi'
import type { DishDto, Page } from '@/types'

const EMPTY: Partial<DishDto> = { name: '', category: 'primi', description: '', tags: [], active: true }

function DishDialog({ open, dish, onClose, onSave }: {
  open: boolean
  dish: Partial<DishDto>
  onClose: () => void
  onSave: (data: Partial<DishDto>) => void
}) {
  const [form, setForm] = useState<Partial<DishDto>>(dish)
  const [tagsStr, setTagsStr] = useState((dish.tags ?? []).join(', '))

  useEffect(() => {
    setForm(dish)
    setTagsStr((dish.tags ?? []).join(', '))
  }, [dish])

  const handleSave = () => {
    onSave({ ...form, tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean) })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
        {form.id ? 'Modifica piatto' : 'Nuovo piatto'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField label="Nome" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth />
          <TextField label="Slug" value={form.slug ?? ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} fullWidth helperText="Lascia vuoto per generarlo in automatico" />
          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select value={form.category ?? 'primi'} label="Categoria" onChange={e => setForm(f => ({ ...f, category: e.target.value as DishDto['category'] }))}>
              {['antipasti', 'primi', 'secondi', 'dolci'].map(c => (
                <MenuItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Descrizione" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline rows={3} fullWidth />
          <TextField label="Tag (separati da virgola)" value={tagsStr} onChange={e => setTagsStr(e.target.value)} fullWidth />
          <TextField label="URL immagine" value={form.imageUrl ?? ''} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} fullWidth />
          <FormControlLabel control={<Switch checked={form.active ?? true} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />} label="Attivo" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#7B6A58' }}>Annulla</Button>
        <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#D9B679', color: '#1C1712', '&:hover': { backgroundColor: '#C4A060' } }}>
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function AdminDishesPage() {
  const [data, setData] = useState<Page<DishDto> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogDish, setDialogDish] = useState<Partial<DishDto> | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try { setData(await contentApi.getDishes(page, 15)) }
    catch { setError('Impossibile caricare i piatti.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page])

  const handleSave = async (formData: Partial<DishDto>) => {
    try {
      if (formData.id) await contentApi.updateDish(formData.id, formData)
      else await contentApi.createDish(formData)
      setDialogDish(null); load()
    } catch { setError('Salvataggio non riuscito.') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questo piatto?')) return
    await contentApi.deleteDish(id); load()
  }

  const CATEGORIES: Record<string, string> = { antipasti: '#5E8C6C', primi: '#7B6A58', secondi: '#8B4513', dolci: '#D9B679' }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>Ricettario</Typography>
        <Button startIcon={<AddIcon />} variant="contained"
          onClick={() => setDialogDish(EMPTY)}
          sx={{ backgroundColor: '#D9B679', color: '#1C1712', '&:hover': { backgroundColor: '#C4A060' } }}>
          Nuovo piatto
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
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Tag</TableCell>
                  <TableCell align="center">Stato</TableCell>
                  <TableCell align="right">Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.content.map(dish => (
                  <TableRow key={dish.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{dish.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#7B6A58' }}>{dish.description.slice(0, 60)}…</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={dish.category} size="small"
                        sx={{ backgroundColor: CATEGORIES[dish.category] + '22', color: CATEGORIES[dish.category], fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {(dish.tags ?? []).map(t => <Chip key={t} label={t} size="small" variant="outlined" />)}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={dish.active ? 'Attivo' : 'Off'} size="small"
                        sx={{ backgroundColor: dish.active ? 'rgba(39,174,96,0.15)' : 'rgba(0,0,0,0.07)', color: dish.active ? '#27ae60' : '#7B6A58', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Modifica">
                        <IconButton size="small" onClick={() => setDialogDish(dish)}><EditIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina">
                        <IconButton size="small" onClick={() => handleDelete(dish.id)} sx={{ color: '#c0392b' }}>
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
              <Pagination count={data.totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)}
                sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#D9B679', color: '#1C1712' } }} />
            </Box>
          )}
        </>
      )}

      {dialogDish && (
        <DishDialog open dish={dialogDish} onClose={() => setDialogDish(null)} onSave={handleSave} />
      )}
    </Stack>
  )
}
