import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  TextField,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SaveIcon from '@mui/icons-material/Save'
import { adminListSiteTexts, adminUpdateSiteText, type SiteTextItem } from '@/services/contentApi'

const CATEGORY_LABELS: Record<string, string> = {
  home: 'Homepage',
  common: 'Testi comuni (usati in più pagine)',
  services: 'Servizi',
  events: 'Eventi',
  recipes: 'A MoDo mio',
  contact: 'Contatti',
  about: 'La mia storia',
  footer: 'Footer',
}

const CATEGORY_ORDER = ['home', 'services', 'events', 'recipes', 'contact', 'about', 'footer', 'common']

export default function AdminTextsPage() {
  const [items, setItems] = useState<SiteTextItem[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingCategory, setSavingCategory] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | false>('home')

  const load = () => {
    setLoading(true)
    adminListSiteTexts()
      .then((data) => {
        setItems(data)
        setValues(Object.fromEntries(data.map((item) => [item.key, item.value])))
      })
      .catch(() => setError('Impossibile caricare i testi del sito'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const byCategory = useMemo(() => {
    const groups: Record<string, SiteTextItem[]> = {}
    for (const item of items) {
      groups[item.category] = groups[item.category] ?? []
      groups[item.category].push(item)
    }
    return groups
  }, [items])

  const categories = useMemo(() => {
    const known = CATEGORY_ORDER.filter((c) => byCategory[c]?.length)
    const extra = Object.keys(byCategory).filter((c) => !CATEGORY_ORDER.includes(c))
    return [...known, ...extra]
  }, [byCategory])

  const dirtyKeysInCategory = (category: string) =>
    (byCategory[category] ?? []).filter((item) => values[item.key] !== item.value).map((item) => item.key)

  const handleSaveCategory = async (category: string) => {
    const dirtyKeys = dirtyKeysInCategory(category)
    if (dirtyKeys.length === 0) return
    setSavingCategory(category)
    try {
      await Promise.all(dirtyKeys.map((key) => adminUpdateSiteText(key, values[key])))
      setItems((prev) => prev.map((item) => (dirtyKeys.includes(item.key) ? { ...item, value: values[item.key] } : item)))
      setToast('Testi salvati')
    } catch {
      setError('Salvataggio non riuscito per alcuni testi. Riprova.')
    } finally {
      setSavingCategory(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold">Testi del sito</h1>
        <p className="text-clay">
          Ogni titolo, descrizione e testo di pulsante del sito pubblico è qui, raggruppato per pagina. Modifica un
          testo e premi "Salva modifiche" in fondo a ciascuna sezione: cambia subito sul sito, senza toccare codice.
        </p>
      </div>

      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : (
        categories.map((category) => {
          const categoryItems = byCategory[category] ?? []
          const dirtyCount = dirtyKeysInCategory(category).length
          return (
            <Accordion
              key={category}
              expanded={expanded === category}
              onChange={(_, isExpanded) => setExpanded(isExpanded ? category : false)}
              className="mb-3 overflow-hidden rounded-2xl before:hidden"
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{CATEGORY_LABELS[category] ?? category}</p>
                  <Chip label={`${categoryItems.length} testi`} size="small" />
                  {dirtyCount > 0 && (
                    <Chip label={`${dirtyCount} da salvare`} size="small" className="bg-gold-500/[.18] font-semibold text-gold-600" />
                  )}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col gap-5">
                  {categoryItems.map((item) => {
                    const value = values[item.key] ?? ''
                    const isLong = value.length > 90
                    return (
                      <TextField
                        key={item.key}
                        label={item.label}
                        helperText={item.key}
                        fullWidth
                        multiline={isLong}
                        minRows={isLong ? 2 : 1}
                        value={value}
                        onChange={(e) => setValues((prev) => ({ ...prev, [item.key]: e.target.value }))}
                      />
                    )
                  })}
                  <Button
                    variant="contained"
                    startIcon={savingCategory === category ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                    disabled={dirtyCount === 0 || savingCategory === category}
                    onClick={() => handleSaveCategory(category)}
                    className="self-start bg-gold-500 text-ink normal-case hover:bg-gold-600"
                  >
                    {savingCategory === category ? 'Salvataggio…' : 'Salva modifiche'}
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          )
        })
      )}

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)} message={toast ?? ''} />
    </div>
  )
}
