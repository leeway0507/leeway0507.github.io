---
publish: true
title: "[React] 다양한 의미로 쓰이는 렌더링 이해하기"
desc: "리액트 "
category: ["frontend"]
date: "2025-01-12"
thumbnail: "/assets/blog/deeplearning/paper/Bert/thumbnail.png"
ogImage:
 url: "/assets/blog/deeplearning/paper/Bert/thumbnail.png"
---
# 개요

렌더링이란 용어는 웹 관련 개념을 설명하는데 자주 등장하는 용어입니다. 아무래도 렌더링이라는 의미가 무언가를 그리거나, 현재 상태에서 다른 상태로 변화시키는 것을 나타내기 때문에 웹 분야의 다양한 개념에서 사용되는 것은 당연해 보입니다.

예를 들어봅시다.

> 서버 사이드 렌더링은 서버에서 리액트를 렌더링하여 초기 HTML을 생성한 다음 클라이언트에 제공합니다. 브라우저는 서버로 부터 받은 HTML을 활용해 브라우저 렌더링을 수행합니다.

위 문장에서 렌더링이라는 용어가 세 번 나왔는데요. 개별 렌더링이 함축하고 있는 개념은 어느 하나와도 동일하지 않습니다. 전부 렌더링이라는 단어롤 사용하지만 사실 렌더링이 의미하는 바는 개별적으로 다릅니다. 서로 다른 개념을 렌더링이라는 단어 하나로 추상화해버리니 이해의 어려움이 발생하기 마련입니다.

웹 개발에 오랜 경험이 있는 개발자라면, 전반적인 웹 발전의 흐름을 이해하고 있으므로 위와 같은 함축적인 문장을 읽더라도 의미하는 바를 파악할 수 있습니다. 하지만 웹 발전의 흐름을 알지 못하는 개발자에게는 문장이 의미하는 바를 대략적으로 이해할 수 있으나, 개별적인 개념들이 렌더링이라는 단어 하나로 통합되다보니 의미를 이해하는데 어려움이 발생합니다. 

그러니 렌더링이 맥락에 따라 전혀 다른 개념을 함축하고 있음을 인지하고 각각의 개념을 이해하는 것이 중요합니다. 이 글을 쓰는 목적 또한 위 문장에서 사용했던 세 가지 렌더링에 대해 정리하는 데 있습니다. 

렌더링 별 의미 차이만 이해하더라도 리액트를 이해하는데 한결 쉬워질거라 장담합니다. 지금부터 문맥별로 렌더링이 함축하는 의미에 대해서 하나씩 이해해봅시다.

# CSR과 SSR
요즘 웹 기술의 추세는 SSR 입니다. 17년도에 next.js가 출시되고, 22년도에 업데이트 된 리액트 18에서는 스트리밍, 선택적 hydration, 서버 컴포넌트 등 서버 기능이 대폭 강화 되었습니다.

개발자에게는 상황에 맞게 SSR과 CSR을 선택해 서비스를 만들 수 있는 선택지가 늘어나니 좋은 상황입니다. 다만 올바른 선택을 할 수 있으려면 SSR과 CSR에 대한 이해가 필요합니다. 

사실 CSR과 SSR 이해에 있어 이 둘의 차이를 구분하는 것 보다는 리액트 렌더링과 브라우저 렌더링의 측면에서 CSR과 SSR에서 어떤 차이가 있는지 이해하는 것이 더욱 중요합니다. 리액트 렌더링만 보더라도 SSR과 CSR 구현을 위한 내부 동작과 처리 방식이 다르기 때문이에요. 

이에 대해서는 차차 설명하고 우선 가장 큰 틀인 CSR, SSR에 대해 이해해봅시다.

## 클라이언트 사이드 렌더링(CSR)

CSR과 SSR에서의 렌더링(rendering)은 **초기 컨텐츠가 생성 되는 위치 또는 시점**을 의미합니다. SSR은 서버가 사용자가 요청한 컨텐츠를 직접 생성하여 클라이언트에 제공하는 반면, CSR은 클라이언트(=브라우저)가 컨텐츠를 직접 생성합니다. 

CSR은 클라이언트에서 컨텐츠를 직접 생성하므로 별도의 컨텐츠 생성을 위한 서버가 필요하지 않습니다. 그래서 배포도 간단하고, HTML 파일과 JS 파일만 서버에서 제공하면 되기 때문에 무료로 호스팅을 제공하는 곳도 많아서 초기 프로젝트에 장점이 있습니다. (물론 동적 데이터를 다루기 위해서는 데이터를 처리하는 서버가 필요합니다.) 

대신 컨텐츠 생성에 JS가 깊게 관여하므로 컨텐츠를 읽기 위해선 JS 구동을 지원하는 브라우저가 필요합니다. 웹 크롤링을 하다보면 종종 비어있는 HTML 파일만 제공하는 페이지가 있는데, 이는 해당 페이지가 CSR로 구현되어 있기 때문입니다. 이를 스크랩하기 위해선 브라우저를 직접 실행하는 도구를 사용해야해요.

다음은 CSR의 전반적인 렌더링 흐름을 나타냅니다.

1. 브라우저가 페이지에 접속합니다.(ex www.example.com)

2. 서버는 클라이언트에 이미 존재하는 HTML 파일을 전송합니다. HTML 내부에는 리액트  코드를 실행하는 기본 태그만 존재합니다. 아무런 컨텐츠가 없으므로 사용자는 비어있는 흰 화면을 보게 됩니다.

3. 브라우저는 HTML을 파싱하며, 이 과정에서 main.js가 포함된 스크립트를 만나면 이를 실행하기 위해 코드를 다운로드 받습니다. main.js가 포함된 스크립트가 다운로드되면 Dom 바로 실행되지 않고 Dom Tree 생성이 완료되기를 기다립니다. 이는 main.js의 스크립트 타입이 module이라 defer 방식으로 다뤄지기 때문입니다. 

4. HTML 파싱이 완료되면 브라우저는 main.js를 실행해 리액트 초기 렌더(initial render)를 수행합니다. (리액트 초기 렌더에 대해서는 다음 장에서 설명합니다.)

5. 리액트 렌더링을 완료하면 결과로 UI 데이터(또는 VDOM이라고 부릅니다.)를 생성합니다. 리액트는 렌더링 결과를 활용해 실제 컨텐츠에 대한 Dom Element를 생성하고 브라우저 Dom에 삽입합니다. 

6. 브라우저는 브라우저 Dom이 변경되었으므로 브라우저 렌더링을 재시작하여 비어있는 사용자 화면에 컨텐츠를 그려냅니다. (브라우저 렌더링 또한 다음 장에서 설명하겠습니다.)

 7. 사용자는 컨텐츠를 볼 수 있고 페이지와 상호작용 할 수 있습니다.

## 서버 사이드 렌더링(SSR)

SSR은 클라이언트에서 요청한 컨텐츠를 서버에서 생성해 클라이언트로 전송합니다. 서버에서 이미 완성된 페이지를 제공하니, 클라이언트 입장에서는 컨텐츠를 매우 빠르게 볼 수 있습니다. 그럼 서버 사이드 렌더링(SSR)의 렌더링 흐름을 봅시다.

1. 클라이언트가 페이지에 접속합니다. (ex www.example.com)

2. 서버는 컨텐츠에 필요한 데이터를 수집하고 리액트를 렌더링하여 HTML 파일 생성합니다. (리액트 렌더링은 일단 리액트를 실행한다는 의미로 이해하고 넘어갑시다.)

3. 브라우저는 서버로부터 HTML 패킷을 받기 시작하면 이를 파싱하여 컨텐츠를 화면에 그리기 시작합니다. 

4. 서버에서 제공한 HTML에는 CSR과 마찬가지로 클라이언트에서 리액트를 실행 시키는 스크립트가 존재합니다. 브라우저가 HTML을 파싱하는 중에 해당 Script를 만나면 다운로드를 요청하고 브라우저 렌더링을 마저 진행합니다.

5. 초기 브라우저 렌더링이 완료되어 HTML의 컨텐츠가 사용자에게 보여지고 있습니다. 하지만 리액트에 기반한 기능들은 상호작용이 불가한 상황입니다. 아직 브라우저에서의 리액트 렌더링이 수행되지 않았기 때문입니다. 브라우저에서 실행되는 리액트 렌더링을 Hydration이라고 하는데, CSR에서 수행하는 리액트 렌더링과는 다릅니다. CSR에서의 리액트 렌더링은 컨텐츠를 생성하는 과정이라면, SSR에서의 클라이언트 리액트 렌더링은 브라우저 Dom에 이벤트 핸들러를 추가하는 간단한 절차입니다. 방식에 대한 상세한 차이는 리액트 렌더링을 설명하는 장에서 다루도록 하겠습니다. 여기서 기억할 점은 SSR에서의 리액트의 렌더링은 서버에서 한 번, 브라우저에서 한 번 총 두 번 수행된다는 것입니다.
  
  <!-- > Hydration이 필요한 이유
  > 
  > SSR의 장점 중 하나로 빠른 로딩이 있습니다. 이미 서버로부터 컨텐츠가 포함된 HTML을 받아오니 리액트에서 따로 브라우저 Dom을 생성하는 절차를 수행할 필요가 없기 때문입니다. 하지만 해당 페이지가 리액트에 의해 관리되기 떄문에 리액트로 구현한 기능은 아직 사용 불가합니다. 아직 브라우저 Dom과 리액트가 상호 연결 되어있지 않으므로 화면에 컨텐츠가 보이더라도 리액트와 구현된 기능은 사용할 수 없습니다. 
  > 
  >
  > 브라우저 Dom과 리액트를 연결하는 작업을 Hydration이라 합니다. 이 작업은 브라우저 Dom에 이벤트 리스너를 추가하는 절차인데요. 정확한 위치에 이벤트 헨들러가 등록되어야 하므로 리액트는 브라우저 Dom의 구조와 리액트에서 관리하고 있는 Dom의 구조가 일치하는지를 체크합니다. 예상대로 이 둘의 차이가 없다면 이벤트 헨들러를 브라우저 Dom에 추가하고 작업을 끝냅니다. 이 작업은 브라우저 Dom을 생성하고 그에 따른 브라우저 렌더링을 유발하는 CSR 보다 훨씬 간단한 작업입니다. 
  > 
  >
  > 만약 브라우저 Dom과 React Dom이 서로 일치하지 않는다면 이는 Hydration 에러로 리액트는 HTML로 부터 생성한 Dom을 제거하고 클라이언트 사이드 렌더링과 동일하게 초기 렌더링하여 생성한 브라우저 Dom으로 대체합니다. -->

5. Hydration이 마무리 되면 사용자는 페이지와 상호작용 할 수 있습니다.
  
# 리액트 렌더링

리액트를 설명하는 글에는 `리액트 렌더링을 수행한다` 또는 `리액트를 렌더한다` 라는 말이 자주 등장합니다. 이 말은 리액트 내부에서 일어나는 일련의 처리 활동을 의미하는데요. 이번 장에서는 리액트 렌더링이 의미하는 바가 무엇인지 CSR과 SSR을 구분하여 설명합니다.

## CSR의 리액트 렌더링

리액트가 페이지를 생성하고 제거하는 절차를 리액트 사이클 또는 리액트 수명주기라고 합니다. 새로 개정된 리액트 공식문서는 리액트의 사이클을 Trigger - Render - Commit의 세 단계로 구분하여 설명하고 있습니다.본격적인 설명에 앞서 개별 절차를 개괄적으로 설명하여 큰 구상을 잡은 뒤 개별 단계에 대한 상세한 설명을 이어나가도록 하겠습니다. 

Trigger 단계는 페이지의 변화를 리액트에게 알리는 단계입니다. 변화가 감지되면 리액트는 변화사항을 화면에 반영하기 위해 Render 단계로 넘어갑니다.  Render 단계는 리액트의 핵심으로서 `리액트 렌더링을 수행한다.`고 할 때를 의미하기도 합니다. 

Render 단계를 수행하면 JS 객체인 UI 데이터를 생성합니다. UI 데이터는 Virtual Dom이라고도 불리며 UI를 그리기 위한 데이터로 구성된 JS 객체입니다. 끝으로 Commit 단계는 Render 단계에서의 결과물인 UI 데이터를 활용해 브라우저에게 화면을 그려달라고 요청하는 작업입니다. 

### Trigger
트리거는 특정 행위를 발생시키는 대상을 의미하는 단어입니다. 총기의 방아쇠를 영어로 트리거라고 하며, 방아쇠를 당기면 총이 발사되는 것처럼, 리액트에서의 트리거는 브라우저의 변화를 감지하고 Render를 실행하도록 요청합니다. 리액트에서 Render가 트리거되는 상황은 다음과 같습니다.

1. 페이지가 최초로 로드될 때
2. 컴포넌트의 props 변화 또는 리액트에서 관리하는 상태(State) 변화

#### 페이지 최초 로딩

CSR이든 SSR이든 서버로부터 제공받은 HTML에는 리액트를 실행시키는 `<script>` 태그가 포함되어 있습니다. 브라우저는 HTML을 파싱하는 도중 `<script>` 태그를 만나면 해당 코드를 다운로드하고, 파싱을 지속합니다.

 참고로 다운로드 된 리액트 코드는 다운로드 직후 바로 실행되지 않고 브라우저 렌더링이 모두 완료된 이후 실행됩니다. 브라우저 렌더링이 무엇인지, 브라우저 렌더링 이후 리액트 코드가 실행되는 이유에 대해서는 다음 장에서 설명합니다.

CSR에서는 [createRoot(domNode, options)](https://ko.react.dev/reference/react-dom/client/createRoot)을 사용해 초기 렌더(initial Render)를 수행합니다. `domNode`에는 실제 브라우저 DOM 노드를 전달해야 하며, 이를 통해 리액트가 해당 노드에서 렌더링을 시작합니다. 브라우저의 JS 엔진이 `root.render(<App />);`를 실행하면 리액트 Render를 시작합니다.

```jsx
// main.js
import { createRoot } from 'react-dom/client';
import App from 'app'

const domNode = document.getElementById('root'); // 실제 Dom 노드
const root = createRoot(domNode);
root.render(<App />); // App은 리액트 노드
```
- root.render가 실행되면 domNode 내부에 존재했던 HTML이 전부 제거됩니다.
- 이후 React Node를 기반으로 새로운 DOM을 생성하여 브라우저에 렌더링합니다.

#### 상태(State) 업데이트

페이지가 최초 로딩된 후, 앞서 설명한 방식에 따라 Render와 Commit 단계가 수행됩니다. 이 과정이 끝나면 사용자는 화면에 표시된 컨텐츠를 보고, 해당 페이지와 상호작용할 수 있습니다.

사용자의 상호작용에는 다음과 같은 행위가 포함됩니다.
- 버튼 클릭
- 입력 필드에 값 입력
- 접혀 있는 아코디언 펼치기

이러한 상호작용은 컨텐츠 내용의 변경 또는 페이지 구조의 변화를 유발합니다.
- 버튼을 클릭하여 카운트 증가 → 컨텐츠 변경
- 아코디언을 펼쳐 숨겨진 DOM 엘리먼트 표시 → 페이지 레이아웃 변경

#### 리액트는 모든 변화를 감지하지 않는다
리액트는 이러한 변화 사항을 효율적으로 관리하는 도구입니다. 하지만 페이지 내에서 발생하는 모든 변화를 리액트가 감지하고 관여하는 것은 아닙니다. 사실 리액트는 수동적인 존재로서, 페이지의 변화를 리액트에게 알려야만 작업을 처리할 수 있습니다.

물론 이러한 설계는 당연한 것입니다. 유저의 상호작용이 모두 리액트에 의해서만 처리되는게 아니니까요. 예로들어 CSS와 HTML 만으로도 유저와의 상호작용이 가능합니다. 내용을 접고 펼칠 수 있는 아코디언은 HTML과 CSS로도 구현 가능하며, 접거나 펼치거나 하는 행위로 인한 Dom 변화는 브라우저의 렌더링 엔진이 처리합니다. (렌더링이라는 단어가 또 나왔네요. 브라우저 렌더링 엔진은 다음 장에서 설명하겠습니다.) 

리액트는 특정 함수들을 통해서만 변화가 발생했음을 감지할 수 있습니다. 아래 세 종류의 함수 내부에는 Render를 요청하는 코드가 포함되어 있습니다. 이 함수들은 리액트 내부에서 데이터를 저장합니다. 리액트에서 관리 중인 데이터가 변경되면 그에 맞게 페이지도 업데이트 되어야 하니 Re-Render가 필요합니다.
- useState
- createContext에서 관리하는 값의 변화
- useReducer

> 위의 함수들과 다르게 데이터를 관리하지만, 리액트에게 렌더링을 요청하지 않는 함수가 있습니다. 바로 `useRef` 입니다. `useRef`는 1. 데이터가 변화해도 리액트 렌더링이 필요한 경우와 2. 특정 Dom 엘리먼트에 직접 접근이 필요한 경우 사용합니다.

### Render
Render 단계는 페이지의 변화 사항을 분석하고, 최적의 브라우저 렌더링 방법을 계산하는 과정입니다. 계산의 결과이자 Render 단계의 결과물은 UI 데이터(=Virtual Dom)라 하는데요. 이는 리액트가 브라우저를 어떻게 렌더링 할지에 대한 청사진과 같은 역할을 합니다. 실제로 UI 데이터는 JS 객체에 불과하며, 이러한 청사진을 만들기 위한 복잡한 계산은 모두 JS로 처리됩니다.

Trigger를 설명하는 장에서 이미 페이지 최초 로딩은 SSR과 CSR의 작동이 다르다고 설명했는데요. CSR은 `createRoot`으로 생성한 root 객체의 `render`매서드를 실행해 Render를 트리거합니다. 이때 CSR의 Render 단계는 리액트를 처음 실행시키는 것이므로 루트 리액트 노드부터 시작한 전체 리액트 노드에 대한 UI 데이터를 만듭니다.

#### 리액트가 효율적인 이유

리액트가 인기를 얻고 지금까지 사용되는 이유는 UI 데이터 기반의 브라우저 렌더링 덕분입니다. 리액트는 페이지 변경 사항을 JS 객체인 UI 데이터에 업데이트한 뒤 이를 기반으로 한 번의 브라우저 렌더링만을 수행하므로 매우 효율적입니다.

반면 리액트가 청사진 없이 Dom 조작 코드를 만날때마다 Dom을 조작한다고 생각해보세요. 그럴때마다 매번 브라우저 렌더링이 수행되는 겁니다. 브라우저 렌더링은 일련의 복잡한 처리 과정을 수행하므로 많은 컴퓨팅 리소스를 필요로 합니다. 그에 반해 실제 브라우저를 업데이트 하는 대신 JS 객체를 업데이트 하는 것은 정말로 간단한 작업이니 리액트가 효율적이라는 겁니다. 

> #### SPA를 생각해보세요
> 특히 SPA(Single Page Application) 환경에서는 리액트의 방식이 더욱 유용합니다. 복잡한 SPA에서는 Dom 조작이 빈번합니다. SPA에서는 DOM 조작이 매우 빈번하게 발생합니다. 예를 들어, 페이지 이동(라우팅)만 하더라도 새로운 UI를 렌더링해야 합니다. 
> 
> 이때 UI 데이터를 사용하지 않고 즉각 즉각 DOM을 변경한다면 매번 브라우저 렌더링이 수행되어 성능 저하로 이어질 것입니다. 하지만 리액트는 UI가 그려질 청사진을 먼저 계산한 후, 최적화된 방식으로 한 번에 렌더링을 수행하기 때문에 SPA에서도 부드럽고 빠른 UI 업데이트가 가능합니다.
>
> 더 깊은 이해를 원하신다면 [[번역] 리액트에 대해서 그 누구도 제대로 설명하기 어려운 것. 왜 Virtual DOM 인가? | VELOPERT.LOG](https://velopert.com/3236)를 참고해 보세요.

#### 상태(State) 업데이트

초기 렌더가 완료되면 사용자는 브라우저와 상호작용이 가능합니다. 브라우저의 상호작용에서 리액트의 setter 함수를 사용하면 리액트의 상태가 변화하고 그에 따른 리렌더를 수행합니다.

상태 변화에 의한 업데이트는 초기 렌더에 의해 현재 페이지에 대한 UI 데이터(`currentTree`)를 데이터를 관리하고 있습니다. 리액트 상태 업데이트는 업데이트가 필요한 컴포넌트부터 UI 데이터(`workingInProgess`Tree)를 생성합니다. 초기 렌더의 시작은 루트 리액트 노드에서부터 였다는 점을 생각하면 매우 효율적입니다.  

리액트는 최신 업데이트 된 상태(State)를 기반으로 새로운 UI 데이터를 만드는 과정에서 기존의 UI 데이터와 비교하며 어느 영역이 실제 업데이트가 필요한지를 기록합니다. 

리액트가 상태변화를 어떻게 업데이트하는지를 [아래와 같이 도식화한 글](https://jser.dev/2023-07-18-how-react-rerenders/#how-react-re-renders-internally)을 참고하시면 이에 대해 쉽게 하실 수 있습니다. 

![img](/assets/blog/frontend/rendering/update.png)


리액트는 위의 절차를 Fiber 엔진을 활용해 수행합니다. Fiber 엔진은 리액트 16에 도입 된 이후 지속적으로 리팩토링되며 개선되고 있습니다. Fiber에 대한 상세 작동원리에 대한 설명에 대해서는 양질의 좋은 글이 많으므로 링크로 대체하겠습니다. 

* [Decoding React’s Reconciliation and Diffing Algorithm: A Brief Overview](https://medium.com/@LiubomyrKl/decoding-reacts-reconciliation-and-diffing-algorithm-a-brief-overview-26ed5f988347)

* [React Fiber: Reconciliation under the hood (with links to source code)](https://medium.com/@LiubomyrKl/react-fiber-reconciliation-under-the-hood-with-links-to-source-code-14408664dbd5)

* [How does React re-render internally?](https://jser.dev/2023-07-18-how-react-rerenders/#4-summary)

* [React 파이버 아키텍처 분석](https://d2.naver.com/helloworld/2690975)

* [컴포넌트 메타데이터와 파이버(Fibers)](https://velog.io/@superlipbalm/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior#%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%A9%94%ED%83%80%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%99%80-%ED%8C%8C%EC%9D%B4%EB%B2%84fibers)

### Commit
Commit은 리액트의 랜더 결과물이라 할 수 있는 UI 데이터를 활용해 실제 브라우저의 Dom을 조작하는 단계입니다. Render 단계에서도 설명했듯 코드를 읽어내려가면서 처리하는 Dom 조작이 브라우저 렌더링을 매번 유발하는 것은 상당히 비효율적입니다. 리액트는 Dom 조작을 한 번만 수행할 수 있도록 리액트 내부에서 업데이트를 관리하고 최적화합니다. 이제는 이 훌륭한 결과물을 활용해 브라우저를 업데이트 하기만 하면 됩니다.

#### 초기 렌더

초기 렌더는 컨텐츠에 대한 브라우저 Dom이 존재하지 않으므로 모든 Dom을 생성합니다. 리액트가 브라우저 Dom을 생성하는 방법은 [아래와 같이 도식화한 글](https://jser.dev/2023-07-14-initial-mount/#how-react-does-initial-mount-first-time-render-)을 참고하시면 쉬운 이해가 가능합니다.

![img](/assets/blog/frontend/rendering/commit.png)

 이렇게 생성한 `Host Dom`은 web API인 AppendChild를 사용해 `id='root'` 인 Dom 엘리먼트 내부에 삽입됩니다. 브라우저 Dom의 변화가 발생하였으므로, 브라우저 엔진은 브라우저 렌더링을 절차를 수행하여 페이지를 그려냅니다. 

#### 상태 업데이트

상태 업데이트는 리액트 루트 전체를 다시 그리지 않고 변경이 필요한 노드와 그 하위 노드를 렌더한다고 했습니다. 그리고 렌더 단계는 변경이 필요한 영역에 대해서 어느 부분을 실제 변경해야 할지를 체크하여 UI 데이터를 생성합니다. 이 UI 데이터는 리액트 노드의 일부 영역만 포함할 뿐아니라 해당 영역 안에서 실제 변경되어야 할 영역이 어디인지를 다루는 청사진입니다. 커밋 단계에서는 이러한 청사진을 활용해 정말 변경이 필요한 부분만 핀포인트로 업데이트 합니다. 

## SSR의 리액트 렌더링

다음으로 SSR에서 리액트 렌더링을 이해합시다. CSR과 다른점은 초기 렌더에 서버가 개입한다는 것입니다. 초기 렌더 이후의 상태 업데이트 발생은 CSR과 마찬가지로 클라이언트 자체적으로 페이지를 업데이트합니다.

상세 설명 이전에 개괄적인 설명을 하겠습니다. 먼저 사용자가 서버에 페이지를 요청하여 리액트의 랜더를 트리거합니다. 서버는 컨텐츠 생성에 필요한 데이터를 수집하고 리액트를 실행해 컨텐츠에 대한 HTML 파일을 생성하여 브라우저에 제공합니다. 브라우저에서 서버에서 렌더 된 HTML을 기반으로 리액트를 사용하기 위해서는 Hydration이라는 절차를 거쳐야합니다. 이는 서버에서 받은 HTML을 활용해 만든 브라우저 Dom Tree를 리액트가 관리하도록 동기화하는 절차입니다.

### Trigger

서버에서의 리액트 트리거는 사용자가 서버에 페이지를 요청하면서 발생합니다. 서버는 컨텐츠 생성에 필요한 데이터를 수집한 다음 [renderToPipableStream(reactNode, options)](https://ko.react.dev/reference/react-dom/server/renderToPipeableStream#rendertopipeablestream)라는 서버에서 실행가능한 리액트 함수 실행시켜 서버에서의 Render를 시작합니다.

[renderToPipableStream(reactNode, options)](https://ko.react.dev/reference/react-dom/server/renderToPipeableStream#rendertopipeablestream)의 인자인 `reactNode`는 서버에서 렌더링하려는 리액트 노드입니다. `options`는 `bootstrapScript`외 다양한 옵션이 존재하지만, 이 글에서는 `bootstrapScript`에 만을 다루도록 하겠습니다. 그 외 다른 옵션은 공식문서에 설명하고 있으니 공식문서를 참고 바랍니다.

```jsx
// server.tsx
import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import { App } from './app.tsx'

const port = Number.parseInt(process.env.PORT || '3000', 10)
const app = express()

app.get('/', (_, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
 bootstrapScripts: ['/main.js'],
});
});

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
    <div>Contents...</div>
    <Suspense fallback={<div>Loading....</div>}>  
      <Router />
    </Suspense>  
    <div>Contents...</div>
   </body>
  </html>
 );
}

```

`bootstrapScripts`는 클라이언트에서 리액트를 실행시키기 위한 경로를 설정하는 옵션입니다. `bootstrapScripts`에 클라이언트 단에서의 리액트를 실행하는 파일명을 입력하면, 아래와 같이 클라이언트로 보낼 HTML 하단에 `<script src="/main.js" async=""></script>`가 삽입됩니다.

```html
<!DOCTYPE html>
<html>
 <!-- ... 컴포넌트의 HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

<!-- 다음으로 `onShellReady`는 Shell 영역의 렌더가 완료된 다음에 실행시키는 Callback 함수를 정의합니다. Shell이라 함은 Suspense 경계 외부 영역을 지칭하는데요. App 컴포넌트에서 Suspense 영역 밖의 모든 영역(suspense부터 html 태그까지)이 Shell이 됩니다. Shell 영역에 속한 리액트 노드가 HTML로 변환되고나면 onShellReady에서 정의한 함수를 실행해 Shell에 해당하는 HTML을 브라우저로 스트림합니다.  -->




### Render와 Hydration
SSR에서의 리액트 Render는 서버와 클라이언트 두 곳에서 발생하는데요. 일반적으로 서버에서 일어나는 과정을 Render라하고 이후 클라이언트에서 발생하는 과정을 Hydrationd이라 합니다.  

서버에서 [renderToPipableStream(reactNode, options)](https://ko.react.dev/reference/react-dom/server/renderToPipeableStream#rendertopipeablestream)의 옵션 중 하나로 `bootstrapScripts`에 대해 설명했는데요. 

bootstrap으로 설정한 `main.js` 안에는 클라이언트에서 Hydration을 트리거하는 코드가 포함되어 있습니다. [hydrateRoot(domNode, reactNode, options)](https://ko.react.dev/reference/react-dom/client/hydrateRoot)가 바로 클라이언트에서의 트리거 함수입니다.

브라우저 JS 엔진은 main.js의 `hydrateRoot(domNode, reactNode);`을 실행하면 클라이언트 리액트는 Hydration을 수행해 서버로부터 받은 컨텐츠를 클라이언트 리액트에서 관리하도록 합니다.

```jsx
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root'); // 실제 dom Node
hydrateRoot(domNode, reactNode);
```

클라이언트에서 Hydration을 시작하기 위해서는 두 가지 조건이 선행되어야 합니다. 

1. 브라우저가 Dom Tree를 완성한다.
2. 리액트 루트 노드에서부터 시작한 전체 UI 데이터가 존재한다.

두 조건이 필요한 이유는 브라우저 Dom Tree와 UI 데이터를 가지고 재조정(Reconciliation)을 거치기 때문입니다. 이 과정에서 브라우저 Dom Tree와 UI 데이터가 일치하지 않는다면 Hydration 에러가 발생하고 createRoot을 처음부터 실행합니다.

리액트는 브라우저 Dom Tree와 UI 데이터가 동일하다고 판단되면 브라우저 Dom Tree를 리액트가 관리할 수 있도록 하는 Hydration을 수행합니다. 이 과정을 통해 리액트 컴포넌트의 로직들이 브라우저 Dom Element에 반영되어 최종적으로 리액트에서 관리하는 페이지를 완성합니다.

> #### SSR에서 상태(State) 업데이트는?
>
> 초기 렌더 이후 발생하는 상태(State) 업데이트는 클라이언트의 리액트에서 관리합니다. 페이지 이동, QueryParameter 변경 등 라우팅의 변화가 발생한 경우는 SSR에서 서버 컴포넌트 사용 하는지의 여부에 따라 차이가 있습니다. 여기서는 Pages Router와 같이 클라이언트 컴포넌트만을 사용한 경우에만 설명하도록 하겠습니다. 
> 
>QueryParameter 변경 등 라우팅의 변화가 발생한 경우는 초기 렌더와 동일한 방식으로 >처리됩니다. 예로들어 제품 검색 시 필터 옵션 변경을 QueryParameter로 관리하게 되면 서버로부터 매번 새로운 HTML을 받아 렌더를 시작합니다. 
>
>SWR 라이브러리 공식문서는 Pages Router로 구현 됐는데요. 공식문서의 URL을 [https://swr.vercel.app/docs/mutation?key=test](https://swr.vercel.app/docs/mutation?key=test)와 같이 parameter를 변경해서 요청하면 서버로부터 이에 대한 URL에 대한 HTML을 새롭게 전송받습니다.
> ![img](/assets/blog/frontend/rendering/swr.png)


# 브라우저 렌더링

브라우저는 여러 개의 핵심 모듈로 구성되어 있으며, 각각의 역할이 분명하게 구분됩니다. 예를 들어, 크롬(Chrome) 브라우저를 기준으로 보면 다음과 같은 주요 모듈이 있습니다.

- V8: 자바스크립트(JS)를 해석하고 실행하는 엔진
- Blink: HTML을 파싱하여 DOM(Document Object Model) 트리를 생성하는 엔진
- CSS 파서: CSS를 해석하여 CSSOM(CSS Object Model) 트리를 생성
- UI 백엔드: 실제 화면에 콘텐츠를 렌더링

브라우저 렌더링은 서버에서 받아온 HTML, CSS, JavaScript 등을 해석하고 화면에 표시하는 전체 과정을 의미합니다. 이 과정은 여러 모듈이 협력하여 수행되며, CPU뿐만 아니라 GPU까지 활용하는 등 상당한 리소스를 필요로 합니다. 

브라우저가 화면을 그리는 과정은 여러 단계로 이루어지며, 리액트 렌더링도 이 흐름 안에서 동작합니다. 리액트는 JS 엔진(V8)에서 실행되며, 내부적으로 렌더(Render) → 커밋(Commit) 단계를 거쳐 UI를 업데이트합니다. 리액트가 변경된 UI를 커밋하면, 브라우저는 이를 반영하여 렌더링 엔진을 통해 실제 화면을 업데이트합니다.

이 장에서는 브라우저 렌더링의 전체적인 과정보다는 **리액트 기반 페이지가 브라우저에서 어떻게 렌더링되는지**에 초점을 맞춰 설명하겠습니다. 브라우저 렌더링 절차에 대한 더 깊은 이해가 필요하신 분들은 아래 공유한 링크를 참고해 주세요.

- [[mdn] 웹페이지를 표시한다는 것: 브라우저는 어떻게 동작하는가](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work?utm_source=chatgpt.com)
- [[mdn] 중요 렌더링 경로](https://developer.mozilla.org/ko/docs/Web/Performance/Critical_rendering_path)
- [[web.dev] Don't fight the browser preload scanner](https://web.dev/articles/preload-scanner)
- [[web.dev] Understand the critical path](https://web.dev/learn/performance/understanding-the-critical-path)
- [💻 브라우저 렌더링 - CRP 멈춰!](https://sangmin802.github.io/Study/Think/browser-parser-blocking/)


## 리액트의 초기 렌더

브라우저 렌더링은 서버로부터 HTML 파일을 요청하는 것에서 시작합니다. 이때 접속하고자 하는 페이지가 CSR로 구성된 경우라면 브라우저에 비어있는 HTML 파일을 제공합니다. 반면 SSR로 구성된 경우라면 컨텐츠가 포함된 HTML을 브라우저에게 제공합니다.

### HMTL 파싱과 TTFB

브라우저는 서버로부터 HTML에 대한 첫 패킷이 도착하면 HTML 파싱을 시작합니다. 일반적으로 웹 통신에서는 데이터를 14KB 단위로 전송하며, 브라우저는 전체 HTML을 다 받은 후 파싱을 시작하는 것이 아니라, 첫 번째 패킷이 도착하는 순간부터 HTML을 분석합니다. 

> 브라우저는 HTML에 대한 패킷을 받자마자 파싱을 시작합니다! 

이때 중요한 성능 지표가 [Time to first byte(TTFB)](https://developer.mozilla.org/ko/docs/Glossary/Time_to_first_byte)입니다. TTFB는 서버에서 첫 번째 바이트를 응답하는 속도를 의미하며, 이 값이 빠를수록 브라우저는 더 빨리 페이지 파싱을 시작할 수 있습니다.

### 리액트 Render와 FCP

First contentful paint(FCP)는 사용자가 처음으로 컨텐츠를 접하는 시간을 의미하는 웹 페이지 성능 측정 요소입니다. FCP 시간을 최소화하는 것이 유저 경험과 SEO에서 필수이므로 최신 웹 기술에서는 DOM Tree 생성을 방해하는 요소를 최소화하려는 노력을 기울이고 있습니다. 

특히, 가장 큰 영향을 미치는 JS 파일의 크기를 줄이거나, CSR에서 SSR로 전환하여 초기 컨텐츠 표시 속도를 개선하는 방향으로 최적화가 진행됩니다.

<!-- 그 중 가장 큰 요소인 JS를 최소화하기 위해 번들 사이즈를 최소화하여 다운로드를 빠르게 하거나, 아예 CSR에서 SSR로의 변화로 이어지고 있습니다. -->

서버에서 받은 HTML은 클라이언트에서 리액트를 실행시키는 `<script>` 태그를 포함하고 있는데요. HTML을 읽어 Dom Tree를 만드는 렌더링 엔진은 파싱 중 `<script>` 태그를 만나면 파싱을 중단하고 JS 처리 결과를 기다려야 합니다. 리액트 렌더가 길어질수록 사용자는 처음 페이지에 접속하고나서 FCP까지 도달하는 시간이 길어집니다.

CSR의 초기 브라우저 렌더링은 다음의 절차로 수행됩니다. HTML 파싱 중 리액트 코드가 포함된 스크립트를 만나면 서버에게 해당 코드를 요청합니다. 파일명은 주로 Index.js 또는 main.js 입니다. 스크립트 설정이 type='module'이므로 기본 처리가 defer 입니다. 그러므로 Dom Tree가 생성 된 후 JS 코드를 실행합니다. JS 처리가 완료될 때까지 브라우저 렌더링은 중단됩니다. 사용자는 JS 처리가 끝나고 렌더링이 완료될 때까지 흰 화면만 바라봅니다.

JS는 index.js 내 `createRoot`을 실행하여 root 객체를 생성하고 `root.render`를 실행해 리액트 렌더링을 시작합니다. 리액트는 리액트 컴포넌트를 처리하여 컨텐츠에 필요한 UI 데이터를 생성합니다.

이는 CSR 뿐만 아니라 SSR도 마찬가지입니다. 대신 SSR은 이미 컨텐츠가 포함된 HTML을 서버로부터 받기 떄문에 브라우저에서 매우 빠르게 화면을 그릴 수 있으며, JS 엔진이 최초 브라우저 렌더링을 방해하지 않도록 초기 브라우저 렌더링 이후에 Hydration을 수행하는 로직이 작성되어 있습니다. 


### 리액트 Commit

커밋 단계에서 리액트는 렌더 단계에서의 결과물인 UI 데이터를 활용해 브라우저 Dom Element 생성을 요청하고 appendChild를 요청합니다. 렌더링 엔진(크롬의 경우 blink)이 이러한 요청을 직접 처리합니다.

지금까지의 프로세스로 Dom Tree 생성은 완료되었으나 브라우저 렌더링은 이제 시작입니다. CSSOM을 생성해 Dom tree와 합성하여 Render Tree를 만들고 이를 기반으로 Layout을 계산하고 최종적으로 Paint하여 컨텐츠를 화면에 나타냅니다.

SSR의 초기 브라우저 렌더링은 사용중인 프레임워크에 따라 세부적인 절차가 다르므로 개괄적인 흐름이 이렇다 정도로 이해하시면 좋겠습니다.

SSR은 서버에서 컨텐츠를 이미 생성하여 클라이언트로 제공하기 때문에 클라이언트에서 직접 컨텐츠를 생성할 필요가 없습니다. 대신 Hydration이라는 클라이언트 단의 작업을 통해 서버의 컨텐츠를 리액트가 관리할 수 있도록 처리 해야합니다. 

Hydration은 이미 완성된 브라우저 Dom Element에 이벤트 리스너를 추가하는 절차입니다. 이 절차를 수행하기 위해서는 완성된 브라우저 Dom Tree가 필요합니다. 그러므로 클라이언트에서는 Dom Tree 생성이 완료된 이후 hydatreRoot을 수행할 수 있도록 로직을 작성해야 합니다. 

이를 위한 가장 간단한 방법은 index.js 스크립트를 HTML 최하단에 위치시키는 것입니다. 최하단에 위치시키면 JS 다운로드를 다운로드 받는 중에 Dom Tree가 생성이 완료되고 JS가 실행되는 흐름을 가질 수 있습니다. 물론 프레임워크는 hydrate를 간단한 방법으로 수행하지 않습니다. 프레임워크는 번들러와의 조합을 통해 화면에 컨텐츠가 그려지고 난 다음 Hydrate 수행할 수 있도록 설정합니다.


## State 업데이트에 의한 리렌더(re-render)

사용자의 행동의 결과 상태(state)가 업데이트 되면, 리액트는 render 단계를 수행해 업데이트가 필요한 UI Data를 생성하고, 이를 활용해 Dom에 대한 실제 업데이트를 요청합니다. 

브라우저가 UI를 다시 그릴 때, 항상 처음부터 모든 과정을 반복하지는 않습니다. 상태 변화가 발생하면 브라우저는 다음과 같은 최적화된 렌더링 절차를 따릅니다. 이떄는 Dom Tree, CSSOM Tree, Render Tree를 생성하는 단계를 건너뛰고 업데이트 종류에 따라 Layout 단계와 paint 단계부터 시작합니다. 

margin, Padding, height, width와 같이  요소의 크기나 위치를 다시 계산해야 하는 경우라면 Layout 단계서부터 시작하며 이를 Reflow라 부릅니다. 반면 bg-color, box-shadow와 같은 기존의 layout을 다시금 사용하더라도 변화를 처리할 수 있다면 paint 단계서부터 시작하며 이를 Repaint라 합니다.


# 마무리

컴퓨터 분야를 공부하면서 매번 느끼는 점은 하나의 용어를 다양한 상황 다양한 개념을 설명하는데 사용한다는 것입니다. 제게는 웹 분야를 공부하면서 '렌더링' 이라는 단어가 그러했습니다. 렌더링은 어느 개념에서나 존재하고 다양한 단어와 조합되어 쓰이곤 하다보니 알다가도 뒤돌면 사람을 혼란스럽게 만듭니다. 아무래도 코드를 작성할 때 변수명을 작성하는게 어렵듯, 개념을 설명할 대상을 부르는 용어를 새로 만든는게 어렵지 않기 때문에 그런가 싶습니다. 렌더링 외에는 딱 맞는 용어가 없을 수 도 있구요

아무튼, 이 글을 작성하고나니 이제는 렌더링에 대해 혼라스러워 할 일이 줄어들 것 같습니다. 그리고 렌더링의 의미 차이를 세세하게 파다보니 덕분에 브라우저 작동원리를 큰 그림으로 이해할 수 있기도 했구요. 

얼마나 많은 분들이 이 글을 끝까지 읽으실지는 모르겠지만, 제 글이 렌더링이 갖고 있는 다양한 의미를 이해하는데 도움 되셨으면 좋겠습니다. 그리고 긴 글을 끝까지 읽어주셔서 감사합니다.


























