---
publish: false
title: "[Kubeflow] Apple silicon 환경에서 Kubeflow 설치하기"
date: "2023-01-12"
category: ["ML ops", "kubeflow"]
thumbnail: "/assets/blog/mlops/kubeflow/thumbnail.png"
ogImage:
  url: "/assets/blog/mlops/kubeflow/thumbnail.png"
desc: "Apple silicon 환경에서 minikube를 활용해 로컬로 kubeflow 구축하는 방법을 설명합니다. Apple silicon 기반에서 설치 가이드를 따라하기 힘든 이유는 주로 가상환경을 지원하는 프로그램이 Arm64를 호환하지 않거나 kubeflow 일부 컴포넌트가 Arm64를 호환하지 않기 때문입니다. 다양한 시도를 통해 알아낸 바로는 Apple slilcon 기반의 로컬에서 kubeflow를 설치하기 위해선 Docker를 통해 kubernetes를 실행하고, kubeflow 1.6 버전을 설치 해야합니다."
---

### 들어가며

이 글은 Apple silicon 환경에서 minikube를 활용해 로컬로 kubeflow 구축하는 방법을 설명합니다.

Apple silicon 기반에서 설치 가이드를 따라하기 힘든 이유는 주로 가상환경을 지원하는 프로그램이 Arm64를 호환하지 않거나 kubeflow 일부 컴포넌트가 Arm64를 호환하지 않기 때문입니다. 다양한 시도를 통해 알아낸 바로는 Apple slilcon 기반의 로컬에서 kubeflow를 설치하기 위해선 Docker를 기반으로 kubernetes를 실행해야하며, kubeflow 1.6 버전을 설치 해야합니다.

> kubeflow를 설치하고 운영하는 것이 목적이 아닌, kubeflow 사용이 주 목적이라면 클라우드 환경에서 kubeflow를 지원하는 [Arrikto](https://www.arrikto.com/kubeflow-as-a-service/)를 활용하는 것을 권장합니다.

<br/>

### 주의사항

kubeflow를 설치하는 과정이 매끄럽지만은 않습니다. 아래 설명을 충실히 따르며 설치하지 않는 이상 제대로 설치되지 않을 가능성이 높습니다. 에러 원인을 파악하는 과정에 많은 시간 소모가 발생하니 최대한 설명대로 따라해주세요.

<br/>

### 기존 설치 프로그램 제거하기

kubeflow 설치에 필요한 버전은 다음과 같습니다.

```
- kubernetes 1.21.
- kustomize 3.2.0
- kubectl 1.21.
```

버전을 맞추기 위해 기존에 설치한 프로그램을 제거하겠습니다.

```bash
$ brew uninstall minikube
$ brew uninstall kubectl
$ brew uninstall kustomize
$ brew cleanup
```

<br/>

### colima 설치하기(선택사항)

colima는 docker desktop을 사용하지 않아도 docker를 바로 사용할 수 있게 하는 프로그램입니다. brew를 통해 간단하게 설치할 수 있고 사용법 또한 간단합니다.

> colima를 설치하지 않아도 docker desktop을 활용해 kubeflow 설치 가이드를 따라 할 수 있습니다.

```bash
$ brew install colima

# 설치 확인
$ colima version
```

<br/>

### kustomize 3.2.0 설치하기

제거했던 프로그램들을 버전에 맞게 재설치 하겠습니다. 설치 순서는 kustomize → kubectl → minkube 순 입니다. brew는 최신 버전 설치만을 지원하므로 kustomize 3.2.0은 수동으로 설치하겠습니다.

```bash
$ brew install wget
$ wget https://github.com/kubernetes-sigs/kustomize/releases/download/v3.2.0/kustomize_3.2.0_darwin_amd64
$ chmod +x kustomize_3.2.0_darwin_amd64
$ mv kustomize_3.2.0_darwin_amd64 /usr/local/bin/kustomize
$ export PATH=$PATH:/usr/local/bin/kustomize

# 설치 확인
$ kustomize version

>>> Version: {KustomizeVersion:3.2.0 GitCommit:a3103f1e62ddb5b696daa3fd359bb6f2e8333b49 BuildDate:2019-09-18T16:26:36Z GoOs:darwin GoArch:amd64}

```

<br/>

### kubectl 1.21.12 설치하기

```bash
$ curl -LO "https://dl.k8s.io/release/v1.21.12/bin/darwin/arm64/kubectl"
$ chmod +x ./kubectl
$ sudo mv ./kubectl /usr/local/bin/kubectl
$ sudo chown root: /usr/local/bin/kubectl
```

<br/>

### minikube 설치하기

```bash
brew install minikube
```

<br/>

### kubeflow 1.6 로컬에 저장하기

Apple silicon은 kubeflow 1.6 이하 버전을 설치할 수 없습니다. kubeflow의 컴포넌트 중 Arm64를 지원하지 않는 컴포넌트가 있기 때문입니다. kubeflow 1.6 보다 낮은 버전 설치를 시도해봤다면 Istio의 상태가 pending으로 유지되는 것을 경험하셨을 겁니다.

Istio는 2022년 11월 릴리즈 된 1.16 버전부터 Arm64를 호환합니다. kubeflow는 1.6 버전부터 Istio 1.16 버전을 활용하므로 Apple silicon에서 kubeflow 로컬 환경을 구성하려면 kubeflow 1.6 버전이 필요합니다.

kubeflow 1.6 버전을 사용해야하는 이유를 알았으니 이제 kubeflow 1.6을 로컬에 저장하겠습니다.

```bash
git clone https://github.com/kubeflow/manifests.git

cd manifests
```

<br/>

### minikube 실행하기

본격적으로 kubeflow를 설치하겠습니다. docker 환경에서 minikube를 실행해야하므로 colima 또는 docker desktop을 실행해주세요. colima를 사용하는 경우 `colima start --cpu 4 --memory 9` 명령어로 실행합니다.

아래의 명령어로 minikube 설치를 시작합니다. kubernetes 버전은 1.21.xx 버전이면 모두 가능합니다.

```bash
$ minikube start --driver=docker --kubernetes-version=1.21.12 --memory=8192 cpus=4
```

정상적으로 실행됐다면 `minikube config view vm-driver` 명령어로 memory, cpu가 제대로 할당 됐는지 확인합시다.

<br/>

### kubeflow 설치하기

kubeflow는 수십개의 컴포넌트로 구성되어 있습니다. kubeflow를 구성하는 컴포넌트로는 Jupyter notebook, AutoML 라이브러리인 katib, kubeflow Pipeline, Training operator 등이 있습니다. 이러한 컴포넌트들이 kubernetes를 기반으로 개별적으로 실행되고 연결되면서 kubeflow를 구성하게 됩니다. 개별 기능이 컴포넌트로 구성된 만큼 필요에 따라 원하지 않는 컴포넌트를 불러오지 않아도 kubeflow를 정상적으로 실행 할 수 있습니다. 예로들어 AutoML을 사용할 필요가 없다면 굳이 katib 컴포넌트를 불러오지 않아도 됩니다. 그렇게 하더라도 정상적으로 kubeflow를 실행할 수 있습니다.

이제 컴포넌트를 minikube로 불러오겠습니다. 개별 컴포넌트를 하나씩 불러올 수 있지만 오랜 시간이 걸리므로 아래의 명령어로 한 번에 모든 컴포넌트를 불러오겠습니다. 이 명령어는 모든 컴포넌트가 불러와질 때 까지 10초 간격으로 반복됩니다. 평균 3회의 루프를 진행하면 모든 컴포넌트를 불러올 수 있습니다.

> 컴포넌트를 하나하나 실행시키는 방법이 궁금하다면 [kubeflow github](https://github.com/kubeflow/manifests#installation)를 참고하세요.

```
while ! kustomize build example | kubectl apply -f -; do echo "Retrying to apply resources"; sleep 10; done
```

> ❗️ 무한루프에 빠졌다면 10분 정도 내버려 둔 뒤 `control(^)+C`를 눌러 종료해주세요.

**설치 과정에서 무한루프를 경험했다면 아래 문단을 참고하세요.**

개인적인으로 1.6 버전을 설치할 때 무한루프를 경험했고, 1.5 버전 설치할 때는 경험하지 못했습니다. 1.6 버전에서 무한루프에 빠지게 된 이유는 `Profiles + KFAM` 컴포넌트가 제대로 불러와지지 않아 발생한 것 같습니다. `Profiles + KFAM`가 설치되지 않으니 `kubeflow-user-example-com`에 필요한 조건이 형성되지 않아 아래와 같은 에러가 발생한 것으로 추정됩니다. 따라서 무한 루프를 강제 종료 한 뒤 `Profiles + KFAM`와 `kubeflow-user-example-com`를 직접 설치하면 정상 작동합니다.

```
error: resource mapping not found for name: "kubeflow-user-example-com" namespace:
"" from "STDIN": no matches for kind "Profile" in version "kubeflow.org/v1beta1"
ensure CRDs are installed first
```

`Profiles + KFAM`와 `kubeflow-user-example-com` 설치 하기에 앞서 다른 컴포넌트가 정상적으로 불러와졌는지 확인해야합니다. 무한루프 상태에서 10분 간 내버려 뒀다면 대부분 강제 종료 후 `kubectl get pods --all-namespaces`로 상태 확인 시 대부분의 컴포넌트 상태가 running으로 표시됩니다. 만약 모든 pod가 running 상태가 되지 않았다면 running 상태가 될때까지 기다려주세요. 이때 Training operator의 경우 crashloopbackoff 또는 Error 상태가 되도 무방합니다. 이에 대해서는 다음 단계에서 설명하겠습니다.

```
# 컴포넌트가 정상작동하는지 확인

kubectl get pods --all-namespaces
```

<img src='/assets/blog/mlops/kubeflow/installation_guide/running.png' alt='running'>

<br/>
<br/>

Training operator를 제외하고 모든 컴포넌트가 running 상태라면 `Profiles + KFAM` 와 `kubeflow-user-example-com`를 설치 할 수 있습니다. 아래의 명령어를 실행한 뒤 `kubectl get pods --all-namespaces` 명령어로 상태를 체크해주세요.

```
kustomize build apps/profiles/upstream/overlays/kubeflow | kubectl apply -f -

kustomize build common/user-namespace/base | kubectl apply -f -
```

<br/>

### Training operator 재설치하기

> Training-operator 상태가 running인 경우 지금 단계를 생략하고 다음 단계로 넘어가세요.

개인적인 경험으로 Training operator는 kubeflow 버전을 망라하고 설치가 되지 않았습니다. training operator의 정식 배포 버전이 문제인 것 같습니다. 가장 최신 버전을 설치하니 Training operator가 정상적으로 작동 됐습니다. Training operator 상태가 Crashloopbackoff 또는 Error 인 경우 아래 명령어를 실행해 주세요.

<img src='/assets/blog/mlops/kubeflow/installation_guide/training-operator.png' alt='training-operator'>

> OOMKilled으로 표시되는 경우 메모리가 부족해서 실행되지 않는 것이므로 minikube의 메모리를 늘려주세요.

```
kubectl apply -k "github.com/kubeflow/training-operator/manifests/overlays/standalone"
```

<br/>

### 개별 컴포넌트 상태 확인하기

컴포넌트가 제대로 실행됐는지 namespace 별로 하나하나 확인해 봅시다. 제대로 실행되지 않았거나 namespace가 존재하지 않은 경우 [kubeflow github](https://github.com/kubeflow/manifests#installation)를 참고해 실행해주세요.

```bash
$ kubectl get pods -n cert-manager
$ kubectl get pods -n istio-system
$ kubectl get pods -n knative-eventing
$ kubectl get pods -n auth
$ kubectl get pods -n knative-serving
$ kubectl get pods -n kubeflow
$ kubectl get pods -n kubeflow-user-example-com
```

<br/>

### kubeflow 실행하기

아래 명령어를 실행한 뒤 [localhost:8080](http://localhost:8080)에 접속하세요.

```bash

kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80

```

아이디와 비밀번호를 입력하면 kubeflow에 접속합니다.

- Email Address: `user@example.com`
- Password: `12341234`

<br/>

### Tip! kubeflow 저장 및 불러오기

kubeflow를 실행하면 발열, 빠른 배터리 소모, 높은 메모리 사용량을 경험하게 됩니다. 맥북의 건강(?)을 위해서 kubeflow를 사용하지 않는 경우 가급적 정지해놓는 편이 좋습니다. kubeflow 설치 과정이 다소 번거롭기 때문에 `minikube stop` 명령어를 이용해 종료하는 것을 권장합니다. colima 또한 'colima stop' 명령어를 통해 종료합니다. 불러올 땐 역순으로 start 명령어를 사용하면 됩니다.

<br/>
