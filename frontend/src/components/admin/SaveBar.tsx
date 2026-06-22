import { Box, Button, Slide, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { markSaved } from '@/store/slices/contentSlice'

// Mostra una barra fissa in basso quando ci sono modifiche non salvate.
// In questa fase mock "salvare" significa solo resettare il flag isDirty:
// quando il backend sarà collegato, qui partirà la chiamata PUT/POST reale.
export default function SaveBar() {
  const dispatch = useAppDispatch()
  const isDirty = useAppSelector((state) => state.content.isDirty)

  return (
    <Slide direction="up" in={isDirty} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 240,
          right: 0,
          backgroundColor: '#1C1712',
          color: '#FBF6EC',
          px: 4,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          boxShadow: '0 -8px 24px rgba(0,0,0,0.25)',
        }}
      >
        <Typography sx={{ fontSize: '0.9rem' }}>
          Hai modifiche non salvate <Box component="span" sx={{ color: 'rgba(251,246,236,0.55)' }}>(modalità demo: i dati non persistono dopo il refresh)</Box>
        </Typography>
        <Button
          onClick={() => dispatch(markSaved())}
          startIcon={<SaveIcon />}
          variant="contained"
          sx={{ backgroundColor: '#B8893E', color: '#1C1712', '&:hover': { backgroundColor: '#D9B679' } }}
        >
          Salva modifiche
        </Button>
      </Box>
    </Slide>
  )
}
