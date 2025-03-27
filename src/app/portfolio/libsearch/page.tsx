import Image from "next/image";
import "../portfolio.module.css";
import Transition from "../motion";
import Back from "../back";
import { React, Go, ChakraUI, Zustand, Postgresql, Typescript } from "../skill";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="page">
      <Intro />
      <MainImage />
      <Content />
    </div>
  );
}

function Intro() {
  return (
    <Transition className="space-y-8 mx-auto">
      <Back />
      <div className="flex gap-4 items-center mx-auto justify-center py-12">
        <Image
          src="/portfolio/libsearch.svg"
          alt="flow"
          width={70}
          height={70}
          className="object-contain"
        />
        <div className="text-4xl font-bold pb-2 ">Libsearch</div>
      </div>
      <div className="space-y-6 mx-auto">
        <div>
          Libsearch는 서울시 산하 다양한 공공 도서관의 장서 정보를 한 번에
          검색할 수 있는 서비스입니다.
        </div>
        <div>
          평소 도서관을 이용하면서 여러 도서관을 번갈아가며 검색해야 하는
          불편함과 도서 제목에만 의존한 제한적인 검색 방식에 불편함을
          느꼈습니다. 이러한 문제점을 해결하고자, 사용자가 자주 방문하는
          도서관에 대한 통합 검색 기능을 개발했습니다. 또한 단순 제목 검색을
          넘어, 도서의 목차와 상세 소개 정보까지 벡터화하여 더 정확하고 다양한
          방식의 검색이 가능하도록 구현했습니다. 이를 통해 원하는 주제나 원하는
          내용의 책을 더욱 쉽게 찾을 수 있습니다.
        </div>
        <Link
          href={"https://libsearch.xyz"}
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
    <Transition className="space-y-8 " delay={0.3}>
      <div className="relative">
        <Image
          src="/portfolio/libsearch/main.webp"
          alt="main"
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
      <VectorSearch />
      <GlobalStatus />
      <BestSeller />
      <Skills />
      <Back />
    </Transition>
  );
}

function BestSeller() {
  return (
    <div className="space-y-6">
      <h1 className="sub_title">베스트셀러</h1>
      <div>
        자주 방문하는 도서관의 베스트셀러를 제공합니다. 베스트셀러 보유 여부와
        대출 상태를 자주 방문하는 도서관을 중심으로 제공하여 사용자가 필요한
        정보를 한눈에 제공합니다.
      </div>
      <video width="full" height="full" controls autoPlay loop muted>
        <source src={"/portfolio/libsearch/bestseller.mp4"} type="video/mp4" />
      </video>
    </div>
  );
}
function VectorSearch() {
  return (
    <div className="space-y-6">
      <h1 className="sub_title">OpenAI를 활용한 벡터 검색</h1>
      <div>
        자주 방문하는 도서관에 대한 벡터 검색을 제공합니다. 사용자가 검색을
        하면, 서버는 해당 검색어에 대한 캐시를 찾고 존재하지 않으면 OpenAI를
        활용해 검색어에 대한 벡터를 생성하고 서버에 저장합니다. Pg Vector를
        활용해 검색어 벡터와 도서 벡터를 검색해 도서정보를 사용자에게
        반환합니다.
      </div>
      <div className="relative">
        <Image
          src="/portfolio/libsearch/flow.webp"
          alt="flow"
          width={1800}
          height={900}
          className="object-contain"
        />
      </div>
      <video width="full" height="full" controls autoPlay loop muted>
        <source
          src={"/portfolio/libsearch/vector-search.mp4"}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
function GlobalStatus() {
  return (
    <div className="space-y-6">
      <h1 className="sub_title">Zustand를 활용한 전역상태 관리</h1>
      <div>
        서비스의 모든 기능은 사용자가 자주 방문하는 도서관을 중심으로
        제공됩니다. 이러한 특성상 도서관 목록을 전역적으로 관리할 필요가
        있었습니다. React 기반으로 서비스를 개발했기 때문에 다양한 상태관리
        라이브러리를 선택할 수 있었습니다.
      </div>
      <div>
        여러 옵션을 검토한 결과, 구현하고자 하는 기능에는 Jotai나 Recoil과 같은
        Atomic 패턴의 라이브러리보다 스토어 기반의 라이브러리가 더 적합하다고
        판단했습니다. 따라서 간결한 API와 높은 성능을 제공하는 Zustand를
        선택하여 도서관 목록과 관련 상태를 효율적으로 관리할 수 있었습니다.
      </div>
      <div className="relative">
        <Image
          src="/portfolio/libsearch/global-status.webp"
          alt="flow"
          width={1800}
          height={900}
          className="object-contain"
        />
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="space-y-4">
      <h1 className="sub_title">사용 기술</h1>
      <div className="flex gap-3 capitalize">
        <React />
        <Typescript />
        <ChakraUI />
        <Zustand />
        <Go />
        <Postgresql />
      </div>
    </div>
  );
}
