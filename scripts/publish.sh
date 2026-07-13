#!/bin/sh
set -eu

IMAGE="docker.io/linhnguyen96/vta-global-port"

if [ "$#" -gt 1 ]; then
  echo "Usage: sh scripts/publish.sh [version]" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or is not in PATH." >&2
  exit 1
fi

if ! docker buildx version >/dev/null 2>&1; then
  echo "Error: Docker Buildx is not available." >&2
  exit 1
fi

if short_sha=$(git rev-parse --short HEAD 2>/dev/null); then
  :
elif [ -n "${GIT_SHA:-}" ]; then
  short_sha=$GIT_SHA
else
  echo "Error: cannot determine Git SHA. Run in a Git repository or set GIT_SHA." >&2
  exit 1
fi

case "$short_sha" in
  ""|*[!0-9A-Fa-f]*)
    echo "Error: Git SHA must contain only hexadecimal characters." >&2
    exit 1
    ;;
esac

if [ "${#short_sha}" -lt 7 ]; then
  echo "Error: Git SHA must contain at least 7 hexadecimal characters." >&2
  exit 1
fi

short_sha=$(printf '%s' "$short_sha" | cut -c1-12 | tr '[:upper:]' '[:lower:]')
version=""

if [ "$#" -eq 1 ]; then
  version=$1
  case "$version" in
    v*) version=${version#v} ;;
  esac

  case "$version" in
    ""|[.-]*|*[!A-Za-z0-9_.-]*)
      echo "Error: version is not a valid Docker tag." >&2
      exit 1
      ;;
  esac

  if [ "${#version}" -gt 128 ]; then
    echo "Error: version exceeds Docker's 128-character tag limit." >&2
    exit 1
  fi
fi

echo "Publishing tags:"
echo "  $IMAGE:latest"
echo "  $IMAGE:sha-$short_sha"

set -- docker buildx build --platform linux/amd64 --pull \
  --tag "$IMAGE:latest" \
  --tag "$IMAGE:sha-$short_sha"

if [ -n "$version" ]; then
  echo "  $IMAGE:$version"
  set -- "$@" --tag "$IMAGE:$version"
fi

set -- "$@" --push .
"$@"
