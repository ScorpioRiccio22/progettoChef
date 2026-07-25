import type { ReactNode } from 'react'
import { IconButton, Tooltip } from '@mui/material'

interface AdminRowAction {
  key: string
  label: string
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}

interface AdminRowActionsProps {
  actions: AdminRowAction[]
  /** Contenuto extra da mostrare prima delle icone (es. un pulsante "Attiva"/"Gestisci"). */
  before?: ReactNode
}

/**
 * Gruppo di azioni (modifica, elimina, ecc.) mostrato in fondo alle righe
 * delle liste dell'area admin. Prima ogni pagina replicava lo stesso blocco
 * di IconButton "a mano" con spaziature diverse tra loro: questo componente
 * uniforma allineamento, gap e separazione visiva dal resto della riga.
 */
export default function AdminRowActions({ actions, before }: AdminRowActionsProps) {
  return (
    <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2 sm:border-l sm:border-black/10 sm:pl-3">
      {before}
      <div className="flex items-center gap-1">
        {actions.map((action) => (
          <Tooltip key={action.key} title={action.label}>
            <span>
              <IconButton
                onClick={action.onClick}
                aria-label={action.label}
                disabled={action.disabled}
                size="small"
                className={action.danger ? 'text-red-700 hover:bg-red-700/10' : 'text-ink-soft hover:bg-black/5'}
              >
                {action.icon}
              </IconButton>
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
