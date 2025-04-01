import Image from "next/image";
import "../portfolio.module.css";
import Transition from "../motion";
import Back from "../back";
import { Nextjs, Typescript, Tailwind, CloudFlare } from "../skill";
import Link from "next/link";
import EmblaCarousel, { CarouselImage } from "@/components/carousel/carousel";

export default async function Page() {
  return (
    <div className="page">
      <Intro />
      <Summary />
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
          src="/portfolio/arfinyoon.svg"
          color="white"
          alt="flow"
          width={200}
          height={100}
          className="object-contain bg-white"
        />
      </div>
      <div className="space-y-6 mx-auto">
        <div>
          포토그래퍼 윤치호의 포트폴리오를 Next.js의 SSG를 활용해
          제작하였습니다. 이 과정에서 대량의 고해상도 이미지로 인한 메모리 초과
          문제를 분석하고, sharp.js를 활용해 이미지 최적화를 구현하였습니다.
        </div>
      </div>
      <Link
        href={"https://arfinyoon.com"}
        className="font-semibolds underline block text-gray-400"
        target="_blank"
      >
        사이트로 이동하기
      </Link>
    </Transition>
  );
}
function Summary() {
  return (
    <Transition className="space-y-8" delay={0.3}>
      <EmblaCarousel>
        <CarouselImage
          src={"/portfolio/arfin-yoon/main.webp"}
          alt={"main"}
          fill
        />
        <CarouselImage
          src={"/portfolio/arfin-yoon/gallery.webp"}
          alt={"main"}
          fill
        />
      </EmblaCarousel>
    </Transition>
  );
}

function Content() {
  return (
    <Transition delay={0.5} className="content">
      <ProblemSolving />
      <Skills />
      <Back />
    </Transition>
  );
}
function ProblemSolving() {
  return (
    <div className="space-y-8">
      <h1 className="sub_title">대량의 고해상도 이미지 처리</h1>
      <div className="flex gap-8 px-2">
        <div className="basis-1/3 relative grow">
          <video width="full" height="full" controls autoPlay loop>
            <source
              src={"/portfolio/arfin-yoon/gallery-error.mp4"}
              type="video/mp4"
            />
          </video>
        </div>
        <div className="basis-2/3 space-y-6">
          <div className="space-y-2">
            <div className="text-lg">문제정의</div>
            <div>Gallery 기능 사용 시 대량 이미지 로드에 의한 페이지 다운</div>
          </div>
          <div className="space-y-2">
            <div className="text-lg">원인분석</div>
            <ul className="w-full space-y-4 list-disc ps-4">
              <li>
                이미지 용량에 대한 최적화만 고려했기 때문에 고해상도 이미지로
                인한 메모리 초과 오류 발생
              </li>
              <li>
                브라우저의 이미지 렌더링 시 이미지 용량에 상관없이 실제
                해상도(Intrinsic size)로 디코딩 되어 이미지 하나 당 192MB의
                메모리를 사용하는 것을 확인, Gallery 사용 시 60개 이미지를
                동시에 로드하므로 약 11.5GB 메모리 필요
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-lg">문제해결</div>
            <div>
              sharp.js를 활용해 해상도와 용량 최적화 및 webp로 확장자 변경을
              자동화한 뒤 Cloud Storage에 업로드
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl">사용 기술</h1>
      <div className="flex gap-3 capitalize">
        <Nextjs />
        <Typescript />
        <Tailwind />
        <CloudFlare />
      </div>
    </div>
  );
}
