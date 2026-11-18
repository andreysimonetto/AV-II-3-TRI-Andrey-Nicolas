#!/usr/bin/env bash
# Inicia o GameBlog nas portas 5500 e 8080.
set -e
cd "$(dirname "$0")/backend"
if [ -n "${CODESPACE_NAME:-}" ]; then
  export GAMEBLOG_FRONTEND_ORIGIN="https://${CODESPACE_NAME}-5500.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
fi
export GAMEBLOG_FRONTEND_PORT=5500
export SPRING_WEB_RESOURCES_STATIC_LOCATIONS="file:../frontend/"
exec mvn spring-boot:run
