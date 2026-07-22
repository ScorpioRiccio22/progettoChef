# ⚙️ Backend — Andrea Moio Chef

API REST in Java 21 + Spring Boot 3 per il sito vetrina di Andrea Moio.

## Stack

- **Spring Boot 3.3** (Web, Validation, Data JPA, Security, Actuator)
- **PostgreSQL** + **Flyway** (migrazioni versionate)
- **JWT** stateless (libreria `jjwt`) per l'autenticazione dell'area admin
- **Lombok**
- Build con **Maven**

## Stato attuale

Implementata per prima la **componente di autenticazione per l'area admin**
(`/api/auth/**`), pensata come base sulla quale aggiungere via via le API
pubbliche (servizi, A MoDo Mio, eventi) e quelle protette di gestione
contenuti, contatti e newsletter.

```
src/main/java/it/andreamoiochef/backend/
├── BackendApplication.java
├── config/
│   ├── SecurityConfig.java       # filter chain, CORS, password encoder
│   ├── JwtProperties.java        # app.jwt.*
│   ├── CorsProperties.java       # app.cors.*
│   └── AdminSeedProperties.java  # app.admin-seed.*
├── auth/
│   ├── AdminUser.java / AdminRole.java / AdminUserRepository.java
│   ├── CustomUserDetailsService.java
│   ├── JwtService.java               # generazione/validazione token
│   ├── JwtAuthenticationFilter.java  # filtro per ogni richiesta
│   ├── AuthService.java / AuthController.java
│   ├── AdminUserSeeder.java          # crea l'admin di default al primo avvio
│   └── dto/ (LoginRequest, LoginResponse, AdminUserDto)
├── common/
│   ├── GlobalExceptionHandler.java   # risposte di errore uniformi (ApiError)
│   ├── ApiError.java
│   └── InvalidCredentialsException.java
└── health/
    └── HealthController.java         # GET /api/public/ping
```

## Modello di sicurezza

- `/api/auth/login` — **pubblico**, POST `{ email, password }` → JWT
- `/api/auth/me` — richiede JWT valido, restituisce l'admin corrente
- `/api/auth/logout` — no-op lato server (JWT stateless), per simmetria API
- `/api/public/**` — pubblico (contenuti futuri: servizi, A MoDo Mio, eventi)
- `/api/admin/**` — richiede JWT valido + ruolo `ADMIN` (CRUD contenuti futuri)
- `/actuator/health` — pubblico, usato dal healthcheck Docker

Il JWT va inviato come header `Authorization: Bearer <token>`.

## Utente admin di default

Al primo avvio, se la tabella `admin_users` è vuota, viene creato un admin
con le credenziali definite dalle variabili d'ambiente (vedi `.env.example`):

```
ADMIN_SEED_EMAIL=admin@andreamoiochef.it
ADMIN_SEED_PASSWORD=admin123
```

⚠️ Da cambiare assolutamente in produzione (e idealmente anche in sviluppo,
se il backend è esposto fuori dalla rete locale).

## Recensioni Google (homepage)

La homepage sostituisce automaticamente le testimonianze manuali con le
recensioni Google reali del locale, quando l'integrazione è configurata.
L'endpoint pubblico `GET /api/public/google-reviews` interroga la Google
Places API ("Place Details") **lato server** e restituisce al frontend solo
i dati necessari (nome, valutazione, recensioni): **la chiave API non viene
mai esposta al browser né restituita da nessuna risposta**.

Per attivarla servono due variabili d'ambiente, da impostare **solo** come
secret dell'hosting/CI (mai committate, mai in `application.yml`, mai nel
pannello admin):

```
GOOGLE_PLACES_API_KEY=la-tua-chiave-api-google-cloud
GOOGLE_PLACES_PLACE_ID=il-place-id-della-tua-scheda-google
```

Opzionali, con default sensati:

```
GOOGLE_PLACES_CACHE_MINUTES=180   # quante ore tenere in cache prima di richiamare Google
GOOGLE_PLACES_MAX_REVIEWS=6       # quante recensioni mostrare sul sito
```

Note sulla sicurezza della chiave:

- **Non è possibile "hashare" una chiave API** come si farebbe con una
  password: il backend deve poterla leggere in chiaro per autenticare le
  chiamate verso Google, quindi un hash (che è irreversibile) la renderebbe
  inutilizzabile. La protezione reale è che la chiave vive **solo** come
  variabile d'ambiente/secret sul server, non viene mai salvata a
  database, non compare in nessun log applicativo, e nessun endpoint
  (pubblico o admin) la restituisce mai nel corpo della risposta.
- In produzione, imposta la variabile come *secret* della piattaforma di
  hosting (es. secret di Docker/Kubernetes, "Environment Variables" del
  provider, GitHub Actions secret per il deploy) e non in un file `.env`
  committato nel repository.
- Su Google Cloud Console, restringi la chiave API alla sola "Places API" e,
  se possibile, alle IP del tuo server, per limitare i danni in caso di
  fuga accidentale.
- Se le variabili non sono impostate, l'endpoint risponde con
  `{ "configured": false, ... }` e il sito mostra automaticamente le
  testimonianze inserite a mano dal pannello admin.

## Avvio in locale (senza Docker)

Richiede un PostgreSQL in esecuzione su `localhost:5432` con un database
`andreamoiochef` (vedi `.env.example`).

```bash
cp .env.example .env
export $(grep -v '^#' .env | xargs)   # oppure usare un plugin .env del tuo IDE
mvn spring-boot:run
```

API disponibile su **http://localhost:8080**.

## Avvio con Docker

Vedi il `docker-compose.yml` nella root del progetto: avvia Postgres,
backend e frontend insieme. Dalla root:

```bash
docker compose up --build
```

## Test

```bash
mvn test
```

Il test di contesto usa H2 in memoria (profilo `test`), senza bisogno di un
database esterno.

## Esempio di chiamata

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@andreamoiochef.it","password":"admin123"}'
```

Risposta:

```json
{
  "accessToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresInSeconds": 28800,
  "user": { "id": 1, "email": "admin@andreamoiochef.it", "fullName": "Andrea Moio", "role": "ADMIN" }
}
```

## Upload di media (immagini e video)

`POST /api/admin/uploads` — immagini (JPG/PNG/WEBP/GIF/SVG, max 8MB) →
`{ "url": "/uploads/<file>.jpg" }`, da salvare nel campo `imageUrl`.

`POST /api/admin/uploads/video` — video **MP4** (max 200MB) → `{ "url":
"/uploads/videos/<file>.mp4" }`, da salvare nel campo `videoUrl`. Usato
soprattutto per le tipologie di evento (`event_types.video_url`), mostrato
nella pagina pubblica "Eventi" al posto della foto quando presente.

Entrambi richiedono `multipart/form-data` con campo `file` e ruolo `ADMIN`.
I file vengono salvati su disco sotto `app.storage.upload-dir` (di default
`/app/uploads` nel container, montato come volume Docker persistente
`andreamoiochef-uploads`) e serviti staticamente sotto il prefisso
`app.storage.public-url-prefix` (di default `/uploads`), con supporto nativo
alle richieste HTTP Range — necessario per il seek nel player video.

Quando un video viene sostituito o rimosso da una tipologia di evento, il
file precedente viene cancellato automaticamente dal disco per evitare di
accumulare file orfani (i video pesano molto più delle immagini).

⚠️ Il limite `multipart.max-file-size`/`max-request-size` in
`application.yml` (210MB di default, override con `MULTIPART_MAX_FILE_SIZE`
/ `MULTIPART_MAX_REQUEST_SIZE`) deve restare **superiore** al limite di
200MB applicato in `FileStorageService`, altrimenti Spring rifiuta la
richiesta prima ancora di validarla (risposta 413).

Se il backend sta dietro un reverse proxy (nginx, come nel Dockerfile.prod
del frontend, o un load balancer in staging/produzione), ricordarsi di
alzare anche lì il limite di dimensione del body (es. `client_max_body_size`
in nginx), altrimenti il proxy taglia la richiesta prima che arrivi a Spring.

## Prossimi passi

1. API pubbliche `/api/public/...` per servizi, A MoDo Mio, eventi e
   testimonianze (oggi mock in `frontend/src/lib/content.ts`).
2. API `/api/admin/content/...` (CRUD, protette) per gestire quei contenuti
   dall'area admin del frontend.
3. `POST /api/public/contact` e `POST /api/public/newsletter` per sostituire
   i thunk mock in `frontend/src/store/slices/`.
4. Eventuale refresh token / blacklist se la sessione di 8 ore risultasse
   troppo corta o troppo lunga per il flusso reale di utilizzo.
