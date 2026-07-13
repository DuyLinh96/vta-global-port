#!/bin/sh
set -eu

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or is not in PATH." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Error: Docker Compose v2 is not available." >&2
  exit 1
fi

docker compose pull web
docker compose up -d --no-build --wait --wait-timeout 120 web

container_id=$(docker compose ps -q web)
if [ -z "$container_id" ]; then
  echo "Error: web container is not running." >&2
  exit 1
fi

echo "Running image: $(docker inspect --format '{{.Config.Image}}' "$container_id")"
docker compose ps web
