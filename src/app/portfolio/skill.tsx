import Image from "next/image";
import {
  SiReacttable,
  SiReact,
  SiTailwindcss,
  SiChakraui,
} from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { FaGolang } from "react-icons/fa6";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaCloudflare } from "react-icons/fa";
import { BiLogoTypescript } from "react-icons/bi";
import { SiMysql } from "react-icons/si";
import { FaNode, FaPython, FaAws } from "react-icons/fa";
import { SiFastapi } from "react-icons/si";
import { GiJesterHat } from "react-icons/gi";

import { SiDocker } from "react-icons/si";

function Card({ name, icon }: { name: string; icon: React.ReactElement }) {
  return (
    <div className="flex gap-1 flex items-center text-[0.8125rem] text-sm  border rounded-xl px-2 py-0.5 bg-white text-black">
      <div>{icon}</div>
      <div>{name}</div>
    </div>
  );
}

function Typescript() {
  return <Card name="Typescript" icon={<BiLogoTypescript size={20} />} />;
}
function React() {
  return <Card name="React" icon={<SiReact size={20} />} />;
}
function ReactTable() {
  return <Card name="ReactTable" icon={<SiReacttable />} />;
}
function Nextjs() {
  return <Card name="Next.js" icon={<RiNextjsFill size={20} />} />;
}
function Go() {
  return <Card name="Go" icon={<FaGolang size={20} />} />;
}
function Tailwind() {
  return <Card name="Tailwind" icon={<SiTailwindcss size={20} />} />;
}
function ChakraUI() {
  return <Card name="Chakra-UI" icon={<SiChakraui size={16} />} />;
}
function Zustand() {
  return (
    <Card
      name="Zustand"
      icon={
        <Image
          src={"/skill-logo/zustand.svg"}
          alt="zustand"
          width={20}
          height={20}
        />
      }
    />
  );
}
function Playwright() {
  return (
    <Card
      name="Playwright"
      icon={
        <Image
          src={"/skill-logo/playwright.svg"}
          alt="playwright"
          width={20}
          height={20}
        />
      }
    />
  );
}
function Postgresql() {
  return <Card name="Postgres" icon={<BiLogoPostgresql size={20} />} />;
}
function CloudFlare() {
  return <Card name="CloudFlare" icon={<FaCloudflare size={20} />} />;
}
function Mysql() {
  return <Card name="Mysql" icon={<SiMysql size={20} />} />;
}
function Node() {
  return <Card name="Node.js" icon={<FaNode size={20} />} />;
}
function Python() {
  return <Card name="Python" icon={<FaPython size={20} />} />;
}
function FastAPI() {
  return <Card name="FastAPI" icon={<SiFastapi size={16} />} />;
}
function Aws() {
  return <Card name="Aws" icon={<FaAws size={20} />} />;
}
function Jest() {
  return <Card name="Jest" icon={<GiJesterHat size={20} />} />;
}
function Docker() {
  return <Card name="Docker" icon={<SiDocker size={20} />} />;
}

export {
  Typescript,
  React,
  ReactTable,
  Nextjs,
  Go,
  Tailwind,
  ChakraUI,
  Zustand,
  Postgresql,
  Mysql,
  CloudFlare,
  Node,
  Python,
  Aws,
  FastAPI,
  Jest,
  Docker,
  Playwright,
};
