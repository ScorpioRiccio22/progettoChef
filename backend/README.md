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
pubbliche (servizi, ricettario, eventi) e quelle protette di gestione
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
- `/api/public/**` — pubblico (contenuti futuri: servizi, ricettario, eventi)
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

## Prossimi passi

1. API pubbliche `/api/public/...` per servizi, ricettario, eventi e
   testimonianze (oggi mock in `frontend/src/lib/content.ts`).
2. API `/api/admin/content/...` (CRUD, protette) per gestire quei contenuti
   dall'area admin del frontend.
3. `POST /api/public/contact` e `POST /api/public/newsletter` per sostituire
   i thunk mock in `frontend/src/store/slices/`.
4. Eventuale refresh token / blacklist se la sessione di 8 ore risultasse
   troppo corta o troppo lunga per il flusso reale di utilizzo.
