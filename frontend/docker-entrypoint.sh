#!/bin/sh
# Eseguito automaticamente all'avvio del container (meccanismo nativo
# dell'immagine nginx: ogni script eseguibile in /docker-entrypoint.d/
# viene lanciato prima di avviare nginx).
#
# Sostituisce il placeholder __BACKEND_ORIGIN__ nel template con il valore
# della variabile d'ambiente BACKEND_ORIGIN (default: la rete Docker Compose
# locale, dove il backend si chiama semplicemente "backend").
set -e

BACKEND_ORIGIN="${BACKEND_ORIGIN:-http://backend:8080}"

sed "s#__BACKEND_ORIGIN__#${BACKEND_ORIGIN}#g" \
    /etc/nginx/app.conf.template > /etc/nginx/conf.d/default.conf

echo "[configure-backend] Frontend configurato con BACKEND_ORIGIN=${BACKEND_ORIGIN}"
