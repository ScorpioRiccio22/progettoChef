import { Button, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import VesuvioMark from '@/components/ui/VesuvioMark'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function NotFoundPage() {
  const { t } = useSiteContent()

  return (
    <div className="flex min-h-[70vh] items-center bg-ink">
      <Container maxWidth="sm" className="py-20 text-center">
        <div className="mb-6 flex justify-center text-gold-300">
          <VesuvioMark className="h-12 w-24" color="currentColor" />
        </div>
        <h1 className="mb-3 font-display text-[2.4rem] font-semibold text-ivory">
          {t('common.notFound.title', 'Pagina non trovata')}
        </h1>
        <p className="mb-8 text-ivory/70">
          {t('common.notFound.description', 'Questa pagina non esiste, o è stata spostata. Torna alla home per continuare a curiosare.')}
        </p>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          className="bg-gold-500 text-ink normal-case hover:bg-gold-300"
        >
          {t('common.notFound.button', 'Torna alla home')}
        </Button>
      </Container>
    </div>
  )
}
