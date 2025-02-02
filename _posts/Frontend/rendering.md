---
publish: true
title: "[React] React 18과 Next.js App Router 개념 정리"
desc: "리액트"
category: ["frontend"]
date: "2025-01-21"
thumbnail: "/assets/blog/deeplearning/paper/Bert/thumbnail.png"
ogImage:
 url: "/assets/blog/deeplearning/paper/Bert/thumbnail.png"
---

# 개요 

문제에 직면할 때 스스로에게 질문하고 이에 대한 답을 찾는 방식으로 해결 합니다. 아래 내용들은 리팩토링을 하면서 발생했던 여러 의문들을 해소하기 위해서 기록한 내요을 정리한 것입니다.

Q. SSR, CSR, 서버 컴포넌트, 클라이언트 컴포넌트 등 용어 간 유사함에 의한 혼란
A. 렌더링과 컴포넌트 개념 부터 우선 구분해보자. 렌더링은 맥락에 따라 매우 다양한 의미로 사용되는 골치아픈 용어다. 범위를 한정지어 SSR과 CSR에서의 Rendering에 의미를 파악하자.

[SSR과 CSR]
렌더링이라 함은 간단하게 말해 초기 컨텐츠(Contents)가 생성 되는 위치(또는 시점)을 의미한다. 컨텐츠라 함은 사용자가 필요로 하는 정보 등으로 이해하면 된다.

서버 사이드 렌더링(SSR)이라 함은 서버에서 리액트를 실행해 컨텐츠를 포함한 초기 HTML 파일 생성하는 방식을 말한다. 여기서 서버에 생성된 HTML 안에는 브라우저에서 React를 실행 시킬 수 있는 Script Tag가 존재한다. 브라우저가 해당 HTML을 Parsing하는 과정에서 React를 최초 실행시키는 Script를 만나면, 브라우저 단에서의 렌더링이 시작된다. 즉 서버에서 한 번, 브라우저에서 한 번 초기 렌더링이 수행되는 것이다.

SSR 방식으로 리액트를 사용할 때 브라우저 단에서는 CSR 방식과 다른 함수를 사용해 초기 렌더링(initial rendering)을 수행한다. React 18부터 HydrateRoot라는 함수를 이용한다. 브라우저는 서버로 부터 제공받은 HTML을 통해 브라우저 DOM Tree를 생성했기 때문에, 해당 HTML의 컨텐츠가 사용자에게 보여진다. 하지만 보여지기만 할 뿐 클릭, 입력 등과 같은 상호작용은 불가하다. React의 hydrateRoot은 이미 존재하는 브라우저 Dom Tree에 이벤트핸들러를 추가하는 CSR 방식에서 React가 수행하는 작업에 비해 훨씬 간단하게 초기 렌더링을 완료한다.

| 그럼 HydrateRoot는 단순 이벤트 핸들러를 브라우저 Dom에 연결하는 것만 수행하는가?
Hydration을 위한 기본 가정이 HTML로 만든 브라우저 Dom Tree와 React Element Dom Tree가 동일하다는 것이므로, 이벤트 핸들러를 연결하기 위해선 서버에서 받은 HTML로 생성한 브라우저 Dom Tree와 React Element Dom Tree가 동일한지를 점검한다. 만약 React에서 관리하는 Dom Tree와 브라우저 Dom Tree가 일치하지 않으면 hydration Error로 리액트는 클라이언트 랜더링(CSR 방식과 동일)을 재수행한다. 초기 렌더링을 두 번 함에도 CSR 대비 성능면에서 장점이 있는 이유는 브라우저 Dom 생성이 필요하지 않아 이벤트 핸들러만 연결하면 모든 작업이 완료되기 때문이다.

클라이언트 사이드 렌더링은 서버로부터 아무 내용이 없는 HTML을 받아와 Parsing을 시작한다. 브라우저 엔진은 Script 태그의 리액트 코드를 실행시키는데, 실행의 결과로 컨텐츠가 담긴 브라우저 Dom Node를 생성한다. 이렇게 생성된 Dom Node는 Web API의 appendChild를 사용해 리액트가 지정해놓은 Dom Node의 chilren Node에 삽입하여 사용자에게 컨텐츠를 제공한다. 좀 더 자세한 방식은 Render 항목에서 설명한다.

# SSR과 CSR

# React 18

## Suspense

### 배경
### 스트림과 선택적 Hydration

## 서버 컴포넌트

SSR, CSR과 컴포넌트는 상호 종속적인 관계가 아님을 먼저 설명하겠다. 사실 용어만 볼 때 서버 컴포넌트는 SSR에서 사용하는 컴포넌트이고, 클라이언트 컴포넌트는 CSR에서 사용하는 컴포넌트로 오해하기 쉽다. 이 글을 정리하는 이유 중 하나도 돌아서면 서버 컴포넌트와 클라이언트 컴포넌트의 차이를 기억하지 못해 기록해 두는 것도 있다. 아무튼 렌더링과 컴포넌트는 관련이 있을지 언정 종속적인 관계는 아니다.클라이언트 컴포넌트로 SSR을 수행하는 것은 현재는 legacy가 됐어도 아직까지도 보편적으로 사용중인 방법이다. 그리고 서버 컴포넌트와 클라이언트 컴포넌트를 활용해서 CSR이 가능하다는 말이다.

클라이언트 컴포넌트를 활용해 SSR을 구현 하는 건 Next.js 13 이전까지, 13부터는 pages router를 선택하면 되므로 아주 보편적인 반면이다. 반면에 서버 컴포넌트와 CSR을 사용하는 건 익숙하지가 않다. 아무래도 이를 사용하는 프레임워크가 없다보니 실제로 가능한 이야기인지 와닿지 않아 보인다. 서버 컴포넌트 관련 공식 문서에도 서버 컴포넌트를 사용하기 위해선 번들러의 개입이 많이 필요하니, Next.js와 같은 리액트 프레임워크를 사용하라고 한다.

다행이도 React 팀에서 연구 목적으로 서버 컴포넌트를 CSR 환경에서 구현한 Repo가 존재한다. [Server-Component-Demo](https://github.com/reactjs/server-components-demo)이니 이를 실행해보면 CSR에서 서버 컴포넌트가 동작하는 방식을 이해할 수 있다. 23년도 3월 업데이트 된 버전('use client' 도입)이라 지금 사용중인 서버 컴포넌트와 다르지 않다.

본격적으로 서버 컴포넌트에 대해 정리해보자. [RFC: React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)를 참고해서 기억할 내용만 요약했다.

### 배경
  대게 발명이 그렇듯 기존의 방식이 마음에 들지 않았다. React의 클라이언트 중심적인 설계가 서버의 이점을 사용하지 못하는게 단점으로 여겨졌다. 리액트에 서버와 관련된 기능을 도입하면 리액트 개발자들에게 보다 효율적이고 많은 선택지를 줄 것으로 기대하고 있다.
  
  * 번들 사이즈가 0인 컴포넌트(Zero-Bundle-Size Components)
    라이브러리 없이 개발하기는 어렵다. 페이지에 외부 라이브러리를 한 번만 쓰더라도 사용자는 이를 실행시키기 위해 패키지를 다운받아야한다. 사용하는 라이브러리가 늘어날수록 다운 받아야하는 패키지는 늘어나고 앱 성능이 저하될 수밖에 없다. 서버에서 렌더링 결과물(UI Data)만 브라우저로 보낸다면 컴포넌트 코드와 이에 필요한 라이브러리를 보내지 않아도 된다.
  
  * 손쉬운 백엔드 접근(Full Access to the Backend)
    리액트에서 서버의 데이터를 가지고 오는 것은 쉬운일이 아니다. 다양한 라이브러리가 이러한 문제를 해결하고는 있지만 간접적인 해결책일 뿐이다. 보다 직관적이고 코드 규모가 커져도 복잡함을 제어할 수 있도록 개선이 필요하다.
  
  * 코드 분리의 자동화(Automatic Code Splitting)
    lazy loading과 suspense를 활용해 코드를 스플릿하고 성능을 향상시킬 수 있다. 하지만 두 가지 한계가 존재하는데, 첫째로 개발자가 수동으로 구현해야한다. 개발자는 어느 코드가 스플릿 될지를 기억하고 관리해야한다. 이는 개발자의 실수를 유발 할 수 있으므로 이를 기술적으로 보완할 필요가 있다. 둘째로 지연 로딩은 컴포넌트를 사용하기 전까지 다운로드를 지연하여 초기 로딩을 빠르게 하지만, 해당 컴포넌트를 사용하는 시점에서 네트워크 요청과 로드가 발생하므로 좋지 않은 유저 경험을 줄 수 있다.
  
  * 클라이언트-서버 워터폴(No Client-Server Waterfalls)
    워터폴이라 함은 작업이 위에서 아래로 순차적으로 처리되는 방식을 말한다. 부모와 자식 컴포넌트 모두 fetch가 필요한 상황이라면 자식 컴포넌트는 부모의 fetch가 완료된 다음 본인의 fetch를 진행해야 한다. 이는 트리의 깊이가 깊을수록 자식 컴포넌트의 호출 레이턴시는 부모 컴포넌트의 딜레이의 누적이 된다. 서버에서도 waterfall이 발생할 수 있으나 서버에서 데이터 fetch(또는 파일 시스템 접근)을 한다면 preload api를 제공하거나 최적화를 통해 해결할 수 있을 것으로 기대한다.

* 서버 컴포넌트의 동작
  서버 컴포넌트를 사용하려면 Next.js와 같은 프레임워크를 사용해야한다. 이를 프레임워크에서만 제공하는 이유로는 서버 컴포넌트가 번들러에 의존을 깊게 해야하기 때문과 개발자들에게 서버 컴포넌트를 사용하는 예시로서 제공하기 위함이라고 한다.

### 동작
#### 초기로딩

* [프레임워크] 요청 URL의 params를 server component Props으로 제공하며 해당 서버 컴포넌트를 렌더링 하도록 React에 요청한다.

* [React 서버] 렌더링은 루트 서버컴포넌트의 하위 트리로 진행된다. 하위 트리가 서버 컴포넌트이면 렌더링을 지속하고, div, span, p와 같은 네이티브 컴포넌트를 만나면 렌더링을 중단하고 JSON serialize로 UI Data를 클라이언트로 스트림한다. 클라이언트 컴포넌트(파일 상단에 'use client'가 기입된 파일 내 존재하는 컴포넌트)를 만나면 렌더링을 마찬가지로 중단하고 Props를 JSON serialize한 데이터와 해당 컴포넌트 코드를 참조(reference)하는 경로를 포함해 스트림한다. Suspense를 만나면 렌더링을 중단하고 placeholder를 스트리밍한다. 비어있는 공간은 컴포넌트가 데이터를 로드하고 Suspense가 해제되면, Suspense 내부 컴포넌트를 렌더링하고 빈 공간을 대체한다.(placeholder 위치에 컴포넌트가 채워짐)

* [React 브라우저] 서버가 브라우저로 스트림으로 보내는 데이터는 HTML 조각이 아니라 렌더링된 UI 결과물(흔히 Virtual Dom이라고 표현하는 대상)이다. 서버에서 수행하는 작업은 Render 단계이며,이 단계는 최종적으로 클라이언트 레벨에서 종료된다. 즉 서버에서는 서버에서 렌더링 가능한 컴포넌트만을 렌더링하고 네이티브 컴포넌트, 클라이언트 컴포넌트 같은 미완성의 UI Data를 스트림으로 브라우저에게 제공하고, 브라우저는 이러한 미완성의 UI Data를 JSON deserialize한 뒤 렌더링하여 최종적으로 React Dom Tree를 완성한다.

* 모든 클라이언트 컴포넌트와 서버 컴포넌트가 로드되어 React Dom Tree를 완성하면 브라우저 Dom Tree를 생성하여 최종적으로 UI가 사용자에게 보여진다.

#### 상태 업데이트  
클라이언트로 부터 업데이트 요청이 들어오면 업데이트 된 부분만 렌더링하지 않고 초기로딩과 같이 서버컴포넌트 전체 서브 트리를 랜더링한다.

* [브라우저] 해당 URL에 대한 페이지 업데이트를 요청한다.
* [프레임워크] 요청 URL의 params를 server component Props으로 제공하며 해당 서버 컴포넌트를 렌더링 하도록 React에 요청한다.
* [React 서버] 초기 요청과 같은 방식으로 전체를 렌더링하고 렌더링이 중단된 시점에 JSON serialize로 클라이언트에게 스트림으로 제공한다.
* [React 브라우저] 서버로 부터 받은 UI Data와 기존 스크린과 비교하여 변화된 컴포넌트를 확인한다. UI Data는 HTML이 아니고 객체이므로 새로운 props를 기존 컴포넌트에 업데이트 할 수 있다. 서버로부터 HTML이 아닌 UI Data를 받아옴으로써 이미 존재하는 객체에서 새로 받은 props만 업데이트 하면 되므로 focus, input 데이터등 기존 정보를 잃지 않을 수 있다.

그래서 렌더링과 컴포넌트는 종속적이지 않음을 이해했으니, 이제는 서버 컴포넌트와 클라이언트 컴포넌트를 비교해보자. 다들 아는 이야기겠지만 흐름을 위해 한  번 짚고 넘어가면, 서버 컴포넌트는 22년 리액트 18에 처음 도입됐다. 18은 서버와 관련된 많은 변화가 있으니 추가적으로 정리를 해놓았으니 필요하다면 목차로 이동해 먼저 읽어봐도 좋다.

서버 컴포넌트가 도입되고 그 전에 잘 쓰고 있던 컴포넌트와 구분하기 위해 이전 컴포넌트를 클라이언트 컴포넌트로 부르고 있다. 기존 컴포넌트(=클라이언트 컴포넌트)로도 서버에서 실행가능하고 SSR로도 잘 활용하고 있는데, 어떤 이유로 리액트 개발진은 잘 쓰고 있는 컴포넌트 이름을 새롭게 불러가면서 까지 서버 컴포넌트를 만들었을까?

아마도 대게 발명이 그렇듯 지금 방식에 개선해야할 점이 거슬려서 그러지 않았을까 추측된다. 아무래도 코드 실행을 위한 디펜던시를 서버로 부터 다운받고 이를 실행하자니, 차라리 서버에서 전부 처리하고 결과만 받게되면 사용자 디바이스의 성능과 인터넷 연결 속도 등 고려할 점에서 어느정도 자유로워 진다. 물론 SSR이 이런 문제의 일정 부분 해소하는 점이 있겠지만, trade-off가 존재하기 때문에 좋은 선택지가 아닐 수도 있다. 배경이야 어찌됐던 간에 서로 잘하는 걸 분담하자는 취지에서 서버에서는 서버 컴포넌트를 렌더링하고 클라이언트(=브라우저)에서는 클라이언트 컴포넌트를 렌더링하게 되면 분명 시너지가 생길 것이다.(궁금하다면 20년도 서버 컴포넌트 소개/시현 영상을 보자)

서버 컴포넌트와 클라이언트의 동작을 설명하기 전에 앞으로 렌더링이라는 단어가 다시 여러번 등장할텐데, 여기서 렌더링은 앞서 SSR, CSR을 비교할 때의 렌더링의 의미가 아니라 React가 React Element를 활용해 자체 Dom Tree를 만드는 단계로 이해하자.

다음으로 컴포넌트에 대해 정리하자면, 서버 컴포넌트는 22년도 릴리즈 한 React 18부터 도입되었다. 재밌는 점은 SSR 프레임워크인 Next.js가 17년도에 나왔으니 서버 컴포넌트가 등장하기 이전부터 서버 컴포넌트 없이도 SSR이 잘 사용되고 있었다. 서버 컴포넌트 등장 이전에도 기존 컴포넌트(=클라이언트 컴포넌트)를 사용해서 SSR이 가능한데, 굳이 서버 컴포넌트를 추가하고 기존 컴포넌트를 컴포넌트라 부르지 않고 클라이언트 컴포넌트라 새롭게 부르고 있을까?

[React18에서의 SSR]

그만큼 React 18이 SSR에 힘을 주는 버전이지 않을까 싶다. 18 이전에 등장한 Suspense를 SSR을 위한 초석으로 배포했다는 것을 보았을 때 React가 얼마나 SSR에 진심인지를 느낄 수 있었다. 18 이전의 SSR 방식에는 명확히 드러나는 한계가 존재하긴 하나보다.

React 18 이전의 SSR의 한계에 대해 정리해보자. 관련 내용은 [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)에서 기존 방식의 SSR의 한계와 해결 방안을 명확하게 정리하였다. 이를 요약하면 다음과 같다.

[react 18이전의 SSR의 한계]

* 모든 데이터를 받아와야만 뭐라도 보여줄 수 있다.(You have to fetch everything before you can show anything)
  
    모든 데이터가 로드되어야지만 HTML을 생성할 수 있다. 마지막 데이터가 도착하기 전까지 서버는 아무 일도 하지 않는다.

* 모든 컴포넌트의 JS 코드를 불러와야지만 hydrate를 시작할 수 있다.(you have to load the JavaScript for all components on the client before you can start hydrating any of them.)
  
    서버로 부터 받아온 HTML에 상호작용을 위해선 Hydration이 필요하다. 모든 리액트 코드를 서버로부터 로드하는데 오랜 시간이 걸린다면, 사용자 입장에서는 컨텐츠가 보이지만 상호작용할 수 없는 시간이 길어진다.

* 모든 것을 hydrate 해야지만 브라우저와 상호작용 할 수 있다. (You have to hydrate everything before you can interact with anything)
    Hydration은 페이지 단위로 진행된다. 사용자가 상호작용을 원하는 컴포넌트에 hydration이 완료됐다 하더라도 페이지 전체 hydration이 완료되기까지 기다려야한다.

[그림 추가]

그림과 같이 이전의 SSR은 매 단계가 완료되어야 다음 단계로 넘어가는 waterfall 방식이다. 이는 매 단계별로 발생하는 병목에 따라 앱 성능의 영향을 받게된다.

[스트림과 선택적 hydration]

이에 대한 해결책으로서 React 18에서는 스트림과 선택적 hydration이 도입됐다. `renderToPipeableStream` 함수는 컴포넌트 렌더 결과물을 브라우저로 스트림하고, `Suspense`을 활용해 Selective Hydration을 가능케 한다.

> renderToPipableStream(reactNode, options) / <https://ko.react.dev/reference/react-dom/server/renderToPipeableStream#rendertopipeablestream>

* reactNode : HTML로 렌더링하려는 reactNode. HTML을 생성해야 하므로 해당 reactNode에는 html 태그가 포함되어야 한다.

* options / <https://ko.react.dev/reference/react-dom/server/renderToPipeableStream#parameters>
  
  * bootstrapScripts:  클라이언트에서 hydrateRoot을 실행시키기 위한 파일 경로를 설정한다. 부트스트랩이라는 말이 알아서 시작한다는 의미가 있는데, hydrateRoot가 존재하는 경로를 script에 포함하면 알아서 클라이언트 렌더링을 시작한다. 따라서 브라우저에서 hydrateRoot을 실행시켜야 하니 선택이지만 선택이 아닌 꼭 필요한 옵션이다. 예시코드 하단 HTML 스트림 결과를 보면 `<script src="/main.js" async=""></script>` 이 존재한다. renderToPipeableStream이 알아서 Script를 생성해 붙여 넣는다.
  
  * onShellReady: Shell이라 함은 Suspense 경계 외부 영역을 지칭한다.  Suspense 영역 밖인 셸이 렌더링 된 후 옵션에서 정의한 콜백 함수를 실행하게 된다. 즉 위의 예시코드로 설명하면 Shell 영역이 렌더링 된 다음 본격적으로 Stream이 시작된다. Shell 영역 렌더링 이후 스트림이 시작된 만큼, Suspense를 적절한 위치에 사용해 Shell 영역을 확정 짓는다면 초기 로딩 속도를 증가시킬 수 있다.
    
        ![https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming](https://prod-files-secure.s3.us-west-2.amazonaws.com/14b1d6f8-48b7-4c05-aaae-0e0a3bf591d5/f007cc6d-f8a2-45bf-a066-babea646f51c/image.png)
        
        <https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming>
        
        세 개의 진행 바 중 쉘 영역은 데이터 페칭이 없다. 만약 Suspense 1의 Suspense를 제거해 쉘 영역에 Suspense1 영역을 포함하면, 쉘 영역에서 데이터 로드를 기다려야 하는 만큼 스트림 시점이 늦춰지므로 최초 페이지 로드 시기가 늦어질 뿐만 아니라 Suspense2 영역의 처리 시간에도 영향을 주기 때문에 전체적인 앱 성능에 좋지 않은 영향을 발생시킨다.

* HTML을 생성하기 위해 모든 데이터를 가지고 올 필요가 없다.
  
        ```javascript
      
        // 초기 HTML 
            <main>
        <nav>
            <!--NavBar -->
            <a href="/">Home</a>
        </nav>
        <aside>
            <!-- Sidebar -->
            <a href="/profile">Profile</a>
        </aside>
        <article>
            <!-- Post -->
            <p>Hello world</p>
        </article>
        <section id="comments-spinner">  // <- Spinner로 대체됨
            <!-- Spinner -->
            <img width=400 src="spinner.gif" alt="Loading..." />
        </section>
        </main>
      
        ```

코드를 보면 Suspense를 사용한 영역이 fallback 컴포넌트로 대체되어 초기 HTML이 생성됨을 확인할 수 있다. Suspense 영역 내부의 데이터가 준비되면 React는 Suspense 영역 내부의 컴포넌트를 렌더링하여 결과를 브라우저에 스트림으로 보내고 `id="comments-spinner"` 엘리먼트를 서버로 부터 전송 받은 데이터를 활용해 대체한다.

| Suspense 내부에 있는 컴포넌트가 렌더링 되고나서 Spinner를 대체하는 방법은?
브라우저가 서버로부터 받는 컴포넌트 렌더링 결과는 UI Data이다.(SSR과 함께 사용한다면 HTML도 포함된다.)

* CSR인 경우
  서버로부터 받은 ui data를 가지고 렌더링하여 업데이트 된 React Dom을 완성한다. 기존 브라우저의 React Dom과 비교해 업데이트 된 영역(Suspense boundary 내부)에 대해 브라우저 Dom을 생성한다.

* SSR인 경우
  서버로부터 UI Data와 HTML을 로드한다. 이때 HTML은 컴포넌트 조각이 아닌 전체 페이지를 담고 있는데, 굳이 전체 페이지를 렌더링 하는 이유는 서버 컴포넌트의 렌더링이 항상 Root 서버 컴포넌트부터 시작하기 때문이다. 다시 렌더링을 해야하니 비효율이 있는 거 아닌가 싶겠지만 캐싱을 해놓기 때문에 모든 작업이 처음부터 시작되는 건 아니다.
  아래 HTML 엘리먼트가 Suspense 영역 로드 이후 받은 HTML인데, 최초 스피너만 포함된 HTML과 다르게 새로 받은 HTML 하단에는 업데이트 될 영역에 대한 엘리먼트와 올바른 위치로 이를 삽입하는 script가 첨부되어 있다. 브라우저는 새로 첨부된 영역을 실행해 브라우저 Dom을 업데이트한다.

그 다음 업데이트 영역에 대해 hydration을 수행하는데, 그 전에 서버로 부터 받은 UI Data를 가지고 React Dom을 업데이트한다. 업데이트된 UI Data가 기존의 React Dom을 대체하는 건 아니고 UI Data를 활용해 기존 React Dom을 업데이트 하므로 focus, input data와 같은 현재 페이지 정보를 초기화하지 않을 수 있다. React Dom을 업데이트하면 업데이트 된 브라우저 Dom과 React Dom이 일치하므로 Hydration을 실행하여 최종적으로 렌더링을 완료한다.

```html
        // 초기 HTML 
            <main>
        <nav>
            <!--NavBar -->
            <a href="/">Home</a>
        </nav>
        <aside>
            <!-- Sidebar -->
            <a href="/profile">Profile</a>
        </aside>
        <article>
            <!-- Post -->
            <p>Hello world</p>
        </article>
        <section id="comments-spinner">  // <- Spinner로 대체됨
            <!-- Spinner -->
            <img width=400 src="spinner.gif" alt="Loading..." />
        </section>
        </main>

        ---

        // 데이터 준비가 끝나고 해당 영역의 HTML과 위치를 바꾸는 Script 전송
        <div hidden id="comments">
        <!-- Comments -->
        <p>First comment</p>
        <p>Second comment</p>
        </div>
        <script>
        // This implementation is slightly simplified
        document.getElementById('sections-spinner').replaceChildren(
            document.getElementById('comments')
        );
        </script>
```

* Hydrate를 위해 모든 컴포넌트 JS 코드를 로드할 필요 없다.
  React 18이전 버전에서는 Hydrate를 수행하기 위해선 서버로부터 모든 컴포넌트 코드를 불러와야 했다. 크기가 큰 코드로 인해 Hydrate가 딜레이 되는 것을 방지하기 위해 Lazy loading을 사용해 코드를 스플릿하고 초기 로딩에 이를 배제하는 전략을 취했다. 해당 컴포넌트 영역에 대한 SSR을 포기하는 하는 대신 Hydrate를 회피하는 것을 택한 것이다.

아래의 코드는 기존 버전에서는 SSR에서 작동죄지 않았는데, 18 버전부터는 가능하다. 이제는 Suspense를 활용해 미리 Hydration 할 수 있으며 Lazy Loading의 영역은 서버에서 처리되어 브라우저로 전송된다.

```javascript
import { lazy } from 'react';

const Comments = lazy(() => import('./Comments.js'));

// ...

<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

* 모든 hydrate가 완료되지 않아도 상호 작용할 수 있다.
  페이지가 로드되는 동안 일부 화면은 hydration이 되었고 일부는 hydration을 기다리는 중일 수 있다. 사용자가 hydration을 기다리는 컴포넌트와 상호작용 하고자 한다면 hydration의 우선순위가 올라 먼저 수행하게 된다. 따라서 모든 페이지가 hydration 되지 않더라도 사용자는 즉각 상호작용할 수 있다.
  
  Selective Hydration의 원리는 다음과 같다.
  
  * 초기 상태:
    
        Suspense 경계(boundary)는 처음에는 Hydration되지 않습니다.
  
  * 사용자 상호작용 시:
    
    클릭이나 키 입력과 같은 명확한 이벤트(Discrete Events)가 발생하면, React는 해당 Suspense 경계의 코드가 준비된 경우 동기적 Hydration을 트리거합니다.
    만약 동기적 Hydration이 불가능한 경우, React는 해당 경계의 우선순위를 높여 코드가 준비되면 먼저 Hydration되도록 설정합니다.

* 포커스/호버 이벤트:
  
    포커스되거나 호버된 Suspense 경계는 Hydration 우선순위가 높아지지만, 즉시 Hydration되지는 않습니다.
    포커스/호버와 같은 지속 이벤트(Persistent Events, 예: focusin, mouseenter)는 Hydration 시 다시 브로드캐스트됩니다.
    같은 종류의 이벤트는 마지막 이벤트 하나만 브로드캐스트됩니다. (현재 상태만 반영)

* 이벤트 브로드캐스트:
  
    이벤트는 native event.dispatch를 사용해 브로드캐스트됩니다.
    이로 인해 네이티브 이벤트 핸들러, stopPropagation, 캡처 단계 등이 정상적으로 작동합니다.

* Hydration 중 이벤트 처리:
  
    HTML이 Hydration되지 않았거나 지속 이벤트인 경우, React는 stopPropagation()을 호출해 이벤트 전파를 막습니다.
    예를 들어, 사용자가 preventDefault를 호출했어야 하는 이벤트(예: 폼 제출)가 전파되는 것을 방지합니다.

* 우선순위 제어:
  
    unstable_scheduleHydration 메서드를 사용해 특정 Suspense 경계의 Hydration 우선순위를 높일 수 있습니다.

* 유휴 상태에서의 Hydration:
  
    남아 있는 Suspense 경계는 유휴 상태의 사이클 동안 비동기적으로 Hydration됩니다.
    Hydration을 유휴 상태로 나누면 페이지가 더 반응성 있게 유지됩니다.
  
  [New in 18: Selective Hydration](https://github.com/reactwg/react-18/discussions/130)

[기존 hydration](https://helloinyong.tistory.com/315)

Next.js에서 renderToPipebaleStream과 Suspense를 통해 Selective Hydration을 구현하고 싶다면 App router를 사용해야 한다. Pages Router는 여전히 기존 방식인 renderToString를 사용해 SSR을 가능케 한다.

[Next.js App Router에서의 SSR과 서버 컴포넌트 그리고 Turbopack]

Next.js 13에서 처음 소개된 App Router는 서버 컴포넌트, 스트림, 선택적 Hydration 등 React 18의 신규 기능을 활용해 SSR을 구현한다. 기존 방식은 Pages Router로 명명되어 명맥은 유지되고 있으나 Legacy로 공식 문서에서 App Router 사용을 권하고 있다.

App router는 서버 컴포넌트와 SSR을 함께 사용하는 프레임워크이므로 HTML 컨텐츠를 서버에서 생성해 클라이언트로 제공하고, React Render의 중간 결과물인 UI 데이터 또한 클라이언트에 제공해야한다. 이때 UI 데이터는 HTML 하단에 NEXT_f.push 스크립트로 첨부되어 함께 전송된다. 브라우저는 서버로부터 받은 HTML을 파싱하여 브라우저 Dom Tree를 생성함과 동시에 서버로 부터 받은 UI 데이터를 바탕으로 React 렌더링을 완료하여 React Dom을 생성한다. React는 완성된 React Dom을 활용해 브라우저 Dom Tree에 Hydrate를 수행해 초기 렌더링을 완료한다.

Next.js 13에서 App router 외 또 하나 중요한 업데이트가 있었는데 바로 Turbopack의 도입이다. [Introducing Turbopack](https://vercel.com/blog/turbopack)에서 turbopack을 `a high-performance bundler for React Server Components and TypeScript codebases.`로 소개하고 있는데, 여기서 흥미로운 점은 Turbopack을 React server component를 위한 번들러라고 소개하는 점이다. 애초에 리액트 공식 문서에서 서버 컴포넌트를 네이티브로 지원하지 않고 프레임워크를 통해 사용하도록 권장하고 있는 이유도 개인이 네이티브로 서버 컴포넌트를 사용하려면 번들러를 다룰 줄 알아야하기 때문이다.

# Next.js

## App Router

### Pages Router와의 차이

### RSCPayload

* 폴더 라우팅 도입 및 레이아웃 지원
    App router는 폴더 기반 라우팅을 강제한다. 원하는 pathname에 페이지를 생성하기 위해선 해당 pathname을 이름으로 하는 폴더를 만들어야 한다는 의미다. 강제의 어감이 좋아보지는 않지만 폴더 구조 라우팅을 자연스럽게 준수함으로써 얻는 이점이 더 크다고 한다. Page Router는 파일 기반의 라우팅을 지원하고 있다. product.tsx와 같이 파일명이 곧 pathname이 된다. 파일 구조 방식은 pages 폴더 내 위치한 파일명이 그대로 pathname이 되므로 계층적이지 않다. 서비스가 커지고 하위 페이지가 많아질수록 이와 같은 구조는 복잡성이 증가한다고 한다. App router는 별도의 고민없이 페이지를 계층적으로 만들도록 유도되기 때문에 이러한 고민의 시기가 없거나 늦춰지는 이점이 있다고 한다. 또한 폴더별로 라우팅함에 따라 관련있는 코드는 가깝게 위치시킬 수 있는 장점도 존재하기도 한다.
  
    폴더 구조 라우팅 방식은 layout 구현에도 강점이 있다. Page Router는 프레임워크 차원에서 layout과 관련된 기능이 없다. 사용자가 직접 App.js 파일에 Wrapping을 하여 layout을 구현한다. 이렇게만 보면 별 차이 없어보이지만, 사용자가 직접 wrapping하는 방식의은 페이지 전체가 동일한 layout의 영향 아래 놓여있다는 점이다. 페이지별 layout이 달라져야하는 경우 사용자는 모든 페이지에 Layout을 일일이 수동으로 감싸야하는 불편함이 있다. 반면 App Router는 layout.tsx 내 구현된 컴포넌트를 레이아웃으로 활용한다. 따로 Wrapping 하지 않아도 자동으로 layout.tsx 컴포넌트가 Page.tsx 컴포넌트를 wrapping한다. layout은 root 폴더 외에도 개별 폴더에도 작성할 수 있으며 폴더 내 라우팅 되는 페이지는 동일한 layout을 공유한다. layout을 대체하거나 또는 계층적 구조와 일치하는 Nested layout을 구현할 수 있다.

Q. 서버 컴포넌트가 담당하는 범위와 렌더링 원리는?
A. 지금까지 모호한 개념들을 상호 비교하여 알아갔다면, 서버 컴포넌트에 대해 딥하게 이해해 보고싶다. 새로운 개념이 나올게 뻔하므로 용어별 의미를 명확히 짚어가며 개념을 잡아봐야겠다.

* RSC Payload
  서버 컴포넌트 설명에 반복해서 나오는 용어. 대략적인 이해는 하고 있으나 무슨 용도인지, 어떤 구조인지, 생성 절차가 어떻게 되는지, 클라이언트 컴포넌트와 어떻게 함께 쓰는건지 등 모호한 점이 많다.

* Component Wrapping

* Async Component


#### 참고자료

##### 서스펜스
- [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)

</br>

##### 서버 컴포넌트

- [RFC: React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)

- [[Github] Server-Component-Demo](https://github.com/reactjs/server-components-demo)

- [Demystifying React Server Components with NextJS 13 App Router](https://demystifying-rsc.vercel.app/)

- [How React server components work: an in-depth guide](https://www.plasmic.app/blog/how-react-server-components-work)

- [RSC Payload & Serialized Props](https://hrtyy.dev/web/rsc_payload/)


- [React 서버 컴포넌트 작동원리를 아주 쉽게 알아보자](https://blog.kmong.com/react-server-component%EB%A1%9C-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C-%ED%98%81%EC%8B%A0%ED%95%98%EA%B8%B0-part-2-5cf0bf4416b0)

- [React Server Component & Next.js를 통해 진행하는 웹 최적화 실험](https://bolang2.notion.site/React-Server-Component-Next-js-a35232d92c5a4c03915b3df730066c61)

- [Making Sense of React Server Components](https://www.joshwcomeau.com/react/server-components/)

- [Understanding React Server Components](https://tonyalicea.dev/blog/understanding-react-server-components/)

</br>

##### Pages Router
- [Next.js 제대로 알고 쓰자](https://medium.com/@msj9121/next-js-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B3%A0-%EC%93%B0%EC%9E%90-8727f76614c9)




















