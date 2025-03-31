import Image from "next/image";
import "../portfolio.module.css";
import Transition from "../motion";
import Back from "../back";
import { Aws, Node, Go, Nextjs, Python, Tailwind, Playwright } from "../skill";
import Link from "next/link";

export default async function CapturedTable() {
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
    <Transition className="space-y-8">
      <Back />
      <div className="relative flex justify-center py-6">
        <Image
          src="/portfolio/captured-table.svg"
          alt="flow"
          width={200}
          height={100}
          className="object-contain"
        />
      </div>
      <div className="space-y-6 mx-auto">
        <div className="tracking-tight">
          CAPTURED TABLE은 해외 프리미엄 편집샵 제품의 실제 구매 비용을 투명하게
          제공하는 서비스입니다.
        </div>
        <div>
          배송비, 관부가세, 환율을 모두 반영한 최종 구매가를 제공하여 소비자가
          합리적인 가격 비교를 할 수 있도록 돕습니다. 30여 개의 해외 편집샵에서
          직접 구매한 경험을 통해, 각 편집샵마다 다른 배송 정책과 서비스가 고객
          경험에 큰 영향을 미친다는 것을 발견하였으며, 이러한 실제 경험을
          바탕으로 해외 직구를 더 투명하고 편리하게 이용할 수 있는 서비스를
          개발하였습니다.
        </div>
        <Link
          href={"https://captured-vercel-yangoos-projects.vercel.app/table"}
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
      <video width="full" height="full" controls autoPlay muted>
        <source src={"/portfolio/captured-table/intro.mp4"} type="video/mp4" />
      </video>
    </Transition>
  );
}

function Content() {
  return (
    <Transition delay={0.5} className="content">
      <Service />
      <SelectShop />
      <Scrap />
      <Skills />
      <Back />
    </Transition>
  );
}

function Service() {
  return (
    <div className="mx-auto space-y-8">
      <div className="mx-auto space-y-8">
        <h1 className="sub_title">투명한 제품 구매가</h1>
        <div>
          해외 직구의 최종 구매가는 단순 가격 표시 이상으로, 복잡한 계산 과정을
          거쳐야 정확히 산출될 수 있습니다. 편집샵 별 상이한 정책에 따른 제품
          가격 및 배송 비용 산출, 제품 특성에 일치하는 관세율을 부과하고, 실시간
          환율 API 연동하여 150불 이상의 제품을 찾아 관세를 적용해야 하는 등
          다양한 경우를 고려해야 합니다.
        </div>
        <div>
          이러한 복잡한 요소들을 찾아 정리하고 기술적으로 정의하여, 소비자가
          한번에 이해할 수 있는 투명한 가격 정보를 생산하였습니다. 사용자는
          복잡한 계산 과정 없이 지불해야 할 최종 금액을 바탕으로 제품 간 가격을
          비교하여 해외 직구의 불확실성을 줄이고 합리적인 구매 결정을 내릴 수
          있습니다.
        </div>
      </div>
      <video width="full" height="full" controls autoPlay loop muted>
        <source
          src={"/portfolio/captured-table/service.mp4"}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
function SelectShop() {
  return (
    <div className="mx-auto space-y-8">
      <div className="mx-auto space-y-8">
        <h1 className="sub_title">편집샵 정책 데이터</h1>
        <div>
          20여 개의 해외 프리미엄 편집샵에서의 직구 경험을 바탕으로, 편집샵별
          구매가에 영향을 미치는 다양한 서비스 정책을 데이터로 정의하고 이를
          수집하였습니다. 각 편집샵의 세금 정책, 배송비 체계, 관부가세 처리
          방식, 할인율 등은 최종 구매가를 계산하는 변수로 활용되었습니다.
        </div>
      </div>
      <div className="relative">
        <Image
          src="/portfolio/captured-table/select-shop.webp"
          alt="select-shop"
          width={1800}
          height={900}
          className="object-contain"
        />
      </div>
    </div>
  );
}
function Scrap() {
  return (
    <div className="mx-auto space-y-8">
      <h1 className="sub_title">데이터 수집 및 적재</h1>
      <div>
        프리미엄 편집샵의 제품 데이터를 수집하기 위한 프로세스를 구축했습니다.
        데이터 수집과 적재 과정은 기능별로 나누어 개발되었으며, 각 기능에 가장
        적합한 언어를 사용했습니다. 전체 프로세스는 Go를 중심으로 관리되며,
        스케줄링과 확장성을 고려해 CLI 기반으로 실행되도록 설계했습니다.
      </div>
      <div>
        데이터 수집 단계는 Playwright를 활용한 비동기 스크래핑을 구현하여
        효율적으로 정보를 수집하였습니다. 전처리 과정은 키워드 추출, 이미지 배경
        제거 등 AI 모델을 적용하기 위해 Python으로 일부 개발되었습니다. 그 외
        추가적인 데이터 전처리, 매핑, 데이터베이스 적재 작업은 백엔드에 이미
        구현된 기능을 활용하기 위해 Go 언어를 사용했습니다.
      </div>
      <div className="relative">
        <Image
          src="/portfolio/captured-table/data-scrap.webp"
          alt="select-shop"
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
        <Nextjs />
        <Tailwind />
        <Playwright />
        <Node />
        <Python />
        <Go />
        <Aws />
      </div>
    </div>
  );
}
