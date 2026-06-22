import { Box, Button, Container, Stack, Typography } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import { CONTACT } from '@/lib/content'

export default function ContactPreviewSection() {
  return (
    <Box id="contatti" sx={{ backgroundColor: '#FBF6EC', py: { xs: 9, md: 13 } }}>
      <Container maxWidth="md">
        <SectionHeading
          eyebrow="Contatti"
          title="Parliamo del tuo evento"
          description="Scrivimi su WhatsApp per una risposta rapida, oppure manda una email con i dettagli: data, numero di invitati e cosa hai in mente."
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Button
            size="large"
            variant="contained"
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            sx={{ backgroundColor: '#3A4430', color: '#FBF6EC', '&:hover': { backgroundColor: '#2C3424' } }}
          >
            Scrivimi su WhatsApp
          </Button>
          <Button
            size="large"
            variant="outlined"
            href={`mailto:${CONTACT.email}`}
            startIcon={<EmailIcon />}
            sx={{ borderColor: '#B8893E', color: '#8A6428', '&:hover': { borderColor: '#8A6428', backgroundColor: 'rgba(184,137,62,0.08)' } }}
          >
            Invia una email
          </Button>
        </Stack>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/contatti"
            endIcon={<ArrowForwardIcon />}
            sx={{ color: '#332A21', '&:hover': { backgroundColor: 'transparent', color: '#8A6428' } }}
          >
            Vai alla pagina contatti completa
          </Button>
        </Box>
        <Typography sx={{ textAlign: 'center', mt: 2, color: '#8A6428', fontSize: '0.9rem' }}>
          {CONTACT.area}
        </Typography>
      </Container>
    </Box>
  )
}
