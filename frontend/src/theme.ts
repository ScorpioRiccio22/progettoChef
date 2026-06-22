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
  },
})
