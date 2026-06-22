# 🎨 Frontend — Andrea Moio Chef

App React (TypeScript) per il sito vetrina dello chef Andrea Moio.

## Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Redux Toolkit** (stato globale: newsletter, form contatti, UI)
- **React Router v6** (routing)
- **Material UI v5** (componenti)
- **Tailwind CSS v3** (utility styling, configurato per non entrare in conflitto con MUI)
- **Axios** (HTTP client, predisposto per il backend)

> In questa fase il backend Spring Boot non è ancora collegato: i form
> (newsletter e contatti) usano thunk Redux "mock" che simulano una chiamata
> di rete. Sono già nella forma corretta per essere sostituiti da vere
> chiamate API quando il backend sarà pronto (vedi sezione "Collegare il
> backend" più sotto).

## Avvio in locale

```bash
npm install
npm run dev
```

App disponibile su http://localhost:5173

### Variabili d'ambiente (per quando il backend sarà pronto)

Crea un file `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Struttura `src/`

```
src/
├── components/
│   ├── layout/      # Navbar, Footer, Layout, ScrollToTop
│   ├── sections/    # Sezioni della homepage (Hero, About, Servizi, ...)
│   └── ui/          # Componenti riutilizzabili (DishCard, SectionHeading,
│                     # PageHero, VesuvioMark — l'elemento grafico ricorrente)
├── pages/           # Una pagina per ogni route
├── store/
│   ├── index.ts     # Store Redux
│   └── slices/      # newsletterSlice, contactSlice, uiSlice
├── services/
│   └── api.ts       # Client Axios, pronto per il backend (non ancora usato)
├── hooks/           # useAppDispatch, useAppSelector
├── types/           # Tutti i tipi TypeScript condivisi
├── lib/
│   └── content.ts   # Contenuti del sito (servizi, piatti, eventi, contatti,
│                     # social): oggi sono dati statici, in futuro arriveranno
│                     # dal backend
├── theme.ts          # Tema MUI (palette derivata dal logo)
└── index.css          # Tailwind + stili globali + font
```

## Mappa del sito

| Path | Pagina | Contenuto |
|------|--------|-----------|
| `/` | Homepage | Scroll verticale fluido: Hero → Chi siamo → Servizi → Ricettario → Eventi → Testimonianze → Newsletter → Contatti |
| `/chi-siamo` | Chi siamo | Storia, percorso, principi della cucina |
| `/ricettario` | Ricettario | Piatti con filtro per categoria (antipasti/primi/secondi/dolci) |
| `/eventi` | Eventi | Tipologie di evento, come funziona il servizio |
| `/contatti` | Contatti | Form + WhatsApp aziendale + email diretti |
| `*` | 404 | Pagina non trovata |

La navbar, quando ci si trova sulla homepage, scrolla in modo fluido alle
sezioni; quando ci si trova su un'altra pagina, naviga prima alla home e poi
scrolla. I link "Chi siamo / Ricettario / Eventi / Contatti" portano sempre
alla pagina completa dedicata.

## Placeholder da sostituire

In `src/lib/content.ts`, oggetto `CONTACT`:
- `email` — al momento un placeholder
- `whatsappNumber` / `whatsappLink` — al momento placeholder

In `src/lib/content.ts`, oggetto `SOCIAL_LINKS`: verificare che gli URL
puntino ai profili reali (Instagram, Facebook, TikTok, Threads, WhatsApp).

## Collegare il backend (quando sarà pronto)

1. Sostituire il corpo dei thunk in `store/slices/newsletterSlice.ts` e
   `store/slices/contactSlice.ts` con chiamate reali tramite `services/api.ts`
   (es. `await api.post('/newsletter', { email })`).
2. Spostare i contenuti di `lib/content.ts` (servizi, piatti, eventi,
   testimonianze) su endpoint REST e recuperarli con React Query o con
   `useEffect` + thunk dedicati, mantenendo gli stessi tipi in `types/index.ts`.
3. Impostare `VITE_API_BASE_URL` in `.env.local`.

## Build produzione

```bash
npm run build
# Output in dist/
```

## Convenzioni

- Tutti i tipi condivisi sono in `src/types/index.ts`
- Tutti i contenuti "di marketing" sono centralizzati in `src/lib/content.ts`
- Usare sempre `useAppDispatch` / `useAppSelector` per Redux
- Tailwind per layout e spaziatura, MUI per componenti interattivi e sx-styling
- L'elemento grafico del Vesuvio (`components/ui/VesuvioMark.tsx`) è la
  firma visiva del brand: va riusato con coerenza, non introdotto altrove
  in forme diverse
