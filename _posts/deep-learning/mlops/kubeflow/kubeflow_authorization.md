---
publish: false
title: "[Kubeflow] SSL 인증 문제 해결하기"
date: "2023-01-23"
category: ["ML ops", "kubeflow"]
thumbnail: "/assets/blog/mlops/kubeflow/thumbnail.png"
ogImage:
  url: "/assets/blog/mlops/kubeflow/thumbnail.png"
desc: "이 글은 kubeflow 관련 대표적인 인증 에러인 (60) SSL certificate problem: unable to get local issuer certificate와 /dex/auth?client_id=의 원인과 해결 방안에 대해 다루고 있습니다. "
---

### 들어가며

이 글은 kubeflow 관련 대표적인 인증 에러인 `(60) SSL certificate problem: unable to get local issuer certificate` 와 `/dex/auth?client_id=`의 원인과 해결 방안에 대해 다루고 있습니다. kubeflow를 배우는 과정에서 인증에 대한 부분을 새롭게 배우는 입장이다보니 설명이 다소 정확하지 않을 수 있습니다. 이해에 어려움이 있거나 설명이 잘못됐다고 생각하는 경우 글 작성에 참고했던 자료를 링크로 제공하였으니 활용바랍니다.

### (60) SSL certificate problem: unable to get local issuer certificate

#### 원인 이해하기

`(60) SSL certificate problem: unable to get local issuer certificate` 에러는 HTTPS 통신 과정에서 클라이언트가 서버를 신뢰할수 없기 때문에 발생합니다. 클라이언트가 처음으로 서버에 연결을 시도하면, 서버는 자신이 안전한(?) 서버라는 것을 증명하기 위해 클라이언트에 서버의 인증서(Certificate)를 제공합니다. 이때 클라이언트가 보유한 공개키로 해당 인증서를 확인할 수 없는 경우, 신뢰할 수 없는 서버라 판단해 통신을 중단하고 해당 에러 코드를 리턴합니다.

(60) SSL certificate problem은 클라이언트 쪽에서 문제를 삼는 것이므로, 문제를 삼지 않도록 설정한다면 정상적으로 서버 연결을 진행할 수 있습니다. curl 명령어 사용 시 `-k` flag를 사용하면 서버에 대한 인증 과정을 생략할 수 있고, 브라우저 사용 시 `이 사이트는 보안 연결(HTTPS)가 사용되지 않았습니다.` 라는 경고 문구가 뜬 체로 사이트를 이용한다면 인증 과정을 생략한 것입니다.

이때 클라이언트와 통신하고 Certificate를 클라이언트에 제공하는 과정은 `Istio ingress-gateway`가 수행합니다. 클라이언트는 Istio ingress-gateway에 접근해 통신을 요청하고 `Istio ingress-gateway`는 서버의 Certificate를 클라이언트에게 제공합니다. kubeflow의 기반이 되는 Istio는 기업이 고객에 제공하는 서비스 개수가 증가하고 내부에서도 상세 분야가 점차 증가하게 되면서 서비스 간 연동성 문제, 보안 문제 등을 해결하기 위해 개발된 애플리케이션입니다. Istio를 사용하면 서비스 간 상호 관계를 모니터링 할 수 있고 문제 발생 시 에러가 발생한 서비스를 찾을 수 있기에 보편적으로 사용하고 있다고 합니다.

> Istio에 대한 내용은 tkdguq05님이 작성한 [**kubeflow에 istio가 왜 필요할까**](https://tkdguq05.github.io/2022/10/02/kubeflow-istio/)를 읽어보시기 바랍니다.

아래의 그림은 kubeflow의 전체 인증 구조를 보여줍니다. 클라이언트는 Gateway에 접근하여 통신 의사를 전달하고, Gateway는 클라이언트에게 Certificate를 보내 자신을 증명하면서 본격적인 통신을 시작하려 합니다. 하지만 클라이언트는 서버가 제공한 Certificate를 신뢰하지 못하므로 (60) SSL certificate problem 에러를 내고 연결을 종료합니다.

**지금까지 설명을 종합해보면, `(60) SSL certificate problem: unable to get local issuer certificate` 에러는 클라이언트가 서버의 Certificate를 신뢰하지 못하기 때문에 비롯한 것이므로, 이를 해결하기 위해선 서버가 신뢰할 수 있는 Certificate를 클라이언트에게 제공해야 합니다.**

<img src='/assets/blog/mlops/kubeflow/kubeflow_authorization/img1.png' alt='img1'>

<br/>

### 문제 해결하기

(60) SSL certificate problem의 원인은 클라이언트가 서버의 Certificate를 신뢰하지 않기 때문이었습니다. 그렇다면 어떻게 해야 클라이언트가 서버를 신뢰하고 통신을 이어나갈 수 있을까요?

방법은 두 가지가 있습니다. 하나는 인증기관(제3자)에게 서버 검증을 맡기는 방법입니다. 서버는 안전한(?) 서버임을 인증받기 위해 서버와 관련된 Certificate를 제출하면 인증기관은 서명하는 방법으로 인증받은 서버임을 공증하는 방법입니다. 이때 서버 관리자는 클라이언트가 신뢰하는 인증기관에 의뢰를 요청해야만 해당 클라이언트와 통신을 수행할 수 있습니다. 다른 방법은 클라이언트가 직접 인증기관 역할을 수행해 서버에 대한 Certificate를 서명하고 통신에 활용하는 것입니다. 이 방법이 가능한 이유는 에러 발생 원인이 클라이언트가 신뢰하지 못해서 발생했기 때문입니다. 따라서 클라이언트가 인증기관 역할을 자처해 서버 certificate를 서명하더라도 문제가 없게 되는 것입니다.

방금 설명한 두 종류의 방법은 인증기관이 서버를 인증했는지, 클라이언트가 직접 인증을 했는지 차이만 있을 뿐 모든 것이 동일합니다. 이 글에서는 후자의 방법인 클라이언트가 인증기관을 자처해 서버의 certificate를 서명하는 방법을 사용할 예정입니다.

#### ❖ HTTPS 통신 이해하기

클라이언트가 인증기관을 자처해 서버의 certificate를 서명하는 방법을 적용해 (60) SSL certificate problem 문제를 해결하기 위해선, 인증서를 제작하고 이를 통신에 활용하는 방법을 배워야 합니다. 실제로 인증서를 생성하고 활용하는 과정은 이에 대한 이론적인 바탕을 알아야만 이해할 수 있습니다. 따라서 이 문단은 `Certificate 생성하기` 문단을 이해할 수 있을만큼의 범위내에서 개념을 설명하고자 합니다. HTTPS 이론에 대한 추가 학습이 필요한 경우 아래 링크를 읽어보시기 바랍니다.

- 생활코딩님: [**HTTPS와 SSL 인증서**](https://opentutorials.org/course/228/4894)
- 호롤리님: [**호다닥 공부해보는 x509와 친구들**](https://gruuuuu.github.io/security/what-is-x509/)
- 인디개발자님: [**OpenSSL 로 Root CA 생성하여 Self signed SSL 인증서 발급하기**](https://indienote.tistory.com/605)
- seungjuitmemo님: [**k8s TLS Certificate 정리**](https://seungjuitmemo.tistory.com/245)

<br/>

우리가 생성하려는 Certificate는 공개키 방식과 대칭키 방식을 혼합한 인증 방법입니다. 그러므로 공개키 방식과 대칭키 방식이 무엇인지, 어떻게 활용되는지부터 알아보겠습니다.

- 대칭키 방식 : 암호화 복호화를 하나의 키로 수행
- 공개키 방식(PKI) : 암호화 키 따로 복호화 키 따로 생성

이때 공개키 방식은 암호화, 복호화 키 둘 중 하나는 공개용으로, 나머지 하나는 비공개용으로 활용합니다. 공개키 방식은 두 가지 방법으로 활용 가능합니다.

- **암호화키를 공개키로, 복호화키를 개인키로 (통신용)**

  공개키를 암호화키로 배포하고 개인키를 복호화키로 개인이 보관하는 방법입니다. 이 방법은 데이터 통신에 활용될 수 있습니다. 활용방법은 이러합니다. 먼저 서버가 클라이언트에게 공개키를 전송하고 클라이언트는 제공받은 공개키로 데이터를 암호화해 서버에 다시 전송합니다. 서버는 암호화 된 데이터를 복호화해 클라이언트가 전송한 데이터가 무엇인지를 확인합니다.

  데이터 전송에 사용되는 공개키 방식은 보안상 강력한 방법이긴 하지만, 암호화, 복호화 과정에서 상당한 컴퓨팅 리소스가 필요하므로 실제 통신에는 일부 단계에서만 사용되고 있습니다.

    <img src='/assets/blog/mlops/kubeflow/kubeflow_authorization/img2.png' alt='img2'>

- **복호화키를 공개키로, 암호화키를 개인키로 (인증용)**

  통신용과 반대로 복호화키를 공개키로 배포하고 암호화키를 개인키로 사용하는 방법입니다. 이 방법은 서버 인증서를 인증하는 용도로 활용합니다. 개인키로 암호화된 데이터를 공개키로 복호화할 경우 상대방이 해당 개인키를 가지고 있음을 알 수 있기 때문입니다. 따라서 공인이 서버의 인증서를 개인키로 암호화하면(이를 전자서명이라 합니다.) 클라이언트는 공인의 공개키로 서버의 인증서를 복호화함으로써 해당 서버가 공인으로부터 인증받았음을 확인할 수 있습니다.

  이처럼 서버를 인증하는 주체를 Certificate Authority(CA)라 합니다. 다시말해, CA는 특정 서버가 신뢰할 수 있는 서버라고 인증하는 기관입니다. CA가 암호화 하는 대상은 서버 정보와 서버 공개키가 담겨있는 인증서입니다. 이때 서버는 CA의 인증을 받기 위해 CSR이라는 양식을 작성해 CA에게 제공합니다. 인증 요청서를 받은 CA는 해당 서버의 정보를 확인하고 믿을 수 있는 서버인지를 점검한 뒤 서버 인증서에 전자서명한 뒤 반환합니다. 전자서명이라는 행위는 CA의 개인키로 인증서를 암호화하는 절차를 의미하며, 공인의 인증을 받은 서버는 클라이언트에 인증서를 제공함으로서 믿을만한 서버임을 입증하게 됩니다. 아래의 그림은 서버가 CA에게 인증서를 요청하는 단계부터 실제 통신에 활용하기까지의 단계까지의 과정을 나타냅니다.

    <img src='/assets/blog/mlops/kubeflow/kubeflow_authorization/img3.png' alt='img3'>

  마지막 6번째 단계는 클라이언트가 서버의 인증서를 CA의 공개키로 복호화하는 단계입니다. 서버의 인증서가 CA의 공개키로 복호화 된다면 서버 인증서는 CA의 개인키로 암호화 했음을 의미합니다. 클라이언트는 CA를 신뢰하므로 CA가 인증한 서버를 신뢰하고 서버와 통신을 진행합니다.

이제 공개키 방식의 개념과 활용 방법에 대한 이해를 바탕으로 클라이언트와 서버가 통신하는 방법을 보다 상세하게 설명하겠습니다.

클라이언트와 서버가 보안으로 통신하는 방법을 `TLS handshake`라 하며 해당 단계는 Handshake ⇒ Session ⇒ End session으로 구분됩니다. 이중 설명이 필요한 부분은 서버에 대한 인증을 수행하고 실제 데이터를 전송하기 직전까지의 과정인 Handshake이므로 Handshake 대해서만 설명하도록 하겠습니다.

<img src='/assets/blog/mlops/kubeflow/kubeflow_authorization/img4.png' alt='img4'>

1. **client hello**

   클라이언트가 서버 접속을 시도하기 위한 첫 단계입니다. 클라이언트는 서버에게 클라이언트가 생성한 랜덤 데이터, 클라이언트가 지원하는 암호화 방식을 서버에 제공합니다.

2. **Server hello**

   서버가 생성한 데이터, 클라이언트가 지원한 암호화 방식 중 서버가 선택한 방식, 그리고 **Certificate**를 제공합니다.

3. **인증서 복호화**

   앞에서 설명한 6번째 단계입니다. 클라이언트가 서버의 인증서를 공인 공개키로 복호화하여 해당 서버가 공인의 인증을 받은 서버인지를 확인합니다. 또한 서버의 공개키를 인증서 복호화를 통해 확보합니다.

4. **Pre master secret**

   1단계 client hello에서 생성한 랜덤 데이터와, 2단계 server hello에서 생성한 랜덤 데이터를 종합해 pre master secret을 생성합니다. pre master secret은 클라이언트와 서버가 실제 데이터를 주고 받을때 활용할 대칭키를 생성하기 위한 사전 준비물입니다.

   공개키 사용방법 설명에서, 데이터 전송에 활용되는 공개키 방법은 암호화와 복호화에 드는 컴퓨팅 리소스가 상당하므로 일부 통신에서 제한적으로 사용된다 설명한 바 있습니다. 이제 이 방법을 사용할 때가 왔습니다. 데이터 전송을 위한 공개키 방식은 클라이언트에서 생성한 pre master secret을 서버에 안전하게 제공하기 위한 용도로 사용됩니다. 클라이언트는 3단계에서 수행한 인증서 복호화를 통해 확보한 서버 공개키를 활용해 pre master secret을 암호화합니다. 그리고 암호화 된 pre master secret을 서버에게 전송합니다. 서버는 개인키를 활용해 복호화해 클라이언트와 동일한 pre master secret을 확보하게 됩니다.

   이 단계에서 꼭 알아야할 것은 pre master secret을 기반으로 서버와 클라이언트 간 공유하는 **대칭키**를 만든다는 점에 있습니다. 공개키 방식은 서버 인증과 pre master secret를 전송하는 용도에 활용되고, 클라이언트와 서버 간 실제 통신은 대칭키를 기반으로 수행됩니다. 따라서 이렇게 공들여 만들어진 대칭키가 공개된다면 서버와 클라이언트 간 통신 데이터를 제3자가 쉽게 접근할 수 있으므로 생성한 대칭키는 절대로 노출되어서는 안됩니다.

5. **Session Key Creation**

   클라이언트, 서버 모두가 pre master secret을 가졌다면 Session key를 생성하고 본격적으로 데이터 전송이 가능한 단계인(Session)에 진입합니다. 이제 서버와 클라이언트는 Session key를 활용해 암호화 된 데이터를 주고 받습니다.

#### ❖ Certificate 생성하기

지금부터는 kubeflow 사용중 발생하는 **`(60) SSL certificate problem: unable to get local issuer certificate`** 에러를 직접 해결해보겠습니다. 에러의 원인은 클라이언트가 갖고 있는 CA 공개키 중에서 서버가 제공한 Certifiacte를 복호화 할 수 있는 공개키가 없기 때문에 발생한 것이라 설명했습니다. 따라서 서버 클라이언트가 신뢰하는 CA의 인증을 받은 Certificate를 활용한다면 해당 에러를 해결 할 수 있습니다.

앞서 설명했듯 이번예제는 개인이 CA 역할을 수행하는 방법을 통해 인증서를 제작하는 방법을 사용하겠습니다. 이 방법은 인증 주체가 개인이라는 점에서 차이가 있을 뿐 방법이나 인증절차 모든 것이 똑같습니다. 아래의 그림에서 공인(C)의 역할을 클라이언트(A)가 대신 수행할 뿐입니다.

<img src='/assets/blog/mlops/kubeflow/kubeflow_authorization/img3.png' alt='img3'>

> 개인이 인증한 Certificate는 로컬 환경 또는 쿠버네티스 클러스터 내부에서만 활용해야 합니다. 외부 공개 목적의 서버의 경우 공인된 기관의 Certificate를 활용해야 합니다.

<!-- 인증서를 수행해야할 단계는 다음과 같습니다.

1. CA 역할을 수행할 개인키와 공개키를 생성합니다.
2. 서버에서 통신에 사용할 개인키와 인증요청서인 CSR을 생성합니다.
3. CA 용 개인키와 공개키로 CSR을 서명해 Certificate를 생성합니다.
4. 개인키와 공개키를 쿠버네티스에서 Secret으로 등록합니다.
5. istio Ingress-gateway서버에서 등록한 Secret을 활용할 수 있도록 세팅합니다.
6. 정상적으로 통신을 수행하는지 점검합니다. -->

**인증서 생성 및 쿠버네티스에 적용하기**

인증서를 생성하고 쿠버네티스에 적용해 활용하는 방법을 7단계로 구분해 설명하겠습니다.

1. 먼저 Certficate를 저장할 임의의 폴더를 생성합니다. 제가 생성한 폴더는 `cert` 입니다.

   ```bash
   mkdir cert
   ```

2. 도메인명과 서버명을 변수로 저장합니다. 변수들은 인증서와 개인키의 파일명으로 사용됩니다. 이때 변수명은 예시와 같이 소문자로 작성하셔야 하며 SERVER_NAME의 경우 kubeflow 접속에 활용하는 DNS 주소를 적어야 합니다. localhost로 접속하는 경우 localhost를 사용해주세요. localhost 대신 ip로 kubeflow를 접속한다면 [ip로 self-sign Certificate 생성하기](https://nodeployfriday.com/posts/self-signed-cert/)를 보고 따라해주세요.

   ```bash
   export DOMAIN_NAME=leeway
   export SERVER_NAME=localhost # Domain Name
   ```

3. Root Certificate를 생성하겠습니다. 아래의 명령어로 leeway.crt, leeway.key를 생성합니다. leeway.crt는 CA의 공개키, leeway.key는 CA의 개인키 기능을 수행합니다.

   ```bash
   # root CA 생성 (DOMAIN_NAME.crt, DOMAIN_NAME.key 생성)
   openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=${DOMAIN_NAME} Inc./CN=${DOMAIN_NAME}' -keyout $DOMAIN_NAME.key -out $DOMAIN_NAME.crt
   ```

4. 서버에 활용할 private key(SERVER_NAME.key)와 RootCA에게 인증을 요청하는 양식인 CSR을(SERVER_NAME.csr) 생성합니다.

   ```bash
   # SERVER_NAME.csr, SERVER_NAME.key 생성
   openssl req -out $SERVER_NAME.csr -newkey rsa:2048 -nodes -keyout $SERVER_NAME.key -subj "/CN=$SERVER_NAME/O=hello world from $DOMAIN_NAME"
   ```

5. 생성한 CSR을 leeway.key와 leeway.crt를 활용해 전자서명합니다. 아래의 명령어를 통해 전자서명 된 서버의 Certificate가 생성됩니다. 이렇게 생성된 Certificate는 leeway.crt에 의해 복호화가 가능합니다.

   ```bash
   # 인증서에 내용 주입(SERVER_NAME.crt)
   openssl x509 -req -days 365 -CA $DOMAIN_NAME.crt -CAkey $DOMAIN_NAME.key -set_serial 0 -in $SERVER_NAME.csr -out $SERVER_NAME.crt
   ```

   최종 결과물은 총 5개 입니다.

   ```bash
   leeway.crt
   leeway.key
   localhost.key
   localhost.csr
   localhost.crt
   ```

   <br/>

   > **확장자별 의미**
   >
   > `.key` files are generally the private key, used by the server to encrypt and package data for verification by clients.
   >
   > `.pem` files are generally the public key, used by the client to verify and decrypt data sent by servers. PEM files could also be encoded private keys, so check the content if you're not sure.
   >
   > `.cert` or `.crt` files are the signed certificates -- basically the "magic" that allows certain sites to be marked as trustworthy by a third party.
   >
   > `.csr` is a certificate signing request, a challenge used by a trusted third party to verify the ownership of a keypair without having direct access to the private key (this is what allows end users, who have no direct knowledge of your website, confident that the certificate is valid). In the self-signed scenario you will use the certificate signing request with your own private key to verify your private key (thus self-signed). Depending on your specific application, this might not be needed. (needed for web servers or RPC servers, but not much else).
   >
   > 참고 : [https://stackoverflow.com/questions/63195304/difference-between-pem-crt-key-files](https://stackoverflow.com/questions/63195304/difference-between-pem-crt-key-files)

6. 서버 인증서인 localhost.crt와 서버 개인키인 localhost.key를 쿠버네티스에 secret으로 업로드 합니다. 명령어는 localhost.crt와 localhost.key가 위치한 경로에서 수행해야 합니다. 서버 인증서와 개인키를 담은 secret은 leeway-certs라는 이름으로 저장됩니다.

   ```bash
   # secret으로 저장
   kubectl create secret tls $DOMAIN_NAME-certs -n istio-system --key $SERVER_NAME.key --cert $SERVER_NAME.crt
   ```

7. 다음으로 인증서 확인을 담당하는 `istio-ingressgateway`에게 앞으로 통신은 leeway-certs를 활용해야한다고 인지 시켜야 합니다. 현재 실행중인 Gateway를 대체하기 위해 아래의 yaml 파일을 생성해 적용하겠습니다. 이때 **CredentialName**을 앞 단계에서 생성한 secret name으로 적용해야 합니다.

   ```yaml
   apiVersion: networking.istio.io/v1alpha3
   kind: Gateway
   metadata:
     name: kubeflow-gateway
     namespace: kubeflow
   spec:
     selector:
       istio: ingressgateway
     servers:
       - hosts:
           - "*"
         port:
           name: http
           number: 80
           protocol: HTTP
         # Upgrade HTTP to HTTPS http로 접속해도 https로 경로를 바꿔줌
         tls:
           httpsRedirect: true
       - hosts:
           - "*"
         port:
           name: https
           number: 443
           protocol: HTTPS
         tls:
           mode: SIMPLE
           # 저장한 이름 확인 필수!!!
           credentialName: leeway-certs
   ```

8. 서버에 제대로 적용 됐는지 curl을 활용해 검증하도록 하겠습니다. 정상 인증이 됐다면 `/dex/auth?client_id`를 출력합니다. 이제 curl에 `--cacert leeway.crt` flag를 추가하면 https 인증을 수행할 수 있습니다.

   ```bash
   # CA 공개키(leeway.crt) 활용
   curl -v --cacert leeway.crt https://localhost:8080

   <a href="/dex/auth?client_id=kubeflow-oidc-authservice&amp;redirect_uri=%2Flogin%2Foidc&amp;response_type=code&amp;scope=profile+email+groups+openid&amp;state=MTY3NDQ1NzU1MHxFd3dBRUU1bVNFczFZVGcwYW1wS2EzZDZSR3M9fLBDAgvo2G5Aj-pyeWMuinWA2AvrlgUH4RDs2xtBkXKJ">Found</a>.
   ```

<br/>
<br/>

### /dex/auth?client_id= 에러

#### 원인 이해하기

https 통신이 제대로 수행되면 이제는 `/dex/auth?client_id=kubeflow-oidc-authservice&amp…`와 같은 에러에 직면하게 됩니다. 해당 결과값은 서버가 사용자를 인증할 수 없기 때문에 발생한 결과입니다.

이러한 에러가 발생하는 과정을 살펴보겠습니다. Https 인증을 통해 Istio Gateway와 소통을 시작하면 먼저 Auth Service을 통해 클라이언트를 인증하는 과정을 수행합니다. Authserivce는 Istio 시스템의 일부인 `ext_authz Service`에서 담당하고 있습니다. 서버에 대한 요청(request)은 모두 Auth service를 거쳐 인증된 클라이언트의 요청인지를 검증하는 과정을 거칩니다.

> **Auth Service 정의**
>
> The AuthService is an implementation of Envoy’s ext_authz interface. For every request that reaches Envoy, it will make a request to the AuthService to ask if that request is allowed.

Auth service에서 로그인을 요구 받으면 OpenID Connect (OIDC) 서비스인 Dex로 넘어가게 됩니다. 이때 `/dex/auth?client_id=` 에러는 요청이 Dex 서버에 넘어가면서 발생하게 됩니다. 브라우저로 kubeflow를 접속할 땐 Auth service를 거친 다음 Dex 로그인 페이지로 넘어가지만 Curl을 사용해 request를 보내면 `/dex/auth?client_id=`와 같은 결과를 제공해 클라이언트에게 로그인이 필요함을 알립니다.

브라우저나, curl, python을 통해 로그인을 하고나면(python을 활용해 로그인하는 방법은 문제 해결하기 문단에서 설명합니다.) 서버는 인증된 클라이언트라는 의미로 session cookie를 건내줍니다. 이제부터 로그인한 사용자는 서버에 요청(request)를 보낼 시 Session cookie를 함께 보내 인증받은 사용자임을 서버에게 알려야만 합니다. 이때 서버는 Session cookie를 바탕으로 클라이언트의 인증여부, 세부권한, 개인 세팅값 등을 확인하고 개별 사용자에게 맞는 설정값을 제공합니다.

> Dex에 대한 소개는 Alice님의 [181. [Kubernetes] 쿠버네티스 인증 3편: Dex와 Github OAuth (OIDC) 를 이용한 사용자 인증하기](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alice_k106&logNo=221598325656)를 참고하시기 바랍니다.

<img src='/assets/blog/mlops/kubeflow/kubeflow_authorization/img5.png' alt='img5'>

<br/>
<br/>
<br/>

Session cookie는 서버가 클라이언트를 구분하는 용도로 활용됩니다. kubeflow는 쿠버네티스 내부에서는 namespace와 RBAC로 사용자의 권한과 설정값을 유지하고 있습니다. session cookie는 클라이언트가 어떠한 namespace와 매칭되는지를 확인하는데 활용됩니다. 따라서 클라이언트는 매번 Session cookie를 서버에 제공해서 내가 사용자 A이다 라는 인증값을 보내야합니다.

아래의 그림은 사용자가 kubeflow dashboard에 접근하기까지의 과정을 보여줍니다. 로그인하지 않은 사용자는 로그인 과정을 통해 dex로부터 session cookie를 제공받아 서버에 요청시 마다 이를 함께 보내야 합니다.

<img src='/assets/blog/mlops/kubeflow/kubeflow_authorization/img6.png' alt='img6'>

<br/>
<br/>

/dex/auth?client_id= 에러의 원인을 정리하자면, 클라이언트가 서버에 요청 시 서버에서 제공한 session cookie를 함께 제공하지 않아 발생한다고 할 수 있습니다. 이미 session cookie가 있다면 요청 시 함께 보내야하며 session cookie가 없다면 클라이언트 인증(로그인)을 통해 서버로부터 session cookie를 제공 받아야합니다. 따라서 로그인을 통해 session cookie를 얻고 요청에 함께 포함한다면 dex/auth?client_id= 에러를 해결할 수 있게 됩니다.

### 문제 해결하기

session cookie를 얻는 방법은 curl을 이용한 방법, 브라우저를 이용한 방법, python을 이용한 방법이 있습니다. 이 글에서는 파이썬을 활용한 방법에 대해서만 소개하겠습니다. 그 다음 검증 차원에서 session cookie를 활용해 Local에서 kfp client를 활용해보겠습니다.

> curl을 이용한 방법과 브라우저를 이용한 방법은 봉자씨님의 [020. [Kubeflow][kserve] 인증문제 해결하기 (Istio-Dex)](http://bongjasee.tistory.com/22)에서 상세히 소개하고 있으니 해당 페이지를 참고바랍니다.

- Https를 사용하는 경우 Certificate가 위치한 경로를 환경변수로 저장합니다.

  ```python
  import os

  # cert 위치 설정
  os.environ["cert_for_kubeflow"] = "/Users/git_repo/Learning_kubeflow/manifests/deployment/cert/leeway.crt"
  ```

- ingress gateway를 port-forward 합니다.

  ```bash
  kubectl port-forward --namespace istio-system svc/istio-ingressgateway 8080:80
  ```

- kubeflow 공식문서에서 제공하는 파이썬 함수를 사용하겠습니다. 공식 페이지 링크는 [Connect the Pipelines SDK to Kubeflow Pipelines](https://www.kubeflow.org/docs/components/pipelines/v1/sdk/connect-api/#full-kubeflow-subfrom-outside-clustersub) 입니다.

  ```python
  import re
  import requests
  from urllib.parse import urlsplit
  import os

  def get_istio_auth_session(url: str, username: str, password: str) -> dict:
      """
      Determine if the specified URL is secured by Dex and try to obtain a session cookie.
      WARNING: only Dex `staticPasswords` and `LDAP` authentication are currently supported
               (we default default to using `staticPasswords` if both are enabled)

      :param url: Kubeflow server URL, including protocol
      :param username: Dex `staticPasswords` or `LDAP` username
      :param password: Dex `staticPasswords` or `LDAP` password
      :return: auth session information
      """
      # define the default return object
      auth_session = {
          "endpoint_url": url,    # KF endpoint URL
          "redirect_url": None,   # KF redirect URL, if applicable
          "dex_login_url": None,  # Dex login URL (for POST of credentials)
          "is_secured": None,     # True if KF endpoint is secured
          "session_cookie": None  # Resulting session cookies in the form "key1=value1; key2=value2"
      }

      # use a persistent session (for cookies)
      with requests.Session() as s:

          ################
          # Determine if Endpoint is Secured
          ################
          resp = s.get(url, allow_redirects=True,verify=os.getenv('cert_for_kubeflow'))
          if resp.status_code != 200:
              raise RuntimeError(
                  f"HTTP status code '{resp.status_code}' for GET against: {url}"
              )

          auth_session["redirect_url"] = resp.url

          # if we were NOT redirected, then the endpoint is UNSECURED
          if len(resp.history) == 0:
              auth_session["is_secured"] = False
              return auth_session
          else:
              auth_session["is_secured"] = True

          ################
          # Get Dex Login URL
          ################
          redirect_url_obj = urlsplit(auth_session["redirect_url"])

          # if we are at `/auth?=xxxx` path, we need to select an auth type
          if re.search(r"/auth$", redirect_url_obj.path):

              #######
              # TIP: choose the default auth type by including ONE of the following
              #######

              # OPTION 1: set "staticPasswords" as default auth type
              redirect_url_obj = redirect_url_obj._replace(
                  path=re.sub(r"/auth$", "/auth/local", redirect_url_obj.path)
              )
              # OPTION 2: set "ldap" as default auth type
              # redirect_url_obj = redirect_url_obj._replace(
              #     path=re.sub(r"/auth$", "/auth/ldap", redirect_url_obj.path)
              # )

          # if we are at `/auth/xxxx/login` path, then no further action is needed (we can use it for login POST)
          if re.search(r"/auth/.*/login$", redirect_url_obj.path):
              auth_session["dex_login_url"] = redirect_url_obj.geturl()

          # else, we need to be redirected to the actual login page
          else:
              # this GET should redirect us to the `/auth/xxxx/login` path
              resp = s.get(redirect_url_obj.geturl(), allow_redirects=True)
              if resp.status_code != 200:
                  raise RuntimeError(
                      f"HTTP status code '{resp.status_code}' for GET against: {redirect_url_obj.geturl()}"
                  )

              # set the login url
              auth_session["dex_login_url"] = resp.url

          ################
          # Attempt Dex Login
          ################
          resp = s.post(
              auth_session["dex_login_url"],
              data={"login": username, "password": password},
              allow_redirects=True
          )
          if len(resp.history) == 0:
              raise RuntimeError(
                  f"Login credentials were probably invalid - "
                  f"No redirect after POST to: {auth_session['dex_login_url']}"
              )

          # store the session cookies in a "key1=value1; key2=value2" string
          auth_session["session_cookie"] = "; ".join([f"{c.name}={c.value}" for c in s.cookies])
      return auth_session

  KUBEFLOW_ENDPOINT = "https://localhost:8080"
  KUBEFLOW_USERNAME = "user@example.com"
  KUBEFLOW_PASSWORD = "12341234"

  auth_session = get_istio_auth_session(
      url=KUBEFLOW_ENDPOINT,
      username=KUBEFLOW_USERNAME,
      password=KUBEFLOW_PASSWORD
  		)

  >>> {'endpoint_url': 'https://localhost:8080',
   'redirect_url': 'https://localhost:8080/dex/auth/local/login?back=&state=wl7s347fz6k2wvzdxq3srplt3',
   'dex_login_url': 'https://localhost:8080/dex/auth/local/login?back=&state=wl7s347fz6k2wvzdxq3srplt3',
   'is_secured': True,
   'session_cookie': 'authservice_session=MTY3NDM3NzA5NXxOd3dBTkVnME0xZzFVMHRIU0ZSSVFVNVVOVU5hUkZFelREUk1Wa1JHTTFNeVRqTlNRek5LV1RSTVJ6VkJVakpHVkVkRVZreEZSMEU9fMOfQ430xor-x4Z2x8et14NygMDLekUvawt7kkMxQe_k'}
  ```

- session cookie를 활용해 kfp client에 접속하겠습니다. `client.get_kfp_healthz()` 결과로 True가 나오면 kfp.client에 정상 접속된 것입니다.

  ```python
  import kfp
  import os

  KUBEFLOW_ENDPOINT = "https://localhost:8080"
  KUBEFLOW_USERNAME = "user@example.com"
  KUBEFLOW_PASSWORD = "12341234"

  auth_session = get_istio_auth_session(
      url=KUBEFLOW_ENDPOINT,
      username=KUBEFLOW_USERNAME,
      password=KUBEFLOW_PASSWORD
  )

  client = kfp.Client(host=f"{KUBEFLOW_ENDPOINT}/pipeline", cookies=auth_session["session_cookie"],ssl_ca_cert=os.getenv('cert_for_kubeflow'))
  print('접속 : ',client.get_kfp_healthz())


  >>> 접속 :  {'multi_user': True}
  ```

  <br/>
  <br/>
  <br/>
  <br/>
