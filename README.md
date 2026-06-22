# 🍽️ Andrea Moio — Sito Vetrina Chef

Sito vetrina per Andrea Moio, chef a domicilio a Napoli: eventi privati,
cene su misura e consulenza per nuove attività di ristorazione.

| Modulo | Tecnologia | Stato |
|--------|-----------|-------|
| `frontend/` | React 18 + TypeScript + MUI + Tailwind + Redux Toolkit | ✅ Scheletro completo, contenuti mock |
| `backend/` | Java + Spring Boot (pianificato) | ⏳ Da implementare |

---

## 📁 Struttura del progetto

```
ChefProject/
├── frontend/   # App React (vedi frontend/README.md per i dettagli)
└── backend/    # Riservato al backend Spring Boot, da implementare
```

---

## 🚀 Avvio rapido (frontend)

```bash
cd frontend
npm install
npm run dev
```

App disponibile su **http://localhost:5173**

Per i dettagli su pagine, struttura interna e placeholder da sostituire
(email, numero WhatsApp), vedi `frontend/README.md`.

---

## 🗺️ Mappa del sito

- **Homepage** (`/`) — one-page scroll: Hero, Chi siamo, Servizi, Ricettario,
  Eventi, Testimonianze, Newsletter, Contatti
- **Chi siamo** (`/chi-siamo`)
- **Ricettario** (`/ricettario`) — piatti e cosa offre, filtrabili per categoria
- **Eventi** (`/eventi`) — eventi privati, aziendali, catering, cooking class
- **Contatti** (`/contatti`) — form, email diretta, WhatsApp aziendale, social

---

## 🔌 Prossimi passi

1. Sostituire i placeholder di contatto (email, numero WhatsApp) in
   `frontend/src/lib/content.ts`.
2. Implementare il backend Spring Boot (API REST per newsletter, messaggi di
   contatto, e in futuro contenuti dinamici per servizi/ricettario/eventi).
3. Collegare i form mock del frontend alle API reali (vedi
   `frontend/README.md`, sezione "Collegare il backend").
