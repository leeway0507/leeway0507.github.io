---
publish: true
title: "2부: Next.js App Router 코드로 이해하기"
desc: "React"
category: ["frontend"]
date: "2025-01-21"
---

# 개요 
이 글에서는 Next.js App Router가 어떻게 동작하는지 내부 코드를 살펴보면서 함께 이해해보려고 합니다.

Next.js App Router는 SSR과 서버 컴포넌트가 긴밀하게 연결되어 있어서, 처음 접하면 이해하기가 쉽지 않고 공식 문서만 읽어서는 전체적인 그림을 파악하기 어렵습니다.  

개인적으로 전체적인 그림이 잡히지 않은 경우에는 부분부분 알고 있는 개념의 실체를 코드를 통해 찾아가며 자신만의 논리 흐름을 갖추어나가는 것이 중요하다고 생각하는데요. Next.js App router에 대해서도 코드를 하나씩 찾아가는 방식을 통해 멘탈 모델을 갖추는데 큰 도움이 되었습니다. 

이 글은 1부에서 소개했던 스트림 기반 SSR과 서버 컴포넌트가 Next.js 차원에서는 어떻게 활용되는지를 설명하려는 목적으로 작성했습니다. 그래서 Next.js의 다양한 기능을 설명한다기 보다는, 코드를 직접 살펴보며 사용자 요청이 어떻게 처리되는지 논리적 흐름을 따라간다는 식으로 접근하였습니다. 흐름을 따라가다 궁금한 부분이 생기면 이 글을 출발점으로 삼아 직접 코드를 파헤쳐보시길 바랍니다.

1부에서는 React 18이 해결하고자 했던 문제들과 서버 컴포넌트의 특징, 그리고 React-Server-Component-Demo의 실제 구현을 다뤘습니다. 이번 2부에서는 1부의 내용을 바탕으로 Next.js가 어떻게 HTML을 생성하는지, 그리고 클라이언트에서는 어떻게 Hydration을 수행하는지 내부 코드를 보면서 이해하는 시간을 갖도록 하겠습니다.

> Next.js 15와 webpack을 기준으로 설명합니다.
  
# 용어정리

#### RSC Payload
본격적으로 설명하기 전 변수명으로 자주 등장하는 용어인 RSC Payload와 Flight에 대해 간단히 설명하겠습니다.

서버 컴포넌트를 렌더하면 UI를 그리는데 필요한 데이터가 담긴 JS 객체를 반환합니다. React 18에서는 이를 UI 데이터라 부르고, Next.js는 RSC Payload라 부릅니다. 올바른 용어는 아니지만 흔히들 Virtual Dom이라 부르기도 합니다.

1부 React-Server-Component-Demo에서 서버 컴포넌트의 결과로 생성된 UI 데이터가 서버에서 바이너리 형식으로 브라우저에 전송된다는 것을 봤습니다. 그리고 브라우저는 이 바이너리 데이터를 해석해서 자바스크립트 객체로 만든 다음, React Render 과정에서 사용합니다.

반면, Next.js는 다르게 동작합니다. Next.js에서는 UI 데이터(=RSC Payload)를 서버에서 바이너리로 제공하지 않습니다. 초기 렌더(initial render)의 경우 생성한 HTML 내부에 Script로 RSC Payload를 첨부해 전송합니다. 

RSC Payload는 HTML 하단에 다음과 같은 스타일로 첨부됩니다.

```html
<html>
  <body>
    <script>(self.__next_f=self.__next_f||[]).push([0])</script>
    <script>self.__next_f.push([1,"3:\"$Sreact.fragment\"\n5:I[\"..."])</script>
    ...
    <script>self.__next_f.push([1,"21:[[\"$\",\"meta\",\"0\"...]"])</script>
  </body>
</html>
```

상태(State) 업데이트의 경우 Next.js는 HTML을 생성하지 않고 문자열인 RSC Payload를 브라우저에 전송합니다. 클라이언트 리액트는 새로 받은 RSC Payload와 현재 페이지 UI 데이터를 비교해 페이지를 업데이트 합니다.

![state-update-rsc](/assets/blog/frontend/app-router/state-update-rsc.png)



#### Flight
Flight는 위에서 설명한 RSC Payload의 전송 및 처리를 위한 데이터 구조를 의미합니다. 변수명에 Flight가 포함되어 있다면 RSC Payload를 스트림하기 위한 기능을 말합니다.


#### Fizz
Flight기 React 서버 컴포넌트에 사용되는 로직이었다면, Fizz는 SSR에 사용되는 로직입니다. React 내부에서는 SSR 로직을 다루는 파일명에는 Fizz를 포함하고 서버 컴포넌트 로직을 다루는 파일명에는 Flight를 포함하여 구분하고 있습니다. 

# 서버 실행하기
먼저 next.js 서버를 실행할 때의 순서입니다.

1. 개발자가 `npm run dev`을 실행하면 npm은 환경변수 `node_module/.bin`을 Path에 추가한 뒤 next dev 명령어를 실행합니다. node_module/.bin 내부에는 next 파일이 존재하며 내부에는 NextRootCommand 클래스와 이를 실행하여 사용자의 명령어를 처리하는 로직이 있습니다. 

아래의 코드는 next 파일에 대한 핵심 로직입니다. 74번째 줄에서 NextRootCommand 클래스를 program이라는 변수명으로 초기화한 뒤 85번째 줄에서 dev 환경에서 실행할 로직을 추가합니다. 세부 로직 중 89번째 줄을 보니 dev 변수명을 받으면 `../cli/next-dev.js`의 `nextDev`를 실행하도록 구현되어 있습니다.

``` jsx
// node_modules/.bin/next
74 const program = new NextRootCommand();
85 program.command('dev', ....
89 import('../cli/next-dev.js').then((mod)=>mod.nextDev(options, portSource, directory));
```

2. next-dev.js 모듈에 존재하는 `nextDev`는 283번째 줄에서 `fork`를 활용해 새로운 Node.js 프로세스를 만듭니다. 그리고 이 프로세스는 `start-server` 코드를 실행해 Next.js 서버를 구동하도록 합니다. 249번째 줄에서 start-server 파일 경로를 startServerPath로 지정한 뒤 283번째 줄에서 fork 함수를 이용해 이 파일을 실행시키도록 합니다.

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

3. 새로운 프로세스는 `start-server` 모듈을 불러옵니다. `start-server` 내부 로직에는 서버를 실행하는 코드가 존재하여 모듈을 불러오면서 서버 초기화가 시작됩니다. 이 로직은 427번째 줄에서부터 시작합니다. 내부의 여러 함수를 거쳐 182번째 줄에서 서버 인스턴스를 생성한 뒤  395번째 줄에서 `server.listen(port, hostname)`으로 서버를 실행시킵니다.
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
        }
    ```

# 홈페이지 접속
앞의 과정을 통해 현재 서버가 실행중인 상태입니다. 이제는 사용자가 홈페이지(`/`)에 접속했을 때 Next.js 서버는 어떠한 과정을 거쳐 HTML과 RSC Payload를 생성하고 브라우저에게 데이터를 제공하는지 단계별로 살펴보겠습니다.

1. 182번째 줄을 보면 createSever의 인자는 requestListener를 받고 있습니다. 서버는 외부에서 온 모든 요청을  requestListener를 실행해 처리합니다. requestListener 내부를 보니 이 요청을 requestHandler에 위임해 처리합니다. 

    사용자의 요청과 이를 응답하는 인자는 requestListener를 거쳐 requestHandler에서 처리됩니다.

    ```jsx
    // packages/next/src/server/lib/start-server.ts
    182 const server = ... http.createServer(requestListener) 

    148 async function requestListener(req,res){
      154 await requestHandler(req, res)
    }
    ```


2. 154번째 줄의 requestHandler 내부를 보기 위해서는 약간은 복잡한 초기화 과정을 우선적으로 파악해야 합니다.

  * 117번째 줄에서 requestHandler가 최초로 정의됩니다.
  
  * 148번째 줄에서 requestListener 함수를 정의하는데, 앞서 정의한 117번쨰 줄의 초기 requestHandler를 사용하고 있습니다. 

  * 그러나 requestHandler는 347번째 줄에서 getRequestHandler를 실행하여 얻은 결과인 initResult를 활용해, 360번째 줄에서 initResult.requestHandler로 재정의 됩니다.

  * requestListner를 실행하면 requestHandler를 거쳐 360번째 줄에 정의된 initResult.requestHandler에 의해 실제 요청이 처리됩니다.

  사용자 요청이 initResult.requestHandler에 의해 처리되므로, initResult를 리턴하는 getRequestHandlers 함수 내부를 봐야합니다. getRequestHandlers 함수는 55번째 줄에 정의되어있으며 내부 로직을 보니 78번째 줄에서 initialize를 실행하고 그 결과를 리턴합니다.

  ```jsx
    // packages/next/src/server/lib/start-server.ts
    93 async function startServer(...){
      117 let requestHandler = async(...){}
      148 async function requestListener(){
        154 await requestHandler(req, res)
        }
      347 const initResult = await getRequestHandlers(...)
        55 export async function getRequestHandlers{
          78 return initialize(...)
        }
      360 requestHandler = initResult.requestHandler
    }
  ```


3. initialize 함수는 start-server에 존재하지 않고, router-server.ts 파일에 존재합니다. 이제 요청 처리는 start-server에서 router-server로 넘어갑니다. initialize는 71번째 줄에 정의되어 있습니다. initialize 내부 코드를 보니 607번째 줄 requestHandler의 실체는 requestHandlerImpl임을 확인할 수 있습니다.

    requestHandlerImpl를 보면 함수 내부 로직인 534번째 줄 조건문은 사용자가 요청한 경로에 page.tsx가 존재하면 invokeRender를 실행하도록 합니다. 사용자가 홈페이지(`/`)를 요청한 상태이니 src/page.tsx가 존재하면 invokeRender을 실행합니다.

    invokeRender는 render-server.ts에 있는 initialize를 실행한 뒤 리턴 값에 존재하는 requestHandler를 이용합니다. 165번째 줄에서 render-Server를 임포트하고, 288번째 줄에서 initialize 함수를 실행해 initResult를 얻은 뒤, initResult의 requestHandler에게 처리를 요청합니다. 

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

4. 요청은 start-server-> router server -> render-server로 넘어갔습니다. render-server.ts의 initialize는 70번째 줄인 initializeImpl을 실행시킵니다. 96-112번째 줄을 보니 내부에서는 next.ts의 default인 함수를 next로 정의하고 이를 실행해 server와 requestHandler를 생성합니다. render-server의 requestHandler는 실상 next라는 서버의 requestHandler임을 알 수 있습니다. 

    사용자 요청은 다시 start-server-> router server -> render-server -> next로 넘어갔습니다.

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

5. render-server에서 실행했던 next 함수의 실제 함수명은 `createServer`입니다. 이 함수는 454번째 줄에 있습니다. `createServer` 함수를 실행하면 NextServer 클래스의 인스턴스를 반환받습니다. 

    NextServer 클래스 내부 283번째 줄에는 `getRequestHandler` 메서드가 정의되어 있는데, 이 메서드는 NextServer의 `reqHandler` 메서드를 반환합니다. 287-296 번째 줄에는 `reqHandler`메서드를 정의하는 로직이 존재하며 내부에서 `server.getRequestHandler` 메서드의 값을 반환합니다.

    287-296줄의 로직은 getServer를 실행해서 얻은 반환 값인 server의 getRequestHanlder를 NextServer의 reqHandler 메서드로 재정의하고 있습니다. 다소 복잡하지만 다시 정리하면 NextServer의 getRequestHandler 메서드는 reqHandler 메서드를 반환합니다. reqHandler는 getServer로 얻은 server의 getRequestHandler를 실행해 얻은 값입니다. 

    그러므로 this.getServer()이 어떤 종류의 server를 반환하는지 확인해야합니다.

    ```jsx
    // packages/next/src/server/lib/next.ts
    511 export default createServer
    454 function createServer() {
      503 return new NextServer(options)
        103 export class NextServer implements NextWrapperServer 
          124 getRequestHandler()
            131 const requestHandler = await this.getServerRequestHandler()
            283 private async getServerRequestHandler()
              287-296 if (!this.reqHandlerPromise) {
                  this.reqHandlerPromise = this.getServer().then((server) => {
                  ...
                  this.reqHandler = server.getRequestHandler().bind(server)
                  delete this.reqHandlerPromise
                  return this.reqHandler
                })
              }
              297 return this.reqHandlerPromise
            132 return requestHandler(req, res, parsedUrl)
    }
    ```

6. getServer의 270번째 줄에는 server 인스턴스가 존재하지 않으면 새로 server 인스턴스를 생성하는 로직이 있습니다. 이때의 server 인스턴스는 next-dev-server의 default 입니다. 따라서 앞의 코드에 있는 286번째 줄에 getServer().then(server=>...)에서의 server는 next-dev-server에 존재하는 서버 인스턴스를 의미합니다.

   요청은 start-server-> router server -> render-server -> next -> next-dev-server 순으로 넘어갑니다.

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

7. next-dev-server 파일의 default는 DevServer 클래스입니다. DevServer는 Sever
(=NextNodeServer)의 자식 클래스이며, NextNodeServer는 BaseServer의 자식 클래스 입니다. 

    > DevServer(자식) → NextNodeServer → BaseServer(부모) 순으로 계층을 이룹니다.

    DevServer의 getRequestHandler를 마저 보겠습니다. 이 메서드는 부모 메서드를 오버라이딩 하지만 469번쨰 줄에서 보듯 NextNodeServer에서 정의한 메서드를 그대로 사용합니다. NextNodeServer 또한 1184번쨰 줄에서 보듯 BaseServer의 getRequestHandler 메서드를 그대로 사용하고 있습니다.

    따라서 base-server의 Sever 클래스에서 구현된 getRequestHandler의 로직을 봐야 requestHanlder의 실제 처리를 이해할 수 있습니다. 
    
    BaseSever 클래스 getRequestHandler에서 주목할만한 줄은 633번째 줄과 1444번째 줄입니다. 633번째 줄은 RSC 요청을 처리하는 메서드인 `handleRSCRequest` 이며, 1444번째는 실제 Render를 요청하는 `handleCatchallRenderRequest`메서드입니다. 

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

  8. `handleCatchallRenderRequest`은 실질적으로 페이지 렌더를 요청하는 함수입니다. `handleCatchallRenderRequest`의 구현은 NextNodeServer에 존재합니다. 이 함수는 내부의 1227번째 줄의 super.render 메서드를 실행합니다, render 메서드의 구현은 BaseSserver에 존재합니다. BaseSserver의 render는 다양한 처리를 거쳐 2352번째 줄의 `doRender` 함수를 실행합니다. 

      doRender 함수의 핵심은 2676번째 줄의 `module.render` 입니다. 이 함수를 실행하면 RenderResult 클래스의 인스턴스를 반환합니다. RenderResult 클래스에는 `response` 가 존재하는데, render 결과로 생성된 HTML을 readableStream 유형으로 저장하고 있는 프로퍼티 입니다. 해당 프로퍼티를 string으로 변환하면 RSC Payload가 포함된 문자열 html의 존재를 확인할 수 있습니다.
      
      ```jsx
      // packages/next/src/server/next-server.ts
      1000 protected handleCatchallRenderRequest()
        1084 await this.render()
          1219 public async render()
            1227 return super.render

      // packages/next/src/server/base-server.ts
      333 export default abstract class Server{
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
      }
      ```

9. module.render는 module.ts 61번째 줄에 있습니다. 57번째 줄을 보면 class AppPageRouteModule 클래스가 정의되고 메서드로 render가 존재합니다. render 메서드는 app-render 파일의 renderToHTMLOrFlight를 사용합니다. renderToHTMLOrFlight의 세부 메서드를 추적해서 내려가면 1787번째 줄에서 renderToReadableStream 함수를 사용하는 것을 확인할 수 있습니다.

    ```jsx
    // packages/next/src/server/base-server.ts
    2676 result = await module.render(req, res, context) // base-server.ts
    // packages/next/src/server/route-modules/app-page/module.ts
    57 export class AppPageRouteModule {
      61 public render()
        66 return renderToHTMLOrFlight()
          // packages/next/src/server/app-render/app-render.tsx
          1575 export const renderToHTMLOrFlight()
            1647 return workAsyncStorage.run(renderToHTMLOrFlightImpl)
              1126 async function renderToHTMLOrFlightImpl(){}
                1522 const stream = await renderToStreamWithTracing()
                  1465 const renderToStreamWithTracing()
                    1473 renderToStream()
                      1665 async function renderToStream(){}
                        1787 return ComponentMod.renderToReadableStream(RSCPayload, ...) 
                            1769 const RSCPayload = await workUnitAsyncStorage.run(
                                        getRSCPayload,
                                        ...
                                      )
                                749 async function getRSCPayload(){
                                  859 return {
                                    P: <Preloads preloadCallbacks={preloadCallbacks} />,
                                    b: ctx.sharedContext.buildId,
                                    p: ctx.assetPrefix,
                                    c: prepareInitialCanonicalUrl(url),
                                    i: !!couldBeIntercepted,
                                    f: [
                                      [
                                        initialTree,
                                        seedData,
                                        initialHead,
                                        isPossiblyPartialHead,
                                      ] as FlightDataPath,
                                    ],
                                    m: missingSlots,
                                    G: [GlobalError, globalErrorStyles],
                                    s: typeof ctx.renderOpts.postponed === 'string',
                                    S: workStore.isStaticGeneration,
                                  }
                                }
            1559 return new RenderResult(stream, options)
    }
    ```

    다만 renderToReadableStream는 next.js 자체에서 구현되어 있어 리액트의 renderToReadableStream 인자와는 다른 인자를 받습니다.

    ```jsx
    // packages/next/types/$$compiled.internal.d.ts
    export function renderToReadableStream(
      model: any,
      webpackMap: ClientManifest,
      options?: {
        temporaryReferences?: TemporaryReferenceSet
        environmentName?: string | (() => string)
        filterStackFrame?: (url: string, functionName: string) => boolean
        onError?: (error: unknown) => void
        onPostpone?: (reason: string) => void
        signal?: AbortSignal
      }
      ): ReadableStream<Uint8Array>
    ```
      
# 렌더 결과를 브라우저에 전송

다음으로 서버로부터 요청한 홈페이지(`/`) 문서를 브라우저에 전달하는 순서입니다.

1. 서버의 렌더 결과를 브라우저로 보내는 함수는 base-server의 Server 클래스 render 메서드 내부에 있습니다. 

    1823번재 줄 this.pipe(...)이 그러합니다. this.pipe의 인자인 this.renderToResponse는 실행결과 RenderResult 인스턴스를 반환합니다.

    RenderResult 클래스에는 `response` 프로퍼티외에도 `pipeToNodeResponse`라는 메서드가 존재하며, this.pipe은 RenderResult의 `pipeToNodeResponse`를 사용해 요청 결과를 브라우저에 제공합니다. 
    
    pipe는 여러 순서를 거쳐 528번째 줄의 sendRenderResult를 실행합니다. sendRenderResult는 send-payload.ts의 35번째 줄에 위치하며 인자 중 하나인 RenderResult 클래스의 pipeNodeResponse 메서드를 실행하도록 합니다.

    ```jsx
      // packages/next/src/server/base-server.ts
      333 export default abstract class Server{
        1737 public async render()
          1746 this.renderImpl()
            1823 return this.pipe((ctx) => this.renderToResponse())
              1647 private async pipe(fn)
                1657 this.pipeImpl(fn)
                  1661 private async pipeImpl(...)
                    1702 this.sendRenderResult
                        // packages/next/src/server/next-server.ts
                        516 protected sendRenderResult
                          528 sendRenderResult()
                            // packages/next/src/server/send-payload.ts
                            35 export async function sendRenderResult(result){
                              await result.pipeToNodeResponse(res)
                            }
        }
    ```

2. RenderResult 클래스의 `renderToNodeResponse`은 ReadableStream의 PipeTo를 사용해 요청을 전송하도록 구현되어 있습니다.

    ```jsx
    // packages/next/src/server/pipe-readable.ts
    export async function pipeToNodeResponse(
      readable: ReadableStream<Uint8Array>,
      res: ServerResponse,
      waitUntilForEnd?: Promise<unknown>
    ) {
      try {
        // If the response has already errored, then just return now.
        const { errored, destroyed } = res
        if (errored || destroyed) return

        // Create a new AbortController so that we can abort the readable if the
        // client disconnects.
        const controller = createAbortController(res)

        const writer = createWriterFromResponse(res, waitUntilForEnd)

        await readable.pipeTo(writer, { signal: controller.signal })
      } catch (err: any) {
        // If this isn't related to an abort error, re-throw it.
        if (isAbortError(err)) return

        throw new Error('failed to pipe response', { cause: err })
      }
    }
    ```

# Hydration
마지막으로 서버에서 전송받은 데이터를 브라우저에서 어떻게 처리하는지에 대한 순서 입니다. 서버는 앞서 설명한 복잡한 로직을 처리하여 서버로 보낼 HTML과 RSC Payload를 생성한 뒤 스트림으로 브라우저에게 전송합니다.

1. Next.js 서버는 페이지 최초 로딩 시 RSC Payload가 포함된 HTML을 브라우저로 전송합니다. 이 HTML 내부에는 `self.__next_f`로 시작하는 여러 개의 `<script>` 태그가 포함되어 있습니다. 브라우저는 HTML을 파싱하면서 해당 스크립트를 실행하고, `self.__next_f`를 배열로 생성한 뒤, 첫 번째 요소로 [0]을 추가합니다. 이후 [1, string] 형식의 데이터를 순차적으로 배열에 넣습니다.

    > string은 직렬화 된 RSC Payload를 의미합니다.

    `self.__next_f`는 HTML에서 RSC Payload를 추출하여 ReadableStream으로 변환하기 전, 임시로 저장하는 공간입니다. Next.js 클라이언트는 `self.__next_f`의 값을 가공하여 최종적으로 React 노드와 조합한 뒤, hydrateRoot의 인자로 활용해 클라이언트 측에서 React를 렌더링합니다. 

    > Array의 맨 앞 숫자 0,1은 아래의 의미를 갖습니다. 
    >
    > ```jsx
    > // packages/next/src/client/app-index.tsx
    > 45 type FlightSegment =
    > 46 | [isBootStrap: 0]
    > 47 | [isNotBootstrap: 1, responsePartial: string]
    > 48 | [isFormState: 2, formState: any]
    > 49 | [isBinary: 3, responseBase64Partial: string]
    > ```

    ```html
    <html>
      <body>
        <script>(self.__next_f=self.__next_f||[]).push([0])</script>
        <script>self.__next_f.push([1,"3:\"$Sreact.fragment\"\n5:I[\"..."])</script>
        ...
        <script>self.__next_f.push([1,"21:[[\"$\",\"meta\",\"0\"...]"])</script>
      </body>
    </html>
    ```

2. 클라이언트에서 Next.js 시작되는 시점은 app-bootstrap 함수가 실행되는 시점입니다. 이 함수는 next.js에 필요한 여러 모듈을 초기화하고 hydrate 함수를 실행시켜 서버로부터 받은 HTML와 Next.js를 동기화합니다. 

    > 브라우저 단에서의 코드는 `webPack`을 기준으로 합니다. `webPack`이 `turbopack`에 비해 분석이 쉽고 next.js 15 기준에서 `turbopack`은 여전히 dev에서만 사용할 수 있기 때문입니다. `turbopack` 로직에 대한 이해가 필요하다면 동일한 파일명에 -turbopack이 추가된 있는 파일을 확인하시기 바랍니다.

    ```jsx
      // packages/next/src/client/app-next.ts
      6 appBootstrap(() => {
      7 const { hydrate } = require('./app-index')
      8 // Include app-router and layout-router in the main chunk
      9 require('next/dist/client/components/app-router')
      10 require('next/dist/client/components/layout-router')
      11 hydrate()
    })
    ```

3. appBootstrap의 7번째 줄에서 `app-index` 모듈을 불러오면, 문자열로 존재하는 RSC Payload를 ReadableStream으로 인코드하는 프로세스를 시작합니다.

    모듈을 불러오면서 자동으로 처리되는 코드는 142번째 줄부터 시작합니다. 이 코드는 DomContentLoaded가 완료되면 RSC Payload를 ReadableStream으로 변환하는 절차를 종료시킵니다. 131번째 줄 DOMContentLoaded 함수 내부를 보면 137번째 줄에서 initialServerDataLoaded = true로 변경하여 서버로부터 데이터를 모두 확보했음을 나타냅니다.

    ```jsx
    // packages/next/src/client/app-next.ts
        6 appBootstrap(() => {
        7 const { hydrate } = require('./app-index')
        ...
        })

    // packages/next/src/client/app-index.tsx
        141 // It's possible that the DOM is already loaded.
        142 if (document.readyState === 'loading') {
        143  document.addEventListener('DOMContentLoaded', DOMContentLoaded, false)
        144 } else {
        145  // Delayed in marco task to ensure it's executed later than hydration
        146  setTimeout(DOMContentLoaded)
        167 }

        --- 
        131 const DOMContentLoaded = function () {
        132   if (initialServerDataWriter && !initialServerDataFlushed) {
        133     initialServerDataWriter.close()
        134     initialServerDataFlushed = true
        135     initialServerDataBuffer = undefined
        136   }
        137   initialServerDataLoaded = true
        }
    ```

4. 다음으로는 실행되는 절차는 브라우저에서 수집한 RSC Payload가 담긴 `self.__next_f`를 nextServerDataLoadingGlobal와 연결하고, 이 Array 내부 데이터를 nextServerDataCallback로 처리하는 절차입니다.

    아직 HTML에서 로드되지 않은 RSC payload의 경우 로드단계에서 nextServerDataCallback이 실행되도록, self.__next_f의 push를 nextServerDataCallback로 변경합니다.


    ```jsx
    // packages/next/src/client/app-index.tsx
    149 const nextServerDataLoadingGlobal = (self.__next_f = self.__next_f || [])
    150 nextServerDataLoadingGlobal.forEach(nextServerDataCallback)
    151 nextServerDataLoadingGlobal.push = nextServerDataCallback
    ```

5. nextServerDataCallback의 로직을 보면 데이터 0이 위치한 Array를 처리해 initialServerDataBuffer를 초기화합니다. 그 다음 1로 시작하는 Array는 initialServerDataWriter가 생성되기 전까지 initialServerDataBuffer에 임시로 저장됩니다.

    > Array의 맨 앞 숫자 0,1은 아래의 의미를 갖습니다. 
    > ```jsx
    > // packages/next/src/client/app-index.tsx
    > 45 type FlightSegment =
    > 46 | [isBootStrap: 0]
    > 47 | [isNotBootstrap: 1, responsePartial: string]
    > 48 | [isFormState: 2, formState: any]
    > 49 | [isBinary: 3, responseBase64Partial: string]
    > ```

    ```jsx
    // packages/next/src/client/app-index.tsx 
    61-93 function nextServerDataCallback(seg: FlightSegment): void {
      if (seg[0] === 0) {
        initialServerDataBuffer = []
      } else if (seg[0] === 1) {
        if (!initialServerDataBuffer)
          throw new Error('Unexpected server data: missing bootstrap script.')

        if (initialServerDataWriter) {
          initialServerDataWriter.enqueue(encoder.encode(seg[1]))
        } else {
          initialServerDataBuffer.push(seg[1])
        }
      } else if (seg[0] === 2) {
        initialFormStateData = seg[1]
      } else if (seg[0] === 3) {
        if (!initialServerDataBuffer)
          throw new Error('Unexpected server data: missing bootstrap script.')

        // Decode the base64 string back to binary data.
        const binaryString = atob(seg[1])
        const decodedChunk = new Uint8Array(binaryString.length)
        for (var i = 0; i < binaryString.length; i++) {
          decodedChunk[i] = binaryString.charCodeAt(i)
        }

        if (initialServerDataWriter) {
          initialServerDataWriter.enqueue(decodedChunk)
        } else {
          initialServerDataBuffer.push(decodedChunk)
        }
      }
    }
    ```

6. `self.__next_f`에 대한 초기 세팅이 끝나면 문자열 RSC payload를 ReadableStream으로 변환하는 절차를 수행합니다. 
153-157번째 줄의 코드 실행 시 nextServerDataRegisterWriter가 실행됩니다. 임시로 initialServerDataBuffer에 저장된 문자열 RSC Payload를 ReadableStream으로 변환한 후 initialServerDataWriter = ctr로 지정하여, 아직 처리되지 않은 RSC Payload가 push될 때 readableStream으로 변환되어 저장되도록 설정합니다. 

    ```jsx
    // packages/next/src/client/app-index.tsx 
    153 const readable = new ReadableStream({
    154   start(controller) {
    155     nextServerDataRegisterWriter(controller)
    156   },
    157 })

    --- 
    // packages/next/src/client/app-index.tsx 
    108-129 function nextServerDataRegisterWriter(ctr: ReadableStreamDefaultController) {
      if (initialServerDataBuffer) {
        initialServerDataBuffer.forEach((val) => {
          ctr.enqueue(typeof val === 'string' ? encoder.encode(val) : val)
        })
        if (initialServerDataLoaded && !initialServerDataFlushed) {
          if (isStreamErrorOrUnfinished(ctr)) {
            ctr.error(
              new Error(
                '...'
              )
            )
          } else {
            ctr.close()
          }
          initialServerDataFlushed = true
          initialServerDataBuffer = undefined
        }
      }

      initialServerDataWriter = ctr
    }
    ```

7. 생성된 readableStream은 createFromReadableStream에 의해 가공되어 InitialRSCPayload로 변환 된 후 여러 컴포넌트와 결합하여 사용됩니다.

    ```jsx
    159 const initialServerResponse = createFromReadableStream<InitialRSCPayload>(
    160   readable,
    161   { callServer, findSourceMapURL }
    162 )
    ```

8. 프로세스는 다시 app-bootstrap으로 돌아가서 `app-router`모듈과 `layout-router`를 초기화하고 마지막으로 `app-index`의 `hydrate`를 실행합니다.

    ```jsx
    // packages/next/src/client/app-next.ts
        6 appBootstrap(() => {
        7 const { hydrate } = require('./app-index')
        8 // Include app-router and layout-router in the main chunk
        9 require('next/dist/client/components/app-router')
        10 require('next/dist/client/components/layout-router')
        11 hydrate()
      })

    // packages/next/src/client/app-index.tsx 
        252 export function hydrate() {
          283  ReactDOMClient.hydrateRoot(appElement, reactEl, {
          284   ...reactRootOptions,
          285  formState: initialFormStateData,
              })
        }
    ```

9. 283번째 줄 `react.hydrateRoot`은 브라우저 Dom 노드와 React 노드를 인자로 받습니다. 브라우저 노드에 해당하는 인자인 appElement는 33번째 줄에서 Document로 선언하였으며, reactEl은 React 컴포넌트와 RSC Payload가 결합되어 사용되고 있습니다.

    ```jsx
    33 const appElement: HTMLElement | Document = document

    253   const reactEl = (
    254    <StrictModeIfEnabled>
    255      <HeadManagerContext.Provider value={{ appDir: true }}>
    256        <Root>
    257          <ServerRoot />
    258        </Root>
    259      </HeadManagerContext.Provider>
    260    </StrictModeIfEnabled>
    261  )

    195-218 function ServerRoot(): React.ReactNode {
      const initialRSCPayload = use(initialServerResponse)
      const actionQueue = use<AppRouterActionQueue>(pendingActionQueue)

      const router = (
        <AppRouter
          actionQueue={actionQueue}
          globalErrorComponentAndStyles={initialRSCPayload.G}
          assetPrefix={initialRSCPayload.p}
        />
      )
      ... 
      return router
    }

    ```

# 마무리

이상으로 Next.js에서 어떻게 사용자의 요청을 처리하는지, 브라우저는 요청받은 문서를 활용해 어떠한 흐름으로 Hydration을 수행하는지를 이해했습니다. 

끝으로 Next.js App Router 이해에 도움되는 링크를 첨부합니다.

- [Demystifying React Server Components with NextJS 13 App Router](https://demystifying-rsc.vercel.app/)

- [Understanding React Server Components](https://tonyalicea.dev/blog/understanding-react-server-components/)


- [[saengmotmi's blog]React Fizz & Flight (긴 글 주의)](https://saengmotmi.netlify.app/react/fizz-flight/)

- [RSC Payload & Serialized Props](https://hrtyy.dev/web/rsc_payload/)

- [React Server Component & Next.js를 통해 진행하는 웹 최적화 실험](https://bolang2.notion.site/React-Server-Component-Next-js-a35232d92c5a4c03915b3df730066c61)


