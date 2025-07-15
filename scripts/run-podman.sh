#!/bin/bash

sha=$(git rev-parse --short HEAD)
iamge_name=localhost/health-master:${sha}

podman run --replace \
  --name heath-master \
  -p 8000:8000 \
  --env-file .env \
  -v ./configs/config.yaml:/app/configs/config.yaml \
  $iamge_name
