import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import Transition from "./motion";
import Intro from "./intro";
import Skills from "./major-skills";
type Portfolio = {
  name: string;
  date: string;
  description: string;
  tag?: string[];
  src: string;
};

const WORK_LIST: Portfolio[] = [
  {
    name: "captured table",
    date: "24/8 ~ 25/2",
    src: "portfolio/captured-table.svg",
    description:
      "제품 가격 외 배송비, 환율, 관세를 반영한 최종 구매가를 제공한 가격비교 서비스 개발 ",
    tag: ["Next.js", "React-Table", "Tailwind", "Go", "Mysql"],
  },
  {
    name: "captured",
    date: "22/10 ~ 24/7",
    src: "portfolio/captured.svg",
    description:
      "해외 의류 편집샵의 제품 재고와 가격 데이터를 분석하여 이를 기반으로 직구 편집샵 운영",
    tag: ["Next.js", "Tailwind", "ContextAPI", "Python", "Go", "Mysql"],
  },
];
const SIDE_PROJECT_LIST: Portfolio[] = [
  {
    name: "arfin yoon",
    date: "25/2 ~ 25/3",
    src: "portfolio/arfinyoon.svg",
    description: "포토그래퍼 윤치호의 포트폴리오",
    tag: ["Next.js", "Tailwind", "Framer-Motion", "CloudFlare"],
  },
  {
    name: "libsearch",
    date: "25/1",
    src: "portfolio/libsearch.svg",
    description:
      "서울시 산하 200여 도서관 보유 장서 900만 권에 대한 벡터 검색과 실시간 대출 현황 제공",
    tag: ["React", "Zustand", "Chakra-UI", "Go"],
  },
];
export default async function Portfolio() {
  return (
    <div className={`mx-auto max-w-4xl space-y-24 ${spaceGrotesk.className}`}>
      <Transition>
        <Intro />
        <Skills />
      </Transition>
      <Transition>
        <div className="text-xl pb-4 font-semibold">Work</div>
        <hr className="border-0 h-[0.5px] bg-gray-400/50 mb-8" />
        <CardGroup portfolios={WORK_LIST} />
      </Transition>
      <Transition>
        <div className="text-xl pb-4 font-semibold">Side Project</div>
        <hr className="border-0 h-[0.5px] bg-gray-400/50 mb-8" />
        <CardGroup portfolios={SIDE_PROJECT_LIST} />
      </Transition>
    </div>
  );
}

function CardGroup({ portfolios }: { portfolios: Portfolio[] }) {
  return (
    <Transition className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
      {portfolios.map((p) => (
        <Card key={p.name} portfolio={p} />
      ))}
    </Transition>
  );
}

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

function Card({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link
      className="relative aspect-[1.6/1] rounded-sm overflow-hidden flex items-center justify-center pointer-cursor bg-pocard-bg"
      href={"portfolio/" + portfolio.name.replace(" ", "-")}
    >
      <div className="relative w-[100px] aspect-square ">
        <Image
          src={portfolio.src}
          alt={portfolio.name}
          fill
          className={"object-contain"}
        />
      </div>
      <div className="bottom-4 left-4 absolute w-full text-black backdrop-blur py-1">
        <div className="w-full h-full relative">
          <div className={`text-[11px] `}>{portfolio.date}</div>
          <div className={`text-[15px] capitalize font-semibold`}>
            {portfolio.name}
          </div>
        </div>
      </div>
    </Link>
  );
}
