#!/bin/bash

sha=$(git rev-parse --short HEAD)

echo "Building backend image: health-master:${sha}"
podman build -t health-master:${sha} .

echo "Building frontend image: health-master-web:${sha}"
podman build -f web/Dockerfile -t health-master-web:${sha} ./web/