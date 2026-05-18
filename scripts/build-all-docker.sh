#!/bin/bash

sha=$(git rev-parse --short HEAD)

echo "Building backend image: health-master:${sha}"
docker build -t health-master:${sha} .

echo "Building frontend image: health-master-web:${sha}"
docker build -f web/Dockerfile -t health-master-web:${sha} ./web/