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
          제작하였습니다. 이 과정에서 대량의 고해상도 이미지를 효율적으로
          처리하는 방법을 익혔습니다.
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
        <div className="basis-1/3 relative grow bg-red-200">
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
            <div>
              Gallery 실행 시 대량 이미지 로드에 의한 부하 발생 및 페이지 다운
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-lg">원인분석</div>
            <ul className="w-full space-y-4 list-disc ps-4">
              <li>
                서버에서만 문제 발생하는 것으로 보아 Cloudflare 서비스 정책이
                원인으로 추정{" "}
                <span className="text-sm ps-2 text-gray-400">
                  * 무료 사용시 최대 1초의 컴퓨팅 연산만 허용
                </span>
              </li>
              <li>
                기존 이미지 최적화 시 용량에 대한 최적화만 고려하여, 고해상도
                (6000x8000) 이미지 사용중
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-lg">문제해결</div>
            <ul className="w-full space-y-4 list-disc ps-4">
              <li>이미지를 D2 스토리지에 업로드하여 서버 처리시간 절감</li>
              <li>이미지 최적화 시 해상도 최적화 단계 추가</li>
            </ul>
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
