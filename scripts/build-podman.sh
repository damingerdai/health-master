#!/bin/bash

sha=$(git rev-parse --short HEAD)

podman build -t health-master:${sha} .
