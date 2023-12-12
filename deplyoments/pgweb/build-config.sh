#!/bin/sh
KUBE_NAMESPACE="health-master-namespace"
cd `dirname $0`

kubectl create configmap pgweb-config --namespace="$KUBE_NAMESPACE" --from-env-file=.env -o yaml --dry-run=client | tee config.yaml