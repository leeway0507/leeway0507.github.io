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



# CSR과 SSR의 변천사
본격적인 리액트 18을 설명하기에 앞서 CSR과 SSR의 변천사에 대해 가볍게 이야기하고 넘어가고자 합니다.

제가 개발 공부를 하면서 가장 힘들었던 점은, 1. 같은 단어라도 상황이나 문맥에 따라 의미가 달라진다는 점, 2.비슷해 보이는 용어 간의 명확한 차이를 구분하기 어려운 점이었습니다.

예를 들어 `렌더링`이라는 단어가 그러했습니다. 웹 개발을 하면서 브라우저 렌더링, 리액트 렌더링, 클라이언트 사이드 렌더링, 서버 사이드 렌더링 등 다양한 렌더링 개념을 접하다 보니, 과연 렌더링이 무엇을 의미하는지 혼란스러웠습니다. 

> 저와 마찬가지로 렌더링에 대한 의미가 혼동스럽다면 제가 작성한 [[React] 다양한 의미로 쓰이는 렌더링 이해하기](https://leeway0507.github.io/blog/Frontend/server)를 참고하시기 바랍니다.

관련있어 보이는 용어들로 인한 어려움으로는 서버 사이드 렌더링(SSR)과 서버 컴포넌트를 구분하는 것이었습니다. 리액트 18 이후에 개발을 시작하다보니, 웹 발전에 대한 이해도가 부족한 상태에서, 단어가 가지는 의미만을 따져 구분하려고 하니 정확한 내용을 파악하는데 어려움이 있었습니다

경험이 쌓이고 개념을 정리해가면서 느낀 점은,  웹을 공부할 때 `문제와 해결`의 관점으로 접근하는 것이 중요하다는 것을 깨달았습니다. 요즘의 세상사가 빠르게 돌아간다 하더라도 웹 발전만큼 빠르진 않은 것 같습니다. `문제와 해결`의 사이클은 매우 빠르게 돌아가고 있으며 지금도 계속해서 새로운 대안들이 등장하고 있습니다. 

이 글의 주제인 리액트 18과 Next.js App Router도 마찬가지로 기존 방식의 문제점을 해결하기 위한 대안으로서 등장했습니다. 따라서 리액트 18 이후에 등장한 새로운 용어들을 이해하려면, 먼저 과거의 문제와 그 해결책, 그리고 이를 설명하기 위해 사용되던 용어들을 살펴보는 것이 필요합니다.

## CSR 이전: 전통적인 SSR의 등장

최초의 웹은 서버에서 HTML을 생성하고, 이를 브라우저가 받아서 표시하는 방식이었습니다. 사용자는 하이퍼링크(`<a>`)로 URL을 직접 입력하지 않고도 간편하게 다른 페이지로 이동할 수 있었습니다.

사용자가 새로운 경로의 페이지를 요청할 때마다 서버는 HTML을 동적으로 생성하여 문자열로 전송하고, 브라우저는 이를 파싱해 브라우저 화면 내에 그렸습니다. 하지만 이 방식에는 한계가 있었는데요.

- 사용자가 페이지를 이동할 때마다 전체 HTML을 새로 로드해야 하므로 속도가 느림

- 서버가 모든 요청을 처리해야 하므로 서버 부하가 높음

- 인터랙티브한 사용자 경험(UX)이 제한적 (매 페이지 이동 시 화면이 새로고침됨)

#### jQuery와 클라이언트 측 동적 렌더링의 시작

이러한 문제를 해결하기 위해 등장한 대표적인 기술이 jQuery였습니다. jQuery는 AJAX(Asynchronous JavaScript and XML)를 활용하여 페이지의 특정 부분만 갱신할 수 있도록 도와주었습니다. 이를 통해 전체 페이지를 다시 로드하지 않고도 일부 콘텐츠를 동적으로 변경하는 것이 가능해졌습니다.

jQuery 기반의 AJAX 요청을 활용하면:

* 버튼 클릭 시 서버에서 필요한 데이터만 JSON 형식으로 받아와 화면에 업데이트할 수 있음
* 사용자가 페이지를 이동하지 않아도 새로운 데이터를 비동기적으로 가져와 표시 가능
* 페이지 전환 없이 인터랙티브한 UI를 제공할 수 있음

이러한 방식은 기존의 SSR보다 빠르고 부드러운 사용자 경험을 제공했지만, 여전히 HTML을 서버에서 주로 렌더링하는 구조였으며, 애플리케이션의 상태 관리가 복잡해지는 문제가 있었습니다.

이후, 보다 나은 사용자 경험과 성능 개선을 위해 클라이언트에서 페이지를 직접 렌더링하는 방식인 CSR(Client-Side Rendering)로 대체되기 시작했습니다.

## CSR 등장: 클라이언트에서 페이지를 렌더링하다
CSR은 페이지 렌더링을 서버가 아닌 클라이언트(브라우저)에서 수행하는 방식입니다.
초기 요청 시에는 최소한의 HTML과 JS 파일만 서버에서 받아오고, 이후에는 JavaScript가 동적으로 페이지를 생성하고 갱신합니다. 대표적인 예가 React, Vue, Angular 등 프론트엔드 라이브러리 및 프레임워크입니다.

CSR 방식은 다음과 같은 장점이 있습니다.
- 빠른 페이지 전환: 서버에서 매번 HTML을 받아오는 것이 아니라, 클라이언트에서 필요한 부분만 업데이트하므로 사용자 경험이 더 부드러움

- 서버 부하 감소: 클라이언트가 페이지를 생성하므로 서버가 부담해야 할 연산량이 줄어듦

- 리치 인터랙션: CSR 방식에서는 상태 관리와 동적인 UI 업데이트가 용이


물론 이러한 단점도 있었으나 CSR이 대중화되면서 이를 해결하기 위한 새로운 대안들이 빠르게 등장했습니다.

- 초기 로딩 속도가 느림: 페이지를 그리기 위해 JS를 다운로드하고 실행해야 하므로, 첫 번째 화면이 뜨기까지 시간이 오래 걸릴 수 있음

- SEO(검색 엔진 최적화) 문제: 검색 엔진은 기본적으로 HTML을 크롤링하는데, CSR 방식에서는 초기 HTML이 비어있고 이후 JS로 채워지므로 검색엔진이 콘텐츠를 제대로 읽지 못하는 경우가 있음

- 디바이스 의존성: 모든 렌더링이 클라이언트에서 수행되므로, 사용자의 디바이스 성능이 낮으면 웹사이트가 느려질 수 있음


## CSR의 한계를 해결하기 위한 시도 
CSR의 단점(특히 초기 로딩 속도 및 SEO 문제)을 해결하기 위해, 다시 서버를 활용하는 방식이 주목받게 되었습니다. 클라이언트의 부족한 부분을 서버가 메꿔주면 되지 않냐는 것이었습니다. 브라우저가 생성하는 페이지를 서버에서 대신 생성하면, 사용자 디바이스 성능에 영향을 덜 받을 뿐만 아니라, 빠르게 컨텐츠를 볼 수 있어 사용자 경험이 증대됩니다. 또한 서버에서 HTML을 생성해 브라우저에게 제공하므로 SEO 문제도 해결 될 수 있었습니다.

하지만 과거의 전통적인 SSR 방식으로 되돌아가는 것이 아니라, CSR과 SSR의 장점을 결합하는 새로운 방식들이 등장했습니다.

대표적인 방법들이 다음과 같습니다.

- SSR (서버 사이드 렌더링): 클라이언트에서 JS를 실행하기 전에 서버에서 HTML을 먼저 생성해 제공하고 클라이언트 리액트에서 이를 동기화 하여 컨텐츠를 관리

- SSG (정적 사이트 생성, Static Site Generation): 빌드 타임에 미리 HTML을 생성하여 저장해둔 후, 요청이 들어오면 해당 HTML을 바로 제공하여 성능 최적화

- ISR (증분 정적 생성, Incremental Static Regeneration): SSG처럼 미리 HTML을 생성하지만, 특정 주기나 조건에 의해 서버에서 다시 렌더링하여 최신 데이터를 반영

이러한 방식들은 Next.js와 같은 프레임워크에서 적극 활용되고 있습니다. CSR과 SSR을 조합하여 클라이언트와 서버가 협력하여 최적의 성능을 내도록 하는 다양한 방법을 제안하고 있습니다.

물론 이러한 해결책에도 문제가 존재합니다. 앞으로 이 글에서는 기존의 방식에는 어떤 문제가 있어는지, 이를 해결하는 방법이 무엇인지에 대해 구체적으로 설명하도록 하겠습니다.


# React 18: 스트림과 서버 컴포넌트

리액트 18은 서버 컴포넌트와 스트림과 같은 리액트를 서버에서 활용하는 방법에 대한 다양한 기능들이 추가 됐습니다.

## 스트림

### 문제: Waterfall로 처리되는 SSR
스트림은 리액트를 활용해 SSR을 구현함에 있어 발생하는 한계를 해결하기 위한 방법입니다. [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)에는 기존 방법이 가지는 한계를 상세히 설명하고 있습니다. 이를 요약하면 다음과 같습니다. 

1. **모든 데이터를 받아와야만 뭐라도 보여줄 수 있다.(*You have to fetch everything before you can show anything*)**
  
    현재의 SSR 방식에서는 HTML을 렌더링할 때 모든 데이터를 미리 서버에서 준비해야 합니다. 컨텐츠 생성에 필요한 모든 데이터가 서버에 도달할 때까지 클라이언트로 보낼 HTML을 렌더할 수 없습니다. 그러므로 매우 비효율적입니다. 일부 데이터가 늦게 도착하더라도 먼저 표시할 수 있는 방식이 필요했습니다.


2. **모든 컴포넌트의 JS 코드를 브라우저에 불러와야만 hydration을 시작할 수 있다.(*you have to load the JavaScript for all components on the client before you can start hydrating any of them*)**
  
    서버로부터 받아온 HTML에 상호작용을 위해선 Hydration이 필요합니다. 이를 수행하기 위해선 서버와 클라이언트가 동일한 트리를 갖고 있음을 확인해야 합니다. 이를 확인하기 위해서는 클라이언트에서 리액트를 렌더하여 UI 데이터(=Virtual Dom)을 확보해야 합니다. 리액트 코드를 서버로부터 로드하는데 오랜 시간이 걸린다면, 사용자 입장에서는 컨텐츠가 보이지만 상호작용할 수 없는 시간이 길어져 사용자 경험을 저하 시킵니다.


3. **모든 hydration이 끝나야만 해야지만 브라우저와 상호작용이 가능하다. (*You have to hydrate everything before you can interact with anything*)**

    Hydration은 전체 페이지 단위로 진행됩니다. 리액트는 Hydration을 시작하면 전체 트리의 처리가 끝날 때까지 멈추지 않습니다. 그로 인해 사용자가 상호작용을 원하는 영역이 hydration이 완료됐다 하더라도, 상호작용을 위해선 페이지 전체에 대한 hydration이 완료되기를 기다려야합니다.

  기존 SSR의 문제점은 다음의 그림과 같이 도식화 할 수 있습니다. 병목이 발생 할수록 지연 시간이 누적되어 최종적으로 결과물을 받는 사용자의 경험이 저해됩니다.

  ![pages-router](/assets/blog/frontend/server/pages-router.png)[*출처 : Next.js Docs*](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#what-is-streaming)



### 스트림의 구조

리액트 18의 서버 스트림은 기존 순차적인 흐름을 갖는 SSR을 비동기적으로 구현하여 개별 단계를 부분적으로 처리가 가능하도록 개선하였습니다. 

다음의 그림에서 처럼 하나의 페이지를 여러 영역으로 나누고 구분된 영역별로 리액트 렌더를 수행해 HTML 생성하고, 그 즉시 브라우저에 스트림해 페이지를 점증적으로 완성할 수 있습니다. 이와 같이 페이지 내 영역별로 독립적인 리액트 렌더가 가능하여, 기존의 waterfall 방식 대비 TTFB와 FCP를 획기적으로 줄일 수 있어 사용자에게는 매우 빠르게 로딩된 듯한 느낌을 줄 수 있습니다.

![app-router](/assets/blog/frontend/server/app-router.png)
[*출처 : Next.js Docs*](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#what-is-streaming)

스트림 구현의 핵심은 `renderToPipeableStream`와 `Suspense`입니다. 

#### renderToPipeableStream(reactNode, options)

  ```jsx
// server.tsx
import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
 
import { App } from './app.tsx'
 
const port = Number.parseInt(process.env.PORT || '3000', 10)
const app = express()
 
app.get('/', (_, res) => {
  //***** renderToPipeableStream ******//
  const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
 onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
})
 
// app.tsx
export default function App() {
 return (
  <html>
   <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/styles.css"></link>
    <title>My app</title>
   </head>
   <body>
    <div>Static Contents...</div>
    <Suspense fallback={<img width="400" src="spinner.gif" alt="Loading..." />}>  
      <DynamicContent />
    </Suspense>  
    <div>Static Contents...</div>
   </body>
  </html>
 );
}
```

이 함수는 서버에서 스트림을 가능하게 하는 함수입니다. 인자로 `reactNode`와 `options`를 받습니다. `reactNode`는 해당 페이지에 대한 루트 컴포넌트 입니다. 컴포넌트에는 루트 `<html>` 태그를 포함한 전체 문서를 반환해야 합니다.

[options](https://ko.react.dev/reference/react-dom/server/renderToPipeableStream#parameters)에는 아래 설명하는 `bootstrapScripts`,`onShellReady`외에도 다양한 설정이 있습니다. 공식문서에 옵션에 대한 상세한 설명이 있으니 링크를 참고 바랍니다.

  * **bootstrapScripts** 

    클라이언트에서 hydrateRoot을 실행시키 파일명을 설정합니다. 해당 옵션을 사용하면 브라우저로 전달할 HTML 하단에 `<script src="/main.js" async=""></script>` 을 배치하여 전송합니다. 
  
  * **onShellReady** 
  
    Shell은 `Suspense`의 외부 영역을 지칭하는 용어입니다. `onShellReady`는 초기 Shell이 렌더 된 후 실행시키는 콜백 함수입니다. 스트림을 도식화한 그림에서 쉘과 Suspense를 구분할 수 있습니다. 세 개의 진행 바 중 가장 상단에 있는 흐름이 Shell 영역입니다. 쉘은 보통 레이아웃이기 때문에 데이터 페칭이 없어 바로 렌더되어 브라우저에 제공됩니다. 

    ![suspense](/assets/blog/frontend/server/suspense.png)[*출처 : Next.js Docs*](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#what-is-streaming)


#### Suspense

Suspense는 스트림에 있어 매우 중요한 리액트 컴포넌트 입니다. Suspense가 감싸고 있는 영역은 독립적인 영역으로 비동기적으로 처리됩니다.

Suspense 내부로 감싸진 각각의 개별 영역들은 해당 영역을 그리는데 필요한 데이터가 수집되면 리액트 렌더를 수행하고, 생성한 HTHML을 브라우저로 보냅니다. 

```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/styles.css"></link>
      <title>My app</title>
    </head>
    <body>
      <div>Static Contents...</div>
      <section id="comments-spinner">  // <- Spinner로 대체됨
          <!-- Spinner -->
          <img width="400" src="spinner.gif" alt="Loading..." />
      </section>
      <div>Static Contents...</div>
    </body>
  </html>
  <script src="/main.js" async=""></script>

```

위 HTML은 사용자가 메인 페이지에 접속하게 되면 가장 먼저 받는 HTML인데요. App 컴포넌트의 Suspense로 감싸진 내부 영역이 section 태그와 fallback에 넣었던 컴포넌트로 렌더 되어있는것을 확인할 수 있습니다. 

Suspense 내부를 그리기 위해선 외부로부터 데이터를 받아오는게 우선이기에 fallback 컴포넌트를 우선 보여줍니다.  해당 영역의 HTML 조각을 서버로부터 받으면 이를 교체하여 페이지를 보여줍니다. (컴포넌트 코드도 이때 보내나?)

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
  
> #### [New in 18: Selective Hydration](https://github.com/reactwg/react-18/discussions/130)

* Suspense 경계(boundary)는 처음에는 Hydration되지 않습니다.

* 클릭이나 키 입력과 같은 명확한 이벤트(Discrete Events)가 발생하면, React는 해당 Suspense 경계의 코드가 준비된 경우 동기적 Hydration을 트리거합니다. 만약 동기적 Hydration이 불가능한 경우, React는 해당 경계의 우선순위를 높여 코드가 준비되면 먼저 Hydration되도록 설정합니다.

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
  
  

## 서버 컴포넌트

> 서버 컴포넌트를 이해하려면 `리액트 렌더`에 대한 이해가 선행되어야 합니다. 이 대한 설명이 필요하다면 [[React] 다양한 의미로 쓰이는 렌더링 이해하기 - 리액트 렌더링](https://leeway0507.github.io/blog/Frontend/server#3-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%A0%8C%EB%8D%94%EB%A7%81)를 참고하세요.

### 문제: 클라이언트에 치중된 구조
서버 컴포넌트는 리액트 렌더 단계에서 서버를 활용하는 방법에 대한 아이디어입니다. 리액트 컴포넌트 중 서버에서 처리 가능한 컴포넌트를 처리하고 브라우저에서 결과물을 제공하고, 브라우저는 중간 결과물을 기반으로 클라이언트에서 동작해야하는 컴포넌트를 실행해 중간 결과물을 합쳐서 최종적으로 리액트 렌더를 수행합니다. 

서버 컴포넌트는 스트리밍과 다른 문제의식을 가지고 개발되었는데요. [RFC: React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md#motivation)에 그 이유가 있으니 핵심을 요약하겠습니다. 

> #### [RFC: React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md#motivation)

#### 동기
서버 컴포넌트(Server Components)는 다양한 React 애플리케이션에서 발생하는 여러 문제를 해결하기 위해 도입되었습니다. 처음에는 문제들을 개별적으로 처리하는 방안을 시도했으나 만족스러운 결과를 얻지 못했습니다. 리액트의 근본적인 문제인 클라이언트 중심적인 구조로 인해 서버를 사용함으로써 얻는 장점을 충분히 얻을 수 없었습니다. 
  
만약 개발자가 서버를 더 쉽게 활용할 수 있다면, 위의 문제들을 모두 해결하면서 작은 앱부터 대규모 앱까지 더 강력한 방식으로 개발할 수 있을 것입니다. 1. 개발자가 별다른 노력 없이도 좋은 성능을 내기 쉽게 만들 수 있고 2. 리액트에서 데이터를 쉽게 가져올 수 있을 것으로 기대합니다. 
  
리액트를 사용해본 경험이 있다면, 아마도 다음의 기능이 리액트에 추가되기를 바랬을 것입니다.

1. **번들 사이즈가 0인 컴포넌트(*Zero-Bundle-Size Components*)**

    라이브러리는 개발자 입장에서는 개발을 편리하게 돕지만, 애플리케이션의 코드 크기를 증가시키고 사용자 성능을 저하시킬 수 있습니다. 이를 직접 구현하는 것도 가능하지만, 이는 시간이 많이 들고 실수하기 쉽습니다. 트리 셰이킹(tree-shaking) 같은 기법이 도움이 되긴 하지만, 여전히 추가적인 코드가 사용자에게 전송됩니다.

    예를 들어, 다음과 같이 마크다운을 렌더링하는 경우 240KB 이상의 JavaScript(압축 시 약 74KB)를 다운로드해야 합니다.

    ```jsx

      import marked from 'marked'; // 35.9KB (11.2KB gzipped)
      import sanitizeHtml from 'sanitize-html'; // 206KB (63.3KB gzipped)

      function NoteWithMarkdown({ text }) {
        const html = sanitizeHtml(marked(text));
        return (/* 렌더링 */);
      }
    ```

    위 코드는 개발자 입장에서는 편리하지만, 실제로는 클라이언트에 240K 이상의 자바스크립트 코드가 전송될 수 있습니다.

    그러나 만약 이 컴포넌트를 서버 컴포넌트로 작성하면, 서버에서 정적으로 렌더링한 후 클라이언트에는 필요한 결과만 전달되므로 코드 크기를 줄일 수 있습니다.

    ```jsx
    // 서버 컴포넌트

    import marked from 'marked'; // 번들 크기 0
    import sanitizeHtml from 'sanitize-html'; // 번들 크기 0

    function NoteWithMarkdown({ text }) {
      // 기존 코드와 동일
    }
    ```

  </br>
  
2. **완전한 백엔드 접근(*Full Access to the Backend*)**

    리액트에서 서버의 데이터를 가지고 오는 것은 쉬운일이 아닙니다. 보통은 UI를 구성하기 위해 별도의 엔드포인트를 만들거나, 기존 엔드포인트를 사용해야 합니다. 하지만 이런 방식은 초기 설정이나 복잡한 앱 개발 시 번거로움을 초래합니다.
    
    서버 컴포넌트를 사용하면 이런 백엔드 리소스에 쉽게 접근할 수 있어, 클라이언트와 서버 간의 경계를 허물 수 있습니다.

    ```jsx
    import db from 'db';

    async function Note({id}) {
      const note = await db.notes.get(id);
      return <NoteWithMarkdown note={note} />;
    }
    ```

    </br>
  
3. **자동 코드 분할 (*Automatic Code Splitting*)**

    코드 분할은 앱을 작은 단위의 번들로 나누어 클라이언트에 전송되는 코드를 줄이는 기법입니다. 전통적으로는 `React.lazy`와 `Dynamic import`를 사용해 구현했습니다. 하지만 개발자가 반드시 코드 분할을 신경 써야하며, 동적 import는 클라이언트에서 컴포넌트가 렌더링될 때까지 로딩을 시작하지 않으므로, 코드 로딩이 지연될 수 있는 문제가 있었습니다. 

    서버 컴포넌트는 이러한 문제를 해결합니다. 클라이언트 컴포넌트에 대한 모든 import가 잠재적인 코드 분할 포인트가 되므로 자동 코드 분할이 이뤄집니다. 어떤 컴포넌트를 사용할지 서버에서 결정하여, 클라이언트가 더 빨리 필요한 코드를 다운로드할 수 있습니다.

    </br>
  
4. **클라이언트-서버 워터폴 방지(*No Client-Server Waterfalls*)**

    클라이언트에서 데이터를 가져오기 위해 종종 useEffect() hook을 사용하여 초기 렌더링 후 데이터를 요청합니다. 이 방식은 부모와 자식 컴포넌트 모두 이런 방식일 경우 순차적으로 데이터를 가져오게 되어 성능 저하를 일으키게 됩니다.

    서버 컴포넌트를 사용하면, 데이터 요청을 서버에서 처리하여 클라이언트-서버 간 왕복 호출을 줄일 수 있습니다. 서버에서 데이터 요청을 처리하니, 클라이언트는 별도의 요청을 기다리지 않아도 되어 전체적인 성능이 향상됩니다.

    </br>

5. **추상화 비용 제거(*Avoiding the Abstraction Tax*)**

    React는 자바스크립트를 사용해 강력한 UI 추상화를 가능하게 하지만, 지나친 추상화는 코드 양과 실행 시 오버헤드를 증가시킬 수 있습니다. 정적 타입 언어나 템플릿 언어에서는 컴파일 타임 최적화가 가능하지만, 자바스크립트에서는 쉽지 않습니다.

    초기에 리액트 팀은 Prepack과 같은 AOT(사전 컴파일) 최적화를 시도했지만, 예상대로 동작하지 않는 경우가 많았습니다. 서버 컴포넌트를 사용하면 서버에서 불필요한 추상화를 제거할 수 있습니다. 예를 들어, 여러 레이어의 래퍼(wrapper)가 있더라도 최종적으로 클라이언트에 전달되는 것은 단순한 하나의 요소일 수 있습니다.


#### 통합된 해결책
동기에서 언급했듯 이러한 문제는 리액트가 클라이언트 중심적 구조를 갖기 때문입니다. PHP,Rails와 같은 전통적인 SSR이 이러한 문제를 확실히 해결하는 방법이지만, 이러한 접근법은 풍부한 상호작용을 경험하게 하는데에는 한계가 있습니다. 

리액트 팀이 결국에 깨달은 것은 순수한 SSR도, 순수한 CSR도 충분하지 않는 것이었습니다. 하지만 두 방법을 사용하면 두 개의 언어와 프레임워크, 생태계를 관리하는 등의 번거로움이 발생 것입니다. 또한 서버와 클라이언트 간 데이터 전송, 로직 중복 등의 문제가 발생할 수 있습니다.

서버 컴포넌트는 하나의 언어, 하나의 프레임워크를 사용함에도 SSR과 CSR의 장점에 접근할 수 있게 합니다. 


서버에서 리액트 렌더를 시작해 클라이언트에 제공하고 클라이언트에서는 이를 마무리하는 방식은 브라우저에서 다운로드 받을 코드의 수가 줄어들고 API 주소, 관련 내용들이 전송되지 않으므로 보안에 유리하고 번들 사이즈를 줄일 수 있어 로딩 속도를 최적화하는데에도 도움 됩니다.

### 서버 컴포넌트의 구조



서버 컴포넌트를 사용하려면 Next.js와 같은 프레임워크를 사용해야한다. 이를 프레임워크에서만 제공하는 이유로는 서버 컴포넌트가 번들러에 의존을 깊게 해야하기 때문과 개발자들에게 서버 컴포넌트를 사용하는 예시로서 제공하기 위함이라고 한다.

#### 초기로딩

* [프레임워크] 요청 URL의 params를 server component Props으로 제공하며 해당 서버 컴포넌트를 렌더링 하도록 React에 요청한다.

* [React 서버] 렌더링은 루트 서버컴포넌트의 하위 트리로 진행된다. 하위 트리가 서버 컴포넌트이면 렌더링을 지속하고, div, span, p와 같은 네이티브 컴포넌트를 만나면 렌더링을 중단하고 JSON serialize로 UI Data를 클라이언트로 스트림한다. 클라이언트 컴포넌트(파일 상단에 'use client'가 기입된 파일 내 존재하는 컴포넌트)를 만나면 렌더링을 마찬가지로 중단하고 Props를 JSON serialize한 데이터와 해당 컴포넌트 코드를 참조(reference)하는 경로를 포함해 스트림한다. 

Suspense를 만나면 렌더링을 중단하고 placeholder를 스트리밍한다. 비어있는 공간은 컴포넌트가 데이터를 로드하고 Suspense가 해제되면, Suspense 내부 컴포넌트를 렌더링하고 빈 공간을 대체한다.(placeholder 위치에 컴포넌트가 채워짐)

* [React 브라우저] 서버가 브라우저로 스트림으로 보내는 데이터는 HTML 조각이 아니라 렌더링된 UI 결과물(흔히 Virtual Dom이라고 표현하는 대상)이다. 서버에서 수행하는 작업은 Render 단계이며,이 단계는 최종적으로 클라이언트 레벨에서 종료된다. 즉 서버에서는 서버에서 렌더링 가능한 컴포넌트만을 렌더링하고 네이티브 컴포넌트, 클라이언트 컴포넌트 같은 미완성의 UI Data를 스트림으로 브라우저에게 제공하고, 브라우저는 이러한 미완성의 UI Data를 JSON deserialize한 뒤 렌더링하여 최종적으로 React Dom Tree를 완성한다.

* 모든 클라이언트 컴포넌트와 서버 컴포넌트가 로드되어 React Dom Tree를 완성하면 브라우저 Dom Tree를 생성하여 최종적으로 UI가 사용자에게 보여진다.

#### 상태 업데이트  
클라이언트로 부터 업데이트 요청이 들어오면 업데이트 된 부분만 렌더링하지 않고 초기로딩과 같이 서버컴포넌트 전체 서브 트리를 랜더링한다.

* [브라우저] 해당 URL에 대한 페이지 업데이트를 요청한다.

* [프레임워크] 요청 URL의 params를 server component Props으로 제공하며 해당 서버 컴포넌트를 렌더링 하도록 React에 요청한다.

* [React 서버] 초기 요청과 같은 방식으로 전체를 렌더링하고 렌더링이 중단된 시점에 JSON serialize로 클라이언트에게 스트림으로 제공한다.

* [React 브라우저] 서버로 부터 받은 UI Data와 기존 스크린과 비교하여 변화된 컴포넌트를 확인한다. UI Data는 HTML이 아니고 객체이므로 새로운 props를 기존 컴포넌트에 업데이트 할 수 있다. 서버로부터 HTML이 아닌 UI Data를 받아옴으로써 이미 존재하는 객체에서 새로 받은 props만 업데이트 하면 되므로 focus, input 데이터등 기존 정보를 잃지 않을 수 있다.


# Next.js

## App Router

[Next.js App Router에서의 SSR과 서버 컴포넌트 그리고 Turbopack]

Next.js 13에서 처음 소개된 App Router는 서버 컴포넌트, 스트림, 선택적 Hydration 등 React 18의 신규 기능을 활용해 SSR을 구현한다. 기존 방식은 Pages Router로 명명되어 명맥은 유지되고 있으나 Legacy로 공식 문서에서 App Router 사용을 권하고 있다.

App router는 서버 컴포넌트와 SSR을 함께 사용하는 프레임워크이므로 HTML 컨텐츠를 서버에서 생성해 클라이언트로 제공하고, React Render의 중간 결과물인 UI 데이터 또한 클라이언트에 제공해야한다. 이때 UI 데이터는 HTML 하단에 NEXT_f.push 스크립트로 첨부되어 함께 전송된다. 브라우저는 서버로부터 받은 HTML을 파싱하여 브라우저 Dom Tree를 생성함과 동시에 서버로 부터 받은 UI 데이터를 바탕으로 React 렌더링을 완료하여 React Dom을 생성한다. React는 완성된 React Dom을 활용해 브라우저 Dom Tree에 Hydrate를 수행해 초기 렌더링을 완료한다.

Next.js 13에서 App router 외 또 하나 중요한 업데이트가 있었는데 바로 Turbopack의 도입이다. [Introducing Turbopack](https://vercel.com/blog/turbopack)에서 turbopack을 `a high-performance bundler for React Server Components and TypeScript codebases.`로 소개하고 있는데, 여기서 흥미로운 점은 Turbopack을 React server component를 위한 번들러라고 소개하는 점이다. 애초에 리액트 공식 문서에서 서버 컴포넌트를 네이티브로 지원하지 않고 프레임워크를 통해 사용하도록 권장하고 있는 이유도 개인이 네이티브로 서버 컴포넌트를 사용하려면 번들러를 다룰 줄 알아야하기 때문이다.

### Pages Router와의 차이

* 폴더 라우팅 도입 및 레이아웃 지원
    App router는 폴더 기반 라우팅을 강제한다. 원하는 pathname에 페이지를 생성하기 위해선 해당 pathname을 이름으로 하는 폴더를 만들어야 한다는 의미다. 강제의 어감이 좋아보지는 않지만 폴더 구조 라우팅을 자연스럽게 준수함으로써 얻는 이점이 더 크다고 한다. Page Router는 파일 기반의 라우팅을 지원하고 있다. product.tsx와 같이 파일명이 곧 pathname이 된다. 파일 구조 방식은 pages 폴더 내 위치한 파일명이 그대로 pathname이 되므로 계층적이지 않다. 서비스가 커지고 하위 페이지가 많아질수록 이와 같은 구조는 복잡성이 증가한다고 한다. App router는 별도의 고민없이 페이지를 계층적으로 만들도록 유도되기 때문에 이러한 고민의 시기가 없거나 늦춰지는 이점이 있다고 한다. 또한 폴더별로 라우팅함에 따라 관련있는 코드는 가깝게 위치시킬 수 있는 장점도 존재하기도 한다.
  
    폴더 구조 라우팅 방식은 layout 구현에도 강점이 있다. Page Router는 프레임워크 차원에서 layout과 관련된 기능이 없다. 사용자가 직접 App.js 파일에 Wrapping을 하여 layout을 구현한다. 이렇게만 보면 별 차이 없어보이지만, 사용자가 직접 wrapping하는 방식의은 페이지 전체가 동일한 layout의 영향 아래 놓여있다는 점이다. 페이지별 layout이 달라져야하는 경우 사용자는 모든 페이지에 Layout을 일일이 수동으로 감싸야하는 불편함이 있다. 반면 App Router는 layout.tsx 내 구현된 컴포넌트를 레이아웃으로 활용한다. 따로 Wrapping 하지 않아도 자동으로 layout.tsx 컴포넌트가 Page.tsx 컴포넌트를 wrapping한다. layout은 root 폴더 외에도 개별 폴더에도 작성할 수 있으며 폴더 내 라우팅 되는 페이지는 동일한 layout을 공유한다. layout을 대체하거나 또는 계층적 구조와 일치하는 Nested layout을 구현할 수 있다.

### RSC Payload

### self.__next_f

# 참고자료

</br>

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























<!-- > Suspense 내부에 있는 컴포넌트가 렌더링 되고나서 Spinner를 대체하는 방법은?
브라우저가 서버로부터 받는 컴포넌트 렌더링 결과는 UI Data이다.(SSR과 함께 사용한다면 HTML도 포함된다.)

* CSR인 경우
  서버로부터 받은 ui data를 가지고 렌더링하여 업데이트 된 React Dom을 완성한다. 기존 브라우저의 React Dom과 비교해 업데이트 된 영역(Suspense boundary 내부)에 대해 브라우저 Dom을 생성한다.

* SSR인 경우
  서버로부터 UI Data와 HTML을 로드한다. 이때 HTML은 컴포넌트 조각이 아닌 전체 페이지를 담고 있는데, 굳이 전체 페이지를 렌더링 하는 이유는 서버 컴포넌트의 렌더링이 항상 Root 서버 컴포넌트부터 시작하기 때문이다. 
  
  다시 렌더링을 해야하니 비효율이 있는 거 아닌가 싶겠지만 캐싱을 해놓기 때문에 모든 작업이 처음부터 시작되는 건 아니다.
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
            <img width="400" src="spinner.gif" alt="Loading..." />
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
``` -->