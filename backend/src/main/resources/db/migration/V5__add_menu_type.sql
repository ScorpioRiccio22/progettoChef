-- Un menu può essere per il negozio fisico (SHOP) o per gli eventi (EVENTS).
-- Le due tipologie condividono la stessa logica (piatti + prezzo + un solo
-- "attivo" alla volta) ma sono liste indipendenti.
ALTER TABLE menus
    ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'SHOP';

-- Il vecchio vincolo permetteva un solo menu attivo in assoluto: ora deve
-- valere separatamente per ciascun tipo (un negozio attivo + un eventi attivo).
DROP INDEX uq_menus_single_active;

CREATE UNIQUE INDEX uq_menus_single_active_per_type ON menus (type) WHERE active = TRUE;
