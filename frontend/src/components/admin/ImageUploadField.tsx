import { useRef, useState } from 'react'
import { Box, Button, CircularProgress, Stack, Typography, IconButton } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import DeleteIcon from '@mui/icons-material/Delete'
import { adminUploadImage } from '@/services/contentApi'

interface ImageUploadFieldProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
}

/** Campo per caricare un'immagine sul backend e salvarne l'URL pubblico restituito. */
export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const url = await adminUploadImage(file)
      onChange(url)
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Caricamento immagine non riuscito'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#332A21', mb: 1 }}>{label}</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        {value ? (
          <Box
            component="img"
            src={value}
            alt={label}
            sx={{ width: 88, height: 88, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }}
          />
        ) : (
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: 2,
              border: '1px dashed rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0,0,0,0.35)',
              fontSize: '0.7rem',
              textAlign: 'center',
            }}
          >
            Nessuna immagine
          </Box>
        )}

        <Stack spacing={1}>
          <Button
            variant="outlined"
            size="small"
            component="label"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
            sx={{ borderColor: '#B8893E', color: '#1C1712' }}
          >
            {uploading ? 'Caricamento…' : value ? 'Cambia immagine' : 'Carica immagine'}
            <input
              ref={inputRef}
              type="file"
              hidden
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleFileSelected}
            />
          </Button>
          {value && (
            <IconButton size="small" onClick={() => onChange(null)} sx={{ alignSelf: 'flex-start' }} aria-label="Rimuovi immagine">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Stack>
      {error && (
        <Typography sx={{ color: '#B3261E', fontSize: '0.78rem', mt: 0.5 }}>{error}</Typography>
      )}
    </Box>
  )
}
