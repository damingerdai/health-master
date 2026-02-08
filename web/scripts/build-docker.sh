#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

usage() {
  cat <<EOF
Usage: $0 [-t IMAGE:TAG] [-f DOCKERFILE] [-n] [-p]

Options:
  -t IMAGE:TAG   Image name and tag to build (default: <cwd>:latest)
  -f DOCKERFILE  Path to Dockerfile (default: Dockerfile)
  -n             Do not use cache (--no-cache)
  -p             Push image after build
  -h             Show this help

Examples:
  $0 -t myrepo/health-web:latest
  IMAGE=myrepo/health-web:latest DOCKERFILE=./Dockerfile ./scripts/build-docker.sh -p
EOF
  exit 1
}

# defaults
IMAGE="health-master-$(basename "$PWD"):latest"
DOCKERFILE="Dockerfile"
NO_CACHE=false
PUSH=false

while getopts ":t:f:nph" opt; do
  case ${opt} in
    t ) IMAGE="$OPTARG" ;;
    f ) DOCKERFILE="$OPTARG" ;;
    n ) NO_CACHE=true ;;
    p ) PUSH=true ;;
    h ) usage ;;
    \? ) echo "Invalid option: -$OPTARG" >&2; usage ;;
    : ) echo "Missing option argument for -$OPTARG" >&2; usage ;;
  esac
done

if [ ! -f "$DOCKERFILE" ]; then
  echo "Dockerfile not found at: $DOCKERFILE" >&2
  exit 2
fi

echo "Building image: $IMAGE"
BUILD_CMD=(docker build -f "$DOCKERFILE" -t "$IMAGE" .)
if [ "$NO_CACHE" = true ]; then
  BUILD_CMD+=(--no-cache)
fi

"${BUILD_CMD[@]}"

echo "Built: $IMAGE"

if [ "$PUSH" = true ]; then
  echo "Pushing: $IMAGE"
  docker push "$IMAGE"
fi

echo "Done."
