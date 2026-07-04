import { useRef, useState } from 'react'
import { Box, Button, CircularProgress, LinearProgress, Stack, Typography, IconButton } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import DeleteIcon from '@mui/icons-material/Delete'
import { adminUploadVideo } from '@/services/contentApi'

interface VideoUploadFieldProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
}

const MAX_SIZE_BYTES = 200 * 1024 * 1024 // 200MB, deve rimanere allineato al backend (FileStorageService)

/** Campo per caricare un video mp4 sul backend e salvarne l'URL pubblico restituito. */
export default function VideoUploadField({ label, value, onChange }: VideoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (file.type !== 'video/mp4') {
      setError('Formato non supportato: carica un file .mp4')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Il video supera la dimensione massima di 200MB')
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)
    try {
      const url = await adminUploadVideo(file, setProgress)
      onChange(url)
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Caricamento video non riuscito'
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
            component="video"
            src={value}
            controls
            muted
            sx={{ width: 160, height: 90, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#000' }}
          />
        ) : (
          <Box
            sx={{
              width: 160,
              height: 90,
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
            Nessun video
          </Box>
        )}

        <Stack spacing={1} sx={{ minWidth: 180 }}>
          <Button
            variant="outlined"
            size="small"
            component="label"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
            sx={{ borderColor: '#B8893E', color: '#1C1712' }}
          >
            {uploading ? `Caricamento… ${progress}%` : value ? 'Cambia video' : 'Carica video (mp4)'}
            <input ref={inputRef} type="file" hidden accept="video/mp4" onChange={handleFileSelected} />
          </Button>
          {uploading && <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1 }} />}
          {value && !uploading && (
            <IconButton size="small" onClick={() => onChange(null)} sx={{ alignSelf: 'flex-start' }} aria-label="Rimuovi video">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Stack>
      <Typography sx={{ color: 'rgba(0,0,0,0.45)', fontSize: '0.72rem', mt: 0.5 }}>
        Formato MP4, max 200MB. Consigliato: video orizzontale, breve (10–60 secondi).
      </Typography>
      {error && <Typography sx={{ color: '#B3261E', fontSize: '0.78rem', mt: 0.5 }}>{error}</Typography>}
    </Box>
  )
}
