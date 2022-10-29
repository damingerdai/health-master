#!/bin/bash

sha=$(git rev-parse HEAD)

docker build -t health-master:${sha} .