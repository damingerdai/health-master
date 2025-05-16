#!/bin/bash

sha=$(git rev-parse HEAD)

kubectl set image deployment/health-master-api health-master-api=health-master:${sha} -n health-master-namespace 
kubectl rollout status deployment/health-master-api -n health-master-namespace

