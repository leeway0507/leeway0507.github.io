import Image from "next/image";
import "../portfolio.module.css";
import Transition from "../motion";
import Back from "../back";
import { Go, Nextjs, Tailwind, Typescript, Mysql, Node, Aws } from "../skill";
import Link from "next/link";
import { Fugaz_One } from "next/font/google";

export default async function Captured() {
  return (
    <div className="page">
      <Intro />
      <MainImage />
      <Content />
    </div>
  );
}

const FugazeOne = Fugaz_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

function Intro() {
  return (
    <Transition className="space-y-16 mx-auto">
      <Back />
      <div
        className={`text-4xl font-bold pb-2 w-full flex items-center justify-center ${FugazeOne.className} text-red-500`}
      >
        CAPTURED
      </div>
      <div className="space-y-6 mx-auto">
        <div>
          패션에 관심 많은 지인의 고민이 서비스의 출발점이었습니다. 한국에서
          인기 있는 패션 제품을 분석하고, 전세계 편집샵에서 이러한 제품을 찾아
          판매하는 초기 프로젝트를 기획했습니다. 초기 시도를 통해 1,000만 원의
          매출을 달성하였고 서비스로의 발전 가능성을 확인할 수 있었습니다.
          프로젝트를 서비스로 발전시키고자, 5년간 저축한 자금과 밤낮 주말 없는
          시간을 투자하여 온라인 편집샵을 개발하고 운영했습니다.
        </div>
        <Link
          href={"https://captured-vercel-yangoos-projects.vercel.app/"}
          className="font-semibolds underline block text-gray-400 inline-block"
          target="_blank"
        >
          사이트로 이동하기
        </Link>
      </div>
    </Transition>
  );
}
function MainImage() {
  return (
    <Transition className="space-y-8" delay={0.3}>
      <div className="relative">
        <Image
          src="/portfolio/captured/main.webp"
          alt="flow"
          width={1800}
          height={900}
          className="object-contain"
        />
      </div>
    </Transition>
  );
}

function Content() {
  return (
    <Transition delay={0.5} className="content">
      <Flow />
      <InfiniteScroll />
      <SignUp />
      <Optimization />
      <Blog />
      <Skills />
      <Back />
    </Transition>
  );
}

function Skills() {
  return (
    <div className="mx-auto space-y-4">
      <h1 className="sub_title">사용 기술</h1>
      <div className="flex gap-3">
        <Nextjs />
        <Typescript />
        <Tailwind />
        <Go />
        <Node />
        <Mysql />
        <Aws />
      </div>
    </div>
  );
}
function Flow() {
  return (
    <div className="mx-auto space-y-8">
      <div className=" mx-auto space-y-8">
        <h1 className="text-xl font-semibold ">구매 플로우</h1>
        <div>
          100여 개의 편집샵을 레퍼런스로 하여 개별 사이트가 어떠한 구조를
          갖는지와 전반적인 구매 흐름을 분석하고 이를 반영하였습니다. 개별
          편집샵이 가지는 불편한 사용자 경험을 분석하고, 이러한 요소들을 구매
          플로우에서 최대한 배제하도록 세심하게 다듬었습니다.
        </div>
        <div>
          이 과정을 통해 어떻게 해야 사용자에게 더 편리한 UX를 제공할 수 있을지
          실질적으로 고민하고 적용해보는 경험을 할 수 있었습니다. 이론적인
          연구보다는 실제 사용자로서 느낀 불편함을 해소하는 데 중점을 두어 보다
          직관적이고 사용하기 쉬운 서비스를 만들기 위해 노력했습니다.
        </div>
      </div>
      <video width="full" height="full" controls autoPlay loop muted>
        <source src={"/portfolio/captured/flow.mp4"} type="video/mp4" />
      </video>
    </div>
  );
}
function SignUp() {
  return (
    <div className=" mx-auto space-y-8">
      <h1 className="sub_title">회원가입</h1>
      <div>
        NextAuth.js를 활용하여 네이버, 카카오 소셜 로그인 구현 외에도 자체
        회원가입을 구현하였습니다. 회원가입 절차는 React-form-hook와 Zod를
        조합하여 데이터 유효성 검증을 구현했고, AWS SMTP 서비스를 연동하여
        이메일 인증 시스템을 구축했습니다.
      </div>
      <div>
        이를 통해 OAuth 2.0 프로토콜의 실제 구현 방법과 JWT를 활용한 상태 관리,
        그리고 이메일 인증 프로세스 구현을 경험할 수 있었습니다. 또한 Zod를 통한
        타입 안전성 확보와 효과적인 폼 상태 관리의 중요성을 실감하며, 사용자에게
        편리하면서도 안전한 회원가입 절차를 설계하는 능력을 향상시킬 수
        있었습니다.
      </div>
      <video width="full" height="full" controls autoPlay loop muted>
        <source src={"/portfolio/captured/registration.mp4"} type="video/mp4" />
      </video>
      <div className="relative">
        <Image
          src="/portfolio/captured/email.webp"
          alt="email"
          width={1800}
          height={900}
          className="object-contain"
        />
      </div>
    </div>
  );
}

function Optimization() {
  return (
    <div className="space-y-4">
      <div className=" mx-auto space-y-8">
        <h1 className="sub_title">성능 최적화</h1>
        <div>
          당시의 서비스는 Next.js 프레임워크의 핵심 기능과 리액트 18 서버 기능을
          충분히 활용하지 못한 구조적 한계를 갖고 있었습니다. 번들 사이즈 증대
          및 서버 내 이미지를 최적화하는 구조로 인해 초기 로딩 지연이
          발생했습니다. 레이아웃 흔들림(CLS), 페이지 플리커링 발생으로 사용자
          경험 저하가 발생하였으며, 개발 시간의 30% 이상을 에러 원인 추적과
          디버깅에 할애하여 구조 개선 및 생산성 향상이 필요했습니다.
        </div>
        <div>
          당시에는 표면적으로 드러나는 문제만 해결하려 했습니다. 그러던 중 두
          개의 React RFC를 읽으며, 기술을 바라보는 접근 방식이 근본적으로
          잘못되었음을 알게 되었습니다. 기술은 결국 특정 문제를 해결하기 위해
          만들어진 것이므로, 그 태생적 배경을 이해해야 올바르게 활용할 수 있다는
          것을 깨달았습니다. React의 스트림 SSR과 서버 컴포넌트가 어떤 문제를
          해결하기 위해 도입되었는지를 파악하니, 이 문제를 어떻게 해결해야할지
          방향이 보였습니다.
        </div>
        <div>
          클라이언트 컴포넌트의 20%를 서버 컴포넌트로 리팩토링하여 브라우저 번들
          크기 46% 감소 및 캐싱 최적화를 달성하였습니다. 스트림 기반 SSR 설계
          의도를 반영하여 페이지 구조를 개선하고 suspense를 사용하여 First
          Contentful Paint(FCP) 0.4초로 단축했습니다. useEffect에 의존하는
          로직을 개선하고 서버 컴포넌트로 리팩토링하여, 레이아웃 흔들림(CLS)과
          페이지 플리커링을 해결했습니다.
        </div>
      </div>
      <div className="relative">
        <Image
          src="/portfolio/captured/optimization.webp"
          alt="flow"
          width={1800}
          height={900}
          className="object-contain"
        />
      </div>
    </div>
  );
}

function Blog() {
  return (
    <div className=" mx-auto space-y-4">
      <h1 className="sub_title">React 18 신규 기능 정리</h1>
      <div>
        성능 최적화를 수행하는 과정에서 개인적으로 학습하고 기록했던 내용을
        블로그 형식으로 재작성하였습니다.
      </div>
      <ul className="w-full space-y-8 list-disc ps-4">
        <li className="space-y-4">
          <Link
            href="https://leeway0507.github.io/blog/frontend/react18"
            className="text-lg underline block text-gray-400 inline-block"
            target="_blank"
          >
            1부 React18이 해결하고자 하는 문제들
          </Link>
          <div>
            React 18의 신규 기능인 스트림 기반 SSR과 서버 컴포넌트가 개별적으로
            어떠한 문제를 해결하기 위해 고안되었는지, 어떠한 방식으로 이를
            해결하였는지를 다루었습니다. 또한 React 팀이 제공한 서버 컴포넌트
            데모 코드를 분석하여 서버 컴포넌트가 실제 처리되는 절차를
            정리했습니다.
          </div>
        </li>
        <li className="space-y-4">
          <Link
            href="https://leeway0507.github.io/blog/frontend/app-router"
            className="text-lg underline block text-gray-400 inline-block"
            target="_blank"
          >
            2부 Next.js App Router 코드로 이해하기
          </Link>
          <div>
            Next.js App Router가 사용자 요청을 처리하는 전체 흐름을 코드
            기반으로 정리했습니다. 구체적으로는 Next.js 서버가 실행되는 흐름,
            사용자가 홈페이지에 접속했을 때 서버의 처리절차, 서버로부터 받은
            HTML을 Next.js가 Hydration하는 절차를 분석했습니다.
          </div>
        </li>
        <li className="space-y-4">
          <Link
            href="https://leeway0507.github.io/blog/frontend/rendering"
            className="text-lg underline block text-gray-400 inline-block"
            target="_blank"
          >
            다양한 의미로 쓰이는 렌더링 이해하기
          </Link>
          <div>
            서버 사이드 렌더링과 브라우저 렌더링을 리액트 렌더링과 연관지어
            정리했습니다.
          </div>
        </li>
      </ul>
    </div>
  );
}

function InfiniteScroll() {
  return (
    <div className=" mx-auto space-y-4">
      <h1 className="sub_title">무한 스크롤</h1>
      <div>
        InterSection Observer와 query parameter를 활용해 무한 스크롤을
        구현하였습니다. 구현초기 useState, contextAPI와 같은 상태 관리를 통해
        구현하고자 했으나, 필터 기능과의 연동 문제 및 페이지 이동 시 정보 유실로
        인해 사용자 경험이 저하되는 문제가 발생했습니다.
      </div>
      <div>
        query parameter를 활용한 상태 관리를 도입하면서 해당 문제를 해결할 수
        있었습니다. 필터 상태를 query parameter에 저장함으로써 복잡한 의존성
        문제를 줄일 수 있었고, 상태 정보가 history API에 기록되어 페이지 이동
        시에도 데이터가 유실되지 않는 장점이 있었습니다.
      </div>
      <div>
        서버 단에서는 이러한 무한 스크롤을 지원하기 위해 커서 기반
        페이지네이션과 쿼리를 조합하여 필터 조건에 맞는 조건절을 생성하는 기능을
        개발함으로써 효율적인 데이터 처리를 가능하게 했습니다.
      </div>
      <video width="full" height="full" controls autoPlay loop muted>
        <source
          src={"/portfolio/captured/infinite-scroll.mp4"}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
