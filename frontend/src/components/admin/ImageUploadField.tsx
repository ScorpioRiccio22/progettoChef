import { useRef, useState } from 'react'
import { Button, CircularProgress, IconButton } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import DeleteIcon from '@mui/icons-material/Delete'
import { adminUploadImage } from '@/services/contentApi'

interface ImageUploadFieldProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  /**
   * Nasconde il pulsante "Rimuovi immagine" interno: usato quando questo
   * campo vive dentro un contenitore (es. GalleryMediaEditor) che offre già
   * un proprio pulsante per rimuovere l'intero slot, per evitare due
   * pulsanti di eliminazione affiancati con lo stesso significato.
   */
  hideRemove?: boolean
}

/** Campo per caricare un'immagine sul backend e salvarne l'URL pubblico restituito. */
export default function ImageUploadField({ label, value, onChange, hideRemove = false }: ImageUploadFieldProps) {
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
    <div>
      <p className="mb-1 text-sm font-semibold text-ink-soft">{label}</p>
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt={label} className="h-[88px] w-[88px] rounded-xl border border-black/10 object-cover" />
        ) : (
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-xl border border-dashed border-black/20 px-2 text-center text-[0.7rem] text-black/35">
            Nessuna immagine
          </div>
        )}

        <div className="flex flex-col items-start gap-1">
          <Button
            variant="outlined"
            size="small"
            component="label"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
            className="border-gold-500 text-ink normal-case"
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
          {value && !hideRemove && (
            <IconButton size="small" onClick={() => onChange(null)} aria-label="Rimuovi immagine">
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
