import { useEffect, useState } from 'react'
import {
  Box, Typography, Stack, Alert, Button, Paper, TextField, CircularProgress, Divider
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { contentApi } from '@/services/contentApi'
import type { BrandDto } from '@/types'

export default function AdminBrandPage() {
  const [form, setForm] = useState<Partial<BrandDto>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    contentApi.getBrand()
      .then(data => setForm(data))
      .catch(() => setError('Impossibile caricare i dati del brand.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(false)
    try {
      await contentApi.updateBrand(form)
      setSuccess(true)
    } catch {
      setError('Salvataggio non riuscito.')
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, key: keyof BrandDto) => (
    <TextField
      label={label}
      value={(form[key] as string) ?? ''}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
      fullWidth
    />
  )

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#D9B679' }} /></Box>

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>Impostazioni brand</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Salvato con successo.</Alert>}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Identità</Typography>
        <Stack spacing={2.5}>
          {field('Nome', 'name')}
          {field('Handle (es. @chefandreamoio)', 'handle')}
          {field('Ruolo', 'role')}
          {field('Città', 'city')}
          {field('Payoff / Tagline', 'payoff')}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Contatti</Typography>
        <Stack spacing={2.5}>
          {field('Email', 'email')}
          {field('Numero WhatsApp (es. +39 333 1234567)', 'whatsappNumber')}
          {field('Link WhatsApp (es. https://wa.me/393331234567)', 'whatsappLink')}
          {field('Area di servizio', 'area')}
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ backgroundColor: '#D9B679', color: '#1C1712', '&:hover': { backgroundColor: '#C4A060' } }}
        >
          {saving ? 'Salvataggio…' : 'Salva modifiche'}
        </Button>
      </Box>
    </Stack>
  )
}
