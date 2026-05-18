#!/bin/sh
KUBE_NAMESPACE="health-master-namespace"
cd `dirname $0`
kubectl create configmap health-master-config --namespace="$KUBE_NAMESPACE" --from-file=config.yaml  --from-file=db.yaml -o yaml --dry-run=client | tee app-config.yaml