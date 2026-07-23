import { Button, Container } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function ContactPreviewSection() {
  const { contact, t } = useSiteContent()

  return (
    <div id="contatti" className="bg-ivory py-[72px] md:py-[104px]">
      <Container maxWidth="md">
        <SectionHeading
          eyebrow={t('home.contact.eyebrow', 'Contatti')}
          title={t('home.contact.title', 'Parliamo del tuo evento')}
          description={t(
            'home.contact.description',
            'Scrivimi su WhatsApp per una risposta rapida, oppure manda una email con i dettagli: data, numero di invitati e cosa hai in mente.',
          )}
        />
        <div className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            size="large"
            variant="contained"
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            className="bg-olive text-ivory normal-case hover:bg-[#2C3424]"
          >
            {t('home.contact.whatsappButton', 'Scrivimi su WhatsApp')}
          </Button>
          <Button
            size="large"
            variant="outlined"
            href={`mailto:${contact.email}`}
            startIcon={<EmailIcon />}
            className="border-gold-500 text-gold-600 normal-case hover:border-gold-600 hover:bg-gold-500/[.08]"
          >
            {t('home.contact.emailButton', 'Invia una email')}
          </Button>
        </div>
        <div className="text-center">
          <Button
            component={RouterLink}
            to="/contatti"
            endIcon={<ArrowForwardIcon />}
            className="normal-case text-ink-soft hover:bg-transparent hover:text-gold-600"
          >
            {t('home.contact.pageLinkButton', 'Vai alla pagina contatti completa')}
          </Button>
        </div>
        <p className="mt-4 text-center text-[0.9rem] text-gold-600">{contact.area}</p>
      </Container>
    </div>
  )
}
