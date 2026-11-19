#!/usr/bin/env bash
# Inicia o GameBlog nas portas 5500 e 8080.
set -e
cd "$(dirname "$0")/backend"
export GAMEBLOG_FRONTEND_PORT=5500
export SPRING_WEB_RESOURCES_STATIC_LOCATIONS="file:../frontend/"
exec mvn spring-boot:run
