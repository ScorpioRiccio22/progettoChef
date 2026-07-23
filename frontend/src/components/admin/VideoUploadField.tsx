import { useRef, useState } from 'react'
import { Button, CircularProgress, IconButton, LinearProgress } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import DeleteIcon from '@mui/icons-material/Delete'
import { adminUploadVideo } from '@/services/contentApi'

interface VideoUploadFieldProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  /**
   * Nasconde il pulsante "Rimuovi video" interno: usato quando questo campo
   * vive dentro un contenitore (es. GalleryMediaEditor) che offre già un
   * proprio pulsante per rimuovere l'intero slot, per evitare due pulsanti
   * di eliminazione affiancati con lo stesso significato.
   */
  hideRemove?: boolean
}

const MAX_SIZE_BYTES = 200 * 1024 * 1024 // 200MB, deve rimanere allineato al backend (FileStorageService)

/** Campo per caricare un video mp4 sul backend e salvarne l'URL pubblico restituito. */
export default function VideoUploadField({ label, value, onChange, hideRemove = false }: VideoUploadFieldProps) {
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
    <div>
      <p className="mb-1 text-sm font-semibold text-ink-soft">{label}</p>
      <div className="flex items-center gap-4">
        {value ? (
          <video
            src={value}
            controls
            muted
            className="h-[90px] w-40 rounded-xl border border-black/10 bg-black object-cover"
          />
        ) : (
          <div className="flex h-[90px] w-40 items-center justify-center rounded-xl border border-dashed border-black/20 px-2 text-center text-[0.7rem] text-black/35">
            Nessun video
          </div>
        )}

        <div className="flex min-w-[180px] flex-col items-start gap-1">
          <Button
            variant="outlined"
            size="small"
            component="label"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
            className="border-gold-500 text-ink normal-case"
          >
            {uploading ? `Caricamento… ${progress}%` : value ? 'Cambia video' : 'Carica video (mp4)'}
            <input ref={inputRef} type="file" hidden accept="video/mp4" onChange={handleFileSelected} />
          </Button>
          {uploading && <LinearProgress variant="determinate" value={progress} className="w-full rounded" />}
          {value && !uploading && !hideRemove && (
            <IconButton size="small" onClick={() => onChange(null)} aria-label="Rimuovi video">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
      <p className="mt-1 text-[0.72rem] text-black/45">
        Formato MP4, max 200MB. Consigliato: video orizzontale, breve (10–60 secondi).
      </p>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
