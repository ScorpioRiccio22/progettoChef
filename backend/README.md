# andreamoiochef-backend (Python / FastAPI — struttura flat)

Riscrittura del backend originale (Java 21 + Spring Boot 3) in
**Python 3.12 + FastAPI**, stessa API pubblica, stessa logica di business,
stessi ruoli e permessi. Struttura **piatta, senza sottocartelle**: 11 file
Python allo stesso livello, nessun package `app/`.

Verificata end-to-end con test manuali (login, permessi per ruolo,
protezione ultimo SUPERADMIN, slug automatici, menu attivo/disattivo,
upload file, contatti/newsletter) contro un vero PostgreSQL.

## Struttura del progetto

```
config.py       # variabili d'ambiente / impostazioni (equivalente di application.yml)
database.py     # engine SQLAlchemy + dependency get_db
security.py     # JWT + bcrypt + dependency per i ruoli (EDITOR/ADMIN/SUPERADMIN)
exceptions.py   # eccezioni custom + gestore errori globale
utils.py        # slug, riordino drag-and-drop, upload/eliminazione file
models.py       # TUTTI i modelli SQLAlchemy (admin, contenuti, leads)
schemas.py      # TUTTI gli schemi Pydantic (request/response)
seed.py         # dati demo iniziali (admin default + contenuti + testi del sito)
routes.py       # TUTTI gli endpoint dell'API, organizzati per risorsa con commenti di sezione
main.py         # entry point: crea l'app, monta i router, CORS, static files, seed all'avvio
requirements.txt / Dockerfile / .env.example
```

Ogni file corrisponde a un *tipo* di cosa (modelli, schemi, rotte...) invece
che a un modulo funzionale separato con le sue sottocartelle — più adatto
alle dimensioni di questo progetto rispetto alla struttura multi-package
usata inizialmente (che rispecchiava 1:1 l'organizzazione Java).

`routes.py` è il file più corposo (~1300 righe) perché contiene tutti i 25
router, ma è diviso in sezioni chiaramente commentate (una per risorsa:
auth, dishes, event-types, services, menus, ecc.) per restare navigabile.

## Avvio rapido (locale, senza Docker)

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# modifica .env con le tue credenziali Postgres locali

uvicorn main:app --reload --port 8080
```

Al primo avvio: crea le tabelle, l'utente SUPERADMIN di default e i
contenuti demo (stesso comportamento della versione precedente).

## Avvio con Docker

Stessa porta (8080), stessa cartella upload (`/app/uploads`), stesse
variabili d'ambiente della versione precedente — sostituibile 1:1 nello
stesso `docker-compose.yml`.

## Documentazione interattiva

- Swagger UI: `http://localhost:8080/docs`
- ReDoc: `http://localhost:8080/redoc`

## Nota su un dettaglio tecnico del merge

Alcuni helper privati (es. `_find_or_404`, `_apply_request`, `_to_dto`)
erano ripetuti con lo stesso nome in più file quando il progetto era
diviso in `routers/`. Unendoli in `routes.py` li ho rinominati con un
prefisso legato alla risorsa (es. `_dish_find_or_404`,
`_menu_find_or_404`, `_accounts_find_or_404`) per evitare che l'ultima
definizione sovrascrivesse le altre nello stesso file — ho verificato con
test end-to-end che ogni endpoint richiami ancora la versione corretta
per la propria entità.

## Differenze rispetto alla versione Java (invariate rispetto a prima)

Vedi in fondo: uso di `Base.metadata.create_all()` invece di Flyway,
collezioni ordinate come colonne `ARRAY` invece di tabelle separate,
hashing con `bcrypt` diretto. Stesse considerazioni di prima su Alembic
per la produzione.
