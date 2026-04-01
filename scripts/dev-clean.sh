#!/usr/bin/env bash
# Arranque de desarrollo determinista: libera el puerto, borra artefactos y levanta el dev server.
# Usa Webpack (no --turbo): en Next 14 mezclar Turbopack con salida server en .next deja a veces
# referencias a chunks tipo ./682.js que ya no existen (Cannot find module).
# Turbopack explícito: npm run dev:turbo
# Uso: npm run dev:clean   |   PORT=3052 npm run dev:clean
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-3052}"

PIDS=$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null || true)
if [[ -n "${PIDS}" ]]; then
  echo "dev-clean: liberando puerto $PORT — PIDs: $(echo "$PIDS" | tr '\n' ' ')"
  kill -9 ${PIDS} 2>/dev/null || true
  sleep 1
fi

echo "dev-clean: eliminando .next, .turbo y cachés de bundler"
rm -rf .next .turbo node_modules/.cache

echo "dev-clean: next dev -p $PORT (Webpack; para Turbopack: npm run dev:turbo)"
exec ./node_modules/.bin/next dev -p "$PORT"
