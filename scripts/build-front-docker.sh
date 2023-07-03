#!/bin/bash

sha=$(git rev-parse HEAD)

docker build -f web/Dockerfile -t health-master-web:${sha} ./web/
