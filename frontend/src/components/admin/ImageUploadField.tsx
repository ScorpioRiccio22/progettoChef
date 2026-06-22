import { useRef } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

interface ImageUploadFieldProps {
  label: string
  value?: string
  onChange: (dataUrl: string | undefined) => void
}

// Upload mock: legge il file scelto con FileReader e genera una preview come
// data URL, visibile davvero nel browser. Quando il backend Spring Boot sarà
// pronto, qui andrà una vera chiamata multipart/form-data a /api/uploads,
// che restituirà l'URL definitivo dell'immagine salvata sul server.
export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#332A21', mb: 1 }}>{label}</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 96,
            height: 72,
            borderRadius: 2,
            backgroundColor: '#F3E9D6',
            border: '1px dashed rgba(28,23,18,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {value ? (
            <Box component="img" src={value} alt={label} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(28,23,18,0.4)' }}>Nessuna foto</Typography>
          )}
        </Box>

        <Stack spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => inputRef.current?.click()}
            sx={{ borderColor: '#B8893E', color: '#8A6428', '&:hover': { borderColor: '#8A6428' } }}
          >
            {value ? 'Cambia foto' : 'Carica foto'}
          </Button>
          {value && (
            <Button
              size="small"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => onChange(undefined)}
              sx={{ textTransform: 'none' }}
            >
              Rimuovi
            </Button>
          )}
        </Stack>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </Stack>
    </Box>
  )
}
