# ðŸ½ï¸ Andrea Moio â€” Sito Vetrina Chef

Sito vetrina per Andrea Moio, chef a domicilio a Napoli: eventi privati,
cene su misura e consulenza per nuove attivitÃ  di ristorazione.

| Modulo | Tecnologia | Stato |
|--------|-----------|-------|
| `frontend/` | React 18 + TypeScript + MUI + Tailwind + Redux Toolkit | âœ… Scheletro completo, contenuti mock + area admin (login) |
| `backend/` | Java 21 + Spring Boot 3 | ðŸŸ¡ Autenticazione admin (JWT) implementata, resto da fare |

---

## ðŸ“ Struttura del progetto

```
ChefProject/
â”œâ”€â”€ frontend/           # App React (vedi frontend/README.md per i dettagli)
â”œâ”€â”€ backend/            # API Spring Boot (vedi backend/README.md per i dettagli)
â””â”€â”€ docker-compose.yml  # Ambiente di sviluppo: Postgres + backend + frontend
```

---

## ðŸš€ Avvio rapido con Docker (consigliato)

Avvia insieme database, backend e frontend (con hot-reload):

```bash
docker compose up --build
```

- Frontend: **http://localhost:5173**
- Backend: **http://localhost:8080**
- Postgres: **localhost:5432**

Le variabili d'ambiente (credenziali DB, JWT secret, admin di default) hanno
dei default validi per lo sviluppo locale; per personalizzarle copiare
`.env.example` in `.env` nella root del progetto.

Al primo avvio il backend crea automaticamente un utente admin di default
(vedi `backend/README.md`, sezione "Utente admin di default") per accedere a
**http://localhost:5173/admin/login**.

## ðŸš€ Avvio rapido (solo frontend, senza backend)

```bash
cd frontend
npm install
npm run dev
```

App disponibile su **http://localhost:5173**. Senza backend in esecuzione,
solo l'area admin (`/admin/login`) non funzionerÃ ; il resto del sito usa
ancora contenuti mock.

Per i dettagli su pagine, struttura interna e placeholder da sostituire
(email, numero WhatsApp), vedi `frontend/README.md`.

---

## ðŸ—ºï¸ Mappa del sito

- **Homepage** (`/`) â€” one-page scroll: Hero, Chi siamo, Servizi, A MoDo Mio,
  Eventi, Testimonianze, Newsletter, Contatti
- **Chi siamo** (`/chi-siamo`)
- **A MoDo Mio** (`/A MoDo Mio`) â€” piatti e cosa offre, filtrabili per categoria
- **Eventi** (`/eventi`) â€” eventi privati, aziendali, catering, cooking class
- **Contatti** (`/contatti`) â€” form, email diretta, WhatsApp aziendale, social

---

## ðŸ”Œ Prossimi passi

1. Sostituire i placeholder di contatto (email, numero WhatsApp) in
   `frontend/src/lib/content.ts`.
2. Area admin: aggiungere le pagine per gestire messaggi di contatto,
   iscritti alla newsletter e contenuti del sito (oggi solo login + dashboard
   placeholder, vedi `frontend/src/pages/admin/`).
3. Backend: API `/api/public/...` (contatti, newsletter, contenuti) e
   `/api/admin/...` (CRUD protetti) â€” vedi "Prossimi passi" in `backend/README.md`.
4. Collegare i form mock del frontend alle API reali (vedi
   `frontend/README.md`, sezione "Collegare il backend").
