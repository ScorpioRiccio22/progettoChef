import { createTheme } from '@mui/material/styles'

// Palette derivata dal logo: oro Vesuvio, inchiostro quasi nero, avorio caldo,
// rosso pomodoro per gli accenti "caldi" (eventi/CTA) e verde oliva per i dettagli.
export const palette = {
  gold: '#B8893E',
  goldLight: '#D9B679',
  goldDark: '#8A6428',
  ink: '#1C1712',
  inkSoft: '#332A21',
  ivory: '#FBF6EC',
  ivoryDeep: '#F3E9D6',
  tomato: '#7A2E2E',
  olive: '#3A4430',
}

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.gold,
      light: palette.goldLight,
      dark: palette.goldDark,
      contrastText: palette.ink,
    },
    secondary: {
      main: palette.tomato,
      contrastText: '#FBF6EC',
    },
    background: {
      default: palette.ivory,
      paper: '#FFFFFF',
    },
    text: {
      primary: palette.ink,
      secondary: palette.inkSoft,
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    h1: { fontFamily: '"Fraunces", "Cormorant Garamond", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", "Cormorant Garamond", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", "Cormorant Garamond", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", "Cormorant Garamond", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", "Cormorant Garamond", serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: '1.5rem', paddingBlock: '0.7rem' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
    // Modali dell'area admin: prima erano poco spaziati e con poco respiro
    // interno. Questi override valgono per tutti i Dialog dell'app (schede
    // "Nuovo/Modifica ..." di ogni sezione admin + i dialog di conferma),
    // cosÃ¬ restano coerenti senza dover intervenire pagina per pagina.
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          width: '100%',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '1.5rem 1.75rem 1rem',
          fontFamily: '"Fraunces", "Cormorant Garamond", serif',
          fontWeight: 600,
          fontSize: '1.25rem',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0.25rem 1.75rem 1.5rem',
          '&.MuiDialogContent-dividers': {
            padding: '1.25rem 1.75rem',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '1rem 1.75rem 1.5rem',
          gap: '0.5rem',
        },
      },
    },
    // Gruppi di pulsanti/icone nelle righe delle liste admin (modifica,
    // elimina, ecc.): dimensione e spaziatura coerenti ovunque.
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px',
        },
      },
    },
  },
})
