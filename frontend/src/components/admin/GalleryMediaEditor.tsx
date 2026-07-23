import { useState } from 'react'
import { Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image'
import VideocamIcon from '@mui/icons-material/Videocam'
import ImageUploadField from '@/components/admin/ImageUploadField'
import VideoUploadField from '@/components/admin/VideoUploadField'

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)$/i.test(url.split('?')[0])
}

interface GalleryMediaEditorProps {
  label: string
  helperText?: string
  value: string[]
  onChange: (urls: string[]) => void
}

/**
 * Galleria di più immagini o video (uno per slot), usata nelle pagine di dettaglio di
 * servizi ed eventi: sul sito viene mostrata come un carosello con autoplay.
 */
export default function GalleryMediaEditor({ label, helperText, value, onChange }: GalleryMediaEditorProps) {
  // Per gli slot ancora vuoti serve sapere se caricare un'immagine o un video:
  // per gli slot già valorizzati il tipo si deduce dall'URL, per quelli nuovi si sceglie qui.
  const [newSlotKinds, setNewSlotKinds] = useState<Record<number, 'image' | 'video'>>({})

  const updateAt = (index: number, url: string | null) => {
    const next = [...value]
    next[index] = url ?? ''
    onChange(next)
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const addSlot = () => onChange([...value, ''])

  return (
    <div>
      <p className={`font-semibold ${helperText ? 'mb-0.5' : 'mb-1'}`}>{label}</p>
      {helperText && <p className="mb-3 text-[0.82rem] text-clay">{helperText}</p>}
      <div className="flex flex-col gap-3">
        {value.map((url, index) => {
          const kind = url ? (isVideoUrl(url) ? 'video' : 'image') : (newSlotKinds[index] ?? 'image')
          return (
            <div key={index} className="flex items-start gap-2 rounded-xl border border-black/10 p-3">
              <div className="flex-1">
                {!url && (
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={kind}
                    onChange={(_, next) => next && setNewSlotKinds((p) => ({ ...p, [index]: next }))}
                    className="mb-2"
                  >
                    <ToggleButton value="image" className="px-3 normal-case">
                      <ImageIcon fontSize="small" className="mr-1" /> Immagine
                    </ToggleButton>
                    <ToggleButton value="video" className="px-3 normal-case">
                      <VideocamIcon fontSize="small" className="mr-1" /> Video
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
                {kind === 'video' ? (
                  <VideoUploadField
                    label={`Slide ${index + 1}`}
                    value={url || null}
                    onChange={(u) => updateAt(index, u)}
                    hideRemove
                  />
                ) : (
                  <ImageUploadField
                    label={`Slide ${index + 1}`}
                    value={url || null}
                    onChange={(u) => updateAt(index, u)}
                    hideRemove
                  />
                )}
              </div>
              <IconButton
                onClick={() => removeAt(index)}
                aria-label={`Rimuovi slide ${index + 1} dalla galleria`}
                title="Rimuovi slide dalla galleria"
                size="small"
                className="mt-0.5 text-danger"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          )
        })}
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addSlot}
          className="self-start text-gold-600 normal-case"
        >
          Aggiungi alla galleria
        </Button>
      </div>
    </div>
  )
}
