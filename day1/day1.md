# Day 01


## login using terminal
``` bash
ssh <username/ID>@<ip address>
```

## enter your credentials
```
<username/id>@<ip>'s password:
```

## In vim editor 
### file name : pod.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: ml-service # label for selecting this pod
spec:
  containers:
  - name: pytorch-container
    image: //enter your image here
    resources: # resource quota
      requests:
        cpu: "8"
        memory: "16Gi"
        nvidia.com/mig-1g.18gb: 1
      limits:
        cpu: "8"
        memory: "16Gi"
        nvidia.com/mig-1g.18gb: 1
    command: ["/bin/bash", "-c", "while true; do sleep 3600; done"]

```

### pod-services.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod-1
  labels:
    app: pytorch-pod-label # label for selecting this pod
spec:
  containers:
  - name: pytorch-container
    image: //enter your image here
    resources: # resource quota
      requests:
        cpu: "8"
        memory: "16Gi"
        nvidia.com/mig-1g.18gb: 1
      limits:
        cpu: "8"
        memory: "16Gi"
        nvidia.com/mig-1g.18gb: 1
    command: ["/bin/bash", "-c", "while true; do sleep 3600; done"]
                                                                           
---


apiVersion: v1
kind: Service
metadata:
  name: my-service-1
spec:
  type: NodePort
  selector:
    app: pytorch-pod-label
  ports:
    - port: 8000
      targetPort: 8888
      protocol: TCP

```

## Deploy using kubernetes
 ```kubernetes
kubectl apply -f pod-services.yaml
```

## To check running status 

### for pods
```kubernetes
kubectl get pods
```
### for services
```kubernetes
kubectl get services
```

## To execute the pod and run in bash

```kubernetes
kubectl exec -it <podname> -- bash
```

## Run jupyter command after entering BASH