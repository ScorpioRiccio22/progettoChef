import { Box, Divider, IconButton, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  updateContact,
  updateSocialLink,
  addSocialLink,
  deleteSocialLink,
} from '@/store/slices/contentSlice'
import SaveBar from '@/components/admin/SaveBar'
import type { SocialLink } from '@/types'

const ICON_OPTIONS: SocialLink['icon'][] = ['instagram', 'facebook', 'tiktok', 'whatsapp', 'threads']

export default function AdminContactPage() {
  const dispatch = useAppDispatch()
  const contact = useAppSelector((state) => state.content.contact)
  const socialLinks = useAppSelector((state) => state.content.socialLinks)

  const handleAddSocial = () => {
    dispatch(addSocialLink({ label: 'Nuovo social', href: 'https://', icon: 'instagram' }))
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, mb: 0.5 }}>
        Contatti e Social
      </Typography>
      <Typography sx={{ color: '#332A21', mb: 4, fontSize: '0.9rem' }}>
        Gestisci email, WhatsApp, indirizzo e link social. Ogni modifica si riflette su tutto il sito (footer, pagina contatti, pulsanti CTA).
      </Typography>

      <Stack spacing={2.5} sx={{ mb: 5 }}>
        <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Informazioni di contatto
        </Typography>
        <TextField
          label="Email"
          type="email"
          value={contact.email}
          onChange={(e) => dispatch(updateContact({ email: e.target.value }))}
          fullWidth
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Numero WhatsApp (testo visibile)"
            value={contact.whatsappNumber}
            onChange={(e) => dispatch(updateContact({ whatsappNumber: e.target.value }))}
            fullWidth
            placeholder="+39 000 000 0000"
          />
          <TextField
            label="Link WhatsApp (wa.me/...)"
            value={contact.whatsappLink}
            onChange={(e) => dispatch(updateContact({ whatsappLink: e.target.value }))}
            fullWidth
            placeholder="https://wa.me/39..."
          />
        </Stack>
        <TextField
          label="Zona operativa"
          value={contact.area}
          onChange={(e) => dispatch(updateContact({ area: e.target.value }))}
          fullWidth
          placeholder="Es. Napoli e provincia"
        />
        <TextField
          label="Indirizzo (opzionale)"
          value={contact.address ?? ''}
          onChange={(e) => dispatch(updateContact({ address: e.target.value }))}
          fullWidth
          placeholder="Es. Via Roma 1, Napoli"
        />
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontWeight: 600, color: '#8A6428', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Link social
          </Typography>
          <Tooltip title="Aggiungi social">
            <IconButton
              onClick={handleAddSocial}
              size="small"
              sx={{ backgroundColor: 'rgba(184,137,62,0.12)', color: '#8A6428', '&:hover': { backgroundColor: 'rgba(184,137,62,0.25)' } }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {socialLinks.map((social) => (
          <Stack key={social.id} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
            <Select
              size="small"
              value={social.icon}
              onChange={(e) => dispatch(updateSocialLink({ ...social, icon: e.target.value as SocialLink['icon'] }))}
              sx={{ minWidth: 130 }}
            >
              {ICON_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              label="Etichetta"
              value={social.label}
              onChange={(e) => dispatch(updateSocialLink({ ...social, label: e.target.value }))}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="URL"
              value={social.href}
              onChange={(e) => dispatch(updateSocialLink({ ...social, href: e.target.value }))}
              sx={{ flex: 2 }}
            />
            <Tooltip title="Rimuovi">
              <IconButton
                size="small"
                color="error"
                onClick={() => dispatch(deleteSocialLink(social.id))}
                sx={{ mt: 0.5 }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ))}
      </Stack>

      <SaveBar />
    </Box>
  )
}
