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

> In questa fase il backend Spring Boot espone già l'autenticazione admin
> (`/api/auth/...`), collegata al frontend tramite `authSlice` e
> `services/api.ts`. I form pubblici (newsletter e contatti) usano ancora
> thunk Redux "mock" che simulano una chiamata di rete: sono già nella forma
> corretta per essere sostituiti da vere chiamate API quando i relativi
> endpoint backend saranno pronti (vedi sezione "Collegare il backend" più
> sotto).

## Avvio in locale

```bash
npm install
npm run dev
```

App disponibile su http://localhost:5173

> In alternativa, `docker compose up --build` dalla root del progetto avvia
> frontend + backend + Postgres tutti insieme con hot-reload (vedi il
> `README.md` nella root).

### Variabili d'ambiente

Crea un file `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Non è strettamente necessario in sviluppo locale: Vite fa già da proxy su
`/api` verso `localhost:8080` (vedi `vite.config.ts`).

## Area admin

- `/admin/login` — form di accesso (email + password)
- `/admin` — dashboard protetta (richiede login); ogni nuova pagina admin
  futura va aggiunta come route figlia, sempre dentro `ProtectedRoute`

Lo stato di autenticazione vive in `store/slices/authSlice.ts`: il token JWT
viene salvato in `localStorage` e allegato automaticamente alle richieste da
`services/api.ts`. Al refresh della pagina, se c'è un token salvato, viene
richiamato `/api/auth/me` per ripristinare la sessione senza richiedere di
nuovo le credenziali.

## Struttura `src/`

```
src/
├── components/
│   ├── layout/      # Navbar, Footer, Layout, ScrollToTop
│   ├── sections/    # Sezioni della homepage (Hero, About, Servizi, ...)
│   ├── ui/          # Componenti riutilizzabili (DishCard, SectionHeading,
│   │                 # PageHero, VesuvioMark — l'elemento grafico ricorrente)
│   └── admin/       # AdminLayout, ProtectedRoute (area admin)
├── pages/           # Una pagina per ogni route
│   └── admin/       # AdminLoginPage, AdminDashboardPage
├── store/
│   ├── index.ts     # Store Redux
│   └── slices/      # newsletterSlice, contactSlice, uiSlice, authSlice
├── services/
│   └── api.ts       # Client Axios + interceptor JWT (area admin)
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
| `/` | Homepage | Scroll verticale fluido: Hero → Chi siamo → Servizi → A MoDo Mio → Eventi → Testimonianze → Newsletter → Contatti |
| `/chi-siamo` | Chi siamo | Storia, percorso, principi della cucina |
| `/A MoDo Mio` | A MoDo Mio | Piatti con filtro per categoria (antipasti/primi/secondi/dolci) |
| `/eventi` | Eventi | Tipologie di evento, come funziona il servizio |
| `/contatti` | Contatti | Form + WhatsApp aziendale + email diretti |
| `*` | 404 | Pagina non trovata |
| `/admin/login` | Login admin | Form di accesso all'area riservata |
| `/admin` | Dashboard admin | Protetta da login, layout dedicato (no navbar pubblica) |

La navbar, quando ci si trova sulla homepage, scrolla in modo fluido alle
sezioni; quando ci si trova su un'altra pagina, naviga prima alla home e poi
scrolla. I link "Chi siamo / A MoDo Mio / Eventi / Contatti" portano sempre
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
