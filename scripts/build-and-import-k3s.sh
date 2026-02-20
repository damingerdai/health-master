#!/bin/bash

set -e

sha=$(git rev-parse --short HEAD)

echo "Building backend image: health-master:${sha}"
podman build -t health-master:${sha} .

echo "Building frontend image: health-master-web:${sha}"
podman build -f web/Dockerfile -t health-master-web:${sha} ./web/

echo "Importing health-master:${sha} into k3s..."
podman save -o health-master-${sha}.tar health-master:${sha}
sudo k3s ctr images import health-master-${sha}.tar
rm health-master-${sha}.tar

echo "Importing health-master-web:${sha} into k3s..."
podman save -o health-master-web-${sha}.tar health-master-web:${sha}
sudo k3s ctr images import health-master-web-${sha}.tar
rm health-master-web-${sha}.tar

echo "Done. Images imported to k3s."