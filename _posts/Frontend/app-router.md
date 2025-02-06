---
publish: true
title: "[React] 2부 Next.js App Router 코드로 이해하기"
desc: "리액트"
category: ["frontend"]
date: "2025-01-21"
thumbnail: "/assets/blog/deeplearning/paper/Bert/thumbnail.png"
ogImage:
 url: "/assets/blog/deeplearning/paper/Bert/thumbnail.png"
---

# 개요 
>이 글은 [1부 리액트 18이 해결하고자 했던 문제]에서 설명한 내용을 기반으로 실제 내부의 코드는 어떠한 흐름을 가지는지 설명하고 있습니다. 따라서 리액트 18의 강화된 SSR 기능, 서버 컴포넌트에 대한 이해를 필요로 합니다.

Next.js의 App Router는 SSR과 서버 컴포넌트가 유기적으로 결합된 구조를 가지고 있어, 웹 개발에 대한 기본적인 이해가 부족한 경우 개념적으로 혼란을 겪기 쉽습니다. 특히 Next.js 공식 문서만으로는 App Router에서 사용중인 새로운 기능의 목적을 정확히 파악하는데 한계가 있습니다. 

지난 1부에서 리액트 18이 어떠한 문제를 해결하고자 했는지를 설명했습니다. 특히 서버 컴포넌트는 설계에서 프레임워크 사용을 전제로 진행됐다는점을 말씀드렸고, React-Server-Component-Demo를 분석하는 장에서 서버 컴포넌트가 실제로 어떠한 흐름을 가지고 동작되는지를 이해할 수 있었습니다.

이번에는 Next.js의 App Router가 어떻게 실행되며, 어떠한 흐름으로 HTML을 생성하고, 이를 어떻게 Hydration하는지 코드 레벨로 설명하고자 합니다. 다만 next.js는 수십만줄로 구성된 프로젝트이다보니 어느 파일에서, 어떤 함수가 실행되고 그에 따른 결과가 무엇인지에 대해 위주로 설명하고자 합니다. 단순 이 글을 읽는 수준에서는 이해가 되지 않을 가능성이 매우 높기 떄문에 실제 코드를 읽어보기 위한 이정표로서 활용해주시기 바랍니다.

# 용어정리
코드를 이해하는 데 있어 알아야할 개념 몇가지를 간단히 소개하겠습니다.

## RSC Payload
Next.js에서는 리액트 서버 컴포넌트의 결과인 JS 객체를 RSC Payload라 합니다. 리액트 18에서는 컴포넌트에 대한 UI 데이터로 설명하고 있는데, 같은 대상을 의미합니다. 

React-Server-Component-Demo 장에서 설명했듯 UI 데이터는 서버에서 바이너리 형식으로 브라우저에 제공되며 브라우저는 이를 Decode하여 JS 객체로서 활용합니다. Next.js에서는 서버 컴포넌트를 SSR과 함께 사용하므로 서버에서 바로 보내지 않고 HTML 내 Script를 활용해 함께 전송합니다. 

RSC Payload 실체는 HTML 태그 하단에 위치한 string으로 쉽게 확인 가능합니다.

## Flight
앞으로 코드를 설명하면서 Flight이라는 이름이 들어간 변수명이나 함수명을 자주 볼텐데요. Flight은 ~~입니다. 

# 서버 실행
먼저 next.js 서버를 실행해 보겠습니다. 

1. `npm run dev` 실행 시 내부의 로직을 거쳐 `NextRootCommand`가 실행됩니다. 153번째 줄에서 dev 관련된 로직이 보이고 204번째 줄에서 next-dev.js 폴더의 nextDev를 실행합니다.
``` jsx
// package/next/src/bin/next.ts
91  const program = new NextRootCommand()
153 program.command('dev', { isDefault: true })...
  204 import('../cli/next-dev.js').then((mod) =>
          mod.nextDev(options, portSource, directory)
        )
```

2. nextDev는 새로운 Node.js 프로세스를 시작하고, 프로세스는 `start-server`을 실행합니다.
```jsx
// packages/next/src/cli/next-dev.ts
159 const nextDev = async (...){
    385 await runDevServer(false)
    347 const runDevServer = async(...){
      370 await startServer(...)
        251 async function startServer(...){
          249 const startServerPath = require.resolve('../server/lib/start-server')
              283 child = fork(startServerPath, ...)
        }
    }
}

```

3. `start-server`은 실제 서버를 실행시킵니다. 서버 실행을 위한 로직은 427번째 줄에서부터 시작하며, `startServer` 함수를 통해 initialize를 한 뒤 `server.listen(port, hostname)`으로 완료됩니다.
```jsx
// packages/next/src/server/lib/start-server.ts
427 if (process.env.NEXT_PRIVATE_WORKER && process.send)
  443 startServer(msg.nextWorkerOptions)
  93 async function startServer(...){
    182 const server = selfSignedCertificate ? https.createServer(
            {
              key: fs.readFileSync(selfSignedCertificate.key),
              cert: fs.readFileSync(selfSignedCertificate.cert),
            },
            requestListener
          )
        : http.createServer(requestListener)
      ...
    395 server.listen(port, hostname) // 서버 실행
```
# 요청처리 절차
앞 장에서는 npm run dev 이후 서버가 실행되는 순서를 설명했습니다. 이제 사용자가 홈페이지(`/`)에 접속 했을 때 서버가 이 요청을 어떠한 순서로 처리하여 HTML을 전송하는지를 섦명하겠습니다.

1. 서버의 리스너로 requestListener를 받습니다. 서버에서 요청을 감지하면 requestListener가 실행됩니다. requestListenr 내부에는 해당 요청을 requestHandler를 이용해 처리합니다. 
```jsx
// packages/next/src/server/lib/start-server.ts
148 async function requestListener
  154 await requestHandler(req, res)
  360 requestHandler = initResult.requestHandler
```

2. requestHandler는 getRequestHandlers의 initialize를 실행해 얻은 return 값인 requestHanlder로 초기화 됩니다.
```jsx
// packages/next/src/server/lib/start-server.ts
117 let requestHandler = async(...){}
347 const initResult = await getRequestHandlers(...)
  55 export async function getRequestHandlers{
    78 return initialize(...)
  }
360 requestHandler = initResult.requestHandler
```

3. 이 initialize는 router-server.ts 파일에 존재합니다. return 값인 requestHandler의 실제 로직은 requestHandlerImpl입니다. 요청한 경로에 page.tsx가 존재하면 invokeRender를 실행합니다.

invokeRender 함수는 renderServer를 initialize 한 뒤 renderServer에 requestHandler하여 요청을 처리합니다.

```jsx 
// packages/next/src/server/lib/router-server.ts
71 export async function initialize(){
    607 let requestHandler: WorkerRequestHandler = requestHandlerImpl
    165 renderServer.instance = require('./render-server') as typeof import('./render-server')
      168 const requestHandlerImpl: WorkerRequestHandler = async (req, res) =>{
        534 if (matchedOutput)
          537 return await invokeRender()
            238 async function invokeRender{
              288 const initResult = await renderServer?.instance?.initialize(renderServerOpts)
              291 await initResult?.requestHandler(req, res)
            }
      }
}
```

4. 사용자 요청은 invokeRender의 내부 로직인 renderServer로 위임된 상태입니다. initialize는 initializeImpl을 실행하고 내부에서는 next.ts의 default인 함수인 next를 실행해 server와 requestHandler를 반환하고 prepare로 실행 시킵니다.

```jsx

// packages/next/src/server/lib/render-server.ts
import next from '../next'

115 export async function initialize
  123 return (initializations[opts.dir] = initializeImpl(opts))
    70 async function initializeImpl(){
    96-112 const server = next({
      ...opts,
      hostname: opts.hostname || 'localhost',
      customServer: false,
      httpServer: opts.server,
      port: opts.port,
    }) as NextServer // should return a NextServer when `customServer: false`
    requestHandler = server.getRequestHandler()
    upgradeHandler = server.getUpgradeHandler()
    await server.prepare(opts.serverFields)

    return {
      requestHandler,
      upgradeHandler,
      server,
    }
  }

```

5. render-server에서 불러온 next 함수의 실제 함수명은 createServer 입니다. 이 함수는 NextServer 인스턴스를 생성합니다. NextServer는 `getRequestHandler`를 가지고 있습니다. render-server의 initialize는 NextServer의 `getRequestHandler`를 실행한 결과를 requestHandler로 받고 있습니다. 

```jsx
511 export default createServer
454 function createServer() {
  503 return new NextServer(options)
  103 export class NextServer implements NextWrapperServer 
    124 getRequestHandler()
      131 const requestHandler = await this.getServerRequestHandler()
      283 private async getServerRequestHandler()
        287-296 if (!this.reqHandlerPromise) {
            this.reqHandlerPromise = this.getServer().then((server) => {
            this.reqHandler = getTracer().wrap(
              NextServerSpan.getServerRequestHandler,
              server.getRequestHandler().bind(server)
            )
            delete this.reqHandlerPromise
            return this.reqHandler
          })
        }
        
        297 return this.reqHandlerPromise
      132 return requestHandler(req, res, parsedUrl)
}
```
getServer는 기존에 존재하는 server 인스턴스 존재하지 않으면 새로 server 인스턴스를 생성하는 로직도 포함합니다. 이때의 server 인스턴스는 next-dev-server에 존재하는 DevServer 입니다. 

```jsx
  253 private async getServer() {
      270 this.server = await this.createServer()
      277 return this.server
      206 private async createServer(){
        211 ServerImplementation = require('./dev/next-dev-server')
      .default as typeof import('./dev/next-dev-server').default
      }  
  }
  ```

  그러므로 297번째 줄에서 return하는 reqHandlerPromise는 DevServer의 getRequestHandler이 됩니다.

  6. DevServer는 NextNodeServer의 자식 클래스입니다. DevServer의 getRequestHandler는 부모 매서드에 로그가 추가되었습니다. NextNodeServer 또한 부모 클래스의 getRequestHandler를 그대로 받고 있습니다. 

  base-server에서는 드디어 RSC 요청을 처리하는 매서드인 `handleRSCRequest`가 나타납니다. 그 아래에는 Render 전체에 대해 요청하는 `handleCatchallRenderRequest`도 나옵니다. 

  ```jsx 
  // packages/next/src/server/dev/next-dev-server.ts
  101 default class DevServer extends Server
    468 public getRequestHandler()
      469 const handler = super.getRequestHandler()

  // packages/next/src/server/next-server.ts
  160 export default class NextNodeServer extends BaseServer
  1164 public getRequestHandler()
    1165 const handler = this.makeRequestHandler()
      1175 private makeRequestHandler()
        1184 const handler = super.getRequestHandler()

  // packages/next/src/server/base-server.ts
  333 export default abstract class Server{
    1575 public getRequestHandler()
      1579 this.handleRequest.bind(this)
        878 public async handleRequest()
          948 private async handleRequestImpl()
            1017 let finished = await this.handleRSCRequest(req, res, parsedUrl)
              633 private handleRSCRequest()
            1444 await this.handleCatchallRenderRequest(req, res, parsedUrl)
  }
  ```
  7. `handleCatchallRenderRequest`은 실질적으로 페이지 렌더를 요청하는 함수입니다. `handleCatchallRenderRequest`의 구현은 자식 클래스인 NextNodeServer에 존재하고 render를 처리하는 함수는 부모 클래스인 base-server에 존재합니다. render의 실행은 다양한 매서드를 거쳐 `doRender`에서 실제 처리가 됩니다. html 생성은 `module.render`가 담당하고 있습니다.
  
  ```jsx
  // packages/next/src/server/next-server.ts
  1000 protected handleCatchallRenderRequest()
    1084 await this.render()
      1219 public async render()
        1227 return super.render

  // packages/next/src/server/base-server.ts
  1737 public async render()
    1746 this.renderImpl()
      1823 return this.pipe((ctx) => this.renderToResponse())
        3646  private async renderToResponse()
          3658 this.renderToResponseImpl()
            3669 private async renderToResponseImpl()
              3696 const result = await this.renderPageComponent()
                3605 protected async renderPageComponent()
                  3634 return await this.renderToResponseWithComponents()
                    1854  private async renderToResponseWithComponents()
                      1861 this.renderToResponseWithComponentsImpl()
                        1906 private async renderToResponseWithComponentsImpl()
                          3036 const result = await doRender()  
                            2352 doRender(){
                              2449 let result: RenderResult
                              2676 result = await module.render(req, res, context)
                              2762 return {
                                    value: {
                                      kind: CachedRouteKind.APP_PAGE,
                                      html: result,  // <--- html stream
                                      headers,
                                      rscData: metadata.flightData,
                                      postponed: metadata.postponed,
                                      status: res.statusCode,
                                      segmentData: metadata.segmentData,
                                    } satisfies CachedAppPageValue,
                                    revalidate: metadata.revalidate,
                                    isFallback: !!fallbackRouteParams,
                                  } satisfies ResponseCacheEntry
                            }
              3707 if (result !== false) return result

    // 실제 html 생성 함수
    2676 result = await module.render(req, res, context) // base-server.ts
    // packages/next/src/server/route-modules/app-page/module.ts
      61 public render()
        66 return renderToHTMLOrFlight()
          // packages/next/src/server/app-render/app-render.tsx
          1575 export const renderToHTMLOrFlight()
            1647 return workAsyncStorage.run(renderToHTMLOrFlightImpl)
              1126 async function renderToHTMLOrFlightImpl()
                1522 const stream = await renderToStreamWithTracing()
                  1465 const renderToStreamWithTracing()
                    1473 renderToStream()
                      1665 async function renderToStream()
                        1787 return ComponentMod.renderToReadableStream()

            1559 return new RenderResult(stream, options)

  ```



# HTML 생성 및 전송

# Hydration
