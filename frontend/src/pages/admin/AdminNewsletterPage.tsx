import { Box, Button, Chip, Divider, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { removeNewsletterSubscriber } from '@/store/slices/contentSlice'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminNewsletterPage() {
  const dispatch = useAppDispatch()
  const subscribers = useAppSelector((state) => state.content.newsletterSubscribers)

  const copyEmails = () => {
    const list = subscribers.map((s) => s.email).join(', ')
    navigator.clipboard.writeText(list)
  }

  const mailtoAll = () => {
    const bcc = subscribers.map((s) => s.email).join(',')
    window.open(`mailto:?bcc=${bcc}&subject=Newsletter%20Andrea%20Moio%20Chef`)
  }

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '1.6rem', fontWeight: 600, mb: 0.5 }}>
        Newsletter
      </Typography>
      <Typography sx={{ color: '#332A21', mb: 4, fontSize: '0.9rem' }}>
        Visualizza e gestisci gli iscritti alla newsletter. Quando il backend sarà collegato, questa lista verrà popolata automaticamente tramite <code>/api/newsletter/subscribers</code>.
      </Typography>

      {/* Stats */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Box sx={{ backgroundColor: '#F3E9D6', borderRadius: 2, px: 3, py: 2, textAlign: 'center', minWidth: 120 }}>
          <Typography sx={{ fontFamily: '"Fraunces", serif', fontSize: '2rem', color: '#8A6428', fontWeight: 700 }}>
            {subscribers.length}
          </Typography>
          <Typography sx={{ fontSize: '0.82rem', color: '#332A21' }}>Iscritti totali</Typography>
        </Box>
      </Stack>

      {subscribers.length > 0 && (
        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
          <Button
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={copyEmails}
            sx={{ borderColor: '#B8893E', color: '#8A6428', border: '1px solid' }}
          >
            Copia tutte le email
          </Button>
          <Button
            size="small"
            startIcon={<MailOutlineIcon />}
            onClick={mailtoAll}
            sx={{ borderColor: '#B8893E', color: '#8A6428', border: '1px solid' }}
          >
            Apri client email (BCC)
          </Button>
        </Stack>
      )}

      <Divider sx={{ mb: 3 }} />

      {subscribers.length === 0 ? (
        <Box
          sx={{
            border: '2px dashed rgba(28,23,18,0.15)',
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
            color: '#332A21',
          }}
        >
          <MailOutlineIcon sx={{ fontSize: '2.5rem', mb: 1.5, color: '#B8893E', opacity: 0.5 }} />
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Nessun iscritto ancora</Typography>
          <Typography sx={{ fontSize: '0.88rem', color: 'rgba(51,42,33,0.65)' }}>
            Le iscrizioni dal form sul sito appariranno qui automaticamente.
          </Typography>
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#8A6428' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#8A6428' }}>Data iscrizione</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {[...subscribers].reverse().map((sub) => (
              <TableRow key={sub.id} hover>
                <TableCell>{sub.email}</TableCell>
                <TableCell sx={{ color: '#332A21', fontSize: '0.85rem' }}>{formatDate(sub.subscribedAt)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Rimuovi iscritto">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => dispatch(removeNewsletterSubscriber(sub.id))}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Box sx={{ mt: 5, p: 3, backgroundColor: '#F3E9D6', borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#8A6428', mb: 1 }}>
          Integrazione backend
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#332A21', lineHeight: 1.7 }}>
          Quando il backend Spring Boot sarà attivo:<br />
          • <code>POST /api/newsletter</code> — registra una nuova iscrizione<br />
          • <code>GET /api/newsletter/subscribers</code> — restituisce la lista (richiede auth admin)<br />
          • <code>DELETE /api/newsletter/subscribers/:id</code> — rimuove un iscritto
        </Typography>
      </Box>
    </Box>
  )
}
