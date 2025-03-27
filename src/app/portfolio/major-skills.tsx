import {
  Nextjs,
  React,
  Typescript,
  Zustand,
  Go,
  Python,
  Node,
  Aws,
  CloudFlare,
  FastAPI,
  Tailwind,
  ChakraUI,
  Jest,
  Docker,
} from "./skill";
import { PiBrowsersFill } from "react-icons/pi";
import { TbMessageLanguage } from "react-icons/tb";
import { CiServer } from "react-icons/ci";
import { IoMdCloudy } from "react-icons/io";

export default function Skills() {
  return (
    <div>
      <div className="text-xl pb-4 font-semibold">Skills</div>
      <hr className="border-0 h-[0.5px] bg-gray-400/50 mb-8" />
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex gap-2 items-center basis-1/6">
            <TbMessageLanguage size={20} />
            Language
          </div>
          <Typescript />
          <Go />
          <Python />
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center basis-1/6">
            <PiBrowsersFill size={20} />
            Frontnend
          </div>
          <Nextjs />
          <React />
          <Zustand />
          <Tailwind />
          <ChakraUI />
          <Jest />
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center basis-1/6">
            <CiServer size={20} />
            Backend
          </div>
          <Node />
          <FastAPI />
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center basis-1/6">
            <IoMdCloudy size={20} />
            DevOps
          </div>
          <Docker />
          <Aws />
          <CloudFlare />
        </div>
      </div>
    </div>
  );
}
