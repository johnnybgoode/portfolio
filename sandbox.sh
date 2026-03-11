#!/usr/bin/env bash

GIT_USER=$(git config get user.name)
GIT_EMAIL=$(git config get user.email)
GIT_ROOT=$(cd $(git rev-parse --show-toplevel) && pwd)

IMAGE_REF="claude-sandbox:latest"
IMAGE=$(docker image ls --filter "reference=$IMAGE_REF" --format json)

SANDBOX_MODE="sandbox"
SANDBOX_REF="claude-sb-${GIT_ROOT##*/}"

DRY_RUN=false

run_cmd() {
  if $DRY_RUN; then
    echo "$@"
  else
    "$@"
  fi
}

build() {
  if [ -z "$IMAGE" ]; then
    echo 'Building image...'
    docker build --no-cache -t $IMAGE_REF -f Dockerfile .
  fi
}

createSandbox() {
  SANDBOX=$(docker sandbox ls --json | jq '.vms[]' -c | grep "$SANDBOX_REF")
  if [ -z "$SANDBOX" ]; then
    docker sandbox create -t $IMAGE_REF --name "$SANDBOX_REF" claude .
  fi
}

runSandbox() {
  run_cmd env GIT_USER="$GIT_USER" GIT_EMAIL="$GIT_EMAIL" docker sandbox run "$SANDBOX_REF"
}

execSandbox() {
  local opts=() cmd=() sep=false
  for arg in "$@"; do
    $sep && cmd+=("$arg") || [[ "$arg" == "--" ]] && sep=true || opts+=("$arg")
  done
  run_cmd docker sandbox exec "${opts[@]}" "$SANDBOX_REF" "${cmd[@]}"
}

runContainer() {
  run_cmd env GIT_USER="$GIT_USER" GIT_EMAIL="$GIT_EMAIL" docker compose run -i --rm sandbox
}

execContainer() {
  local opts=() cmd=() sep=false
  for arg in "$@"; do
    $sep && cmd+=("$arg") || [[ "$arg" == "--" ]] && sep=true || opts+=("$arg")
  done
  run_cmd docker compose exec "${opts[@]}" sandbox "${cmd[@]}"
}

usage() {
  echo "Usage: $0 [OPTIONS] [COMMAND]"
  echo ""
  echo "Options:"
  echo "  -n, --dry-run   Print docker commands without executing"
  echo "      --mode      Run mode: sandbox (default) or container"
  echo ""
  echo "Commands:"
  echo "  run             Run the container or sandbox for the current project (default)"
  echo "  exec            Execute a command inside the container/sandbox"
}

COMMAND="run"
EXTRA_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--dry-run) DRY_RUN=true; shift ;;
    --mode)
      case "${2:-}" in
        container) SANDBOX_MODE="container" ;;
        sandbox)   SANDBOX_MODE="sandbox" ;;
        *) usage; exit 1 ;;
      esac
      shift 2
      ;;
    run|exec) COMMAND="$1"; shift; break ;;
    *) usage; exit 1 ;;
  esac
done

EXTRA_ARGS=("$@")

build

if [ "$SANDBOX_MODE" = "container" ]; then
  case "$COMMAND" in
    run)
      runContainer
      ;;
    exec)
      execContainer "${EXTRA_ARGS[@]}"
      ;;
  esac
else
  case "$COMMAND" in
    run)
      createSandbox
      runSandbox
      ;;
    exec)
      execSandbox "${EXTRA_ARGS[@]}"
      ;;
  esac
fi
