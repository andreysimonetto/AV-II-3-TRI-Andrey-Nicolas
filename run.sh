#!/usr/bin/env bash
# Sobe front-end (porta 5500) e back-end (porta 8080) juntos.
# Uso: ./run.sh   (na raiz do projeto)
ROOT="$(cd "$(dirname "$0")" && pwd)"

if [ -n "$CODESPACE_NAME" ]; then
  export GAMEBLOG_FRONTEND_ORIGIN="https://${CODESPACE_NAME}-5500.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
else
  export GAMEBLOG_FRONTEND_ORIGIN="${GAMEBLOG_FRONTEND_ORIGIN:-http://localhost:5500}"
fi

# Front-end
(cd "$ROOT/frontend" && python3 -m http.server 5500 --bind 0.0.0.0) &
FRONT_PID=$!
trap 'kill $FRONT_PID 2>/dev/null' EXIT

# No Codespaces, deixa as portas publicas (senao o navegador bloqueia o fetch)
if [ -n "$CODESPACE_NAME" ] && command -v gh >/dev/null 2>&1; then
  (
    for i in $(seq 1 90); do
      if (echo > /dev/tcp/127.0.0.1/8080) 2>/dev/null; then
        gh codespace ports visibility 8080:public 5500:public -c "$CODESPACE_NAME" \
          && echo ">>> Portas 8080 e 5500 agora estao PUBLICAS"
        exit 0
      fi
      sleep 2
    done
  ) &
fi

# Back-end
cd "$ROOT/backend" && mvn spring-boot:run
