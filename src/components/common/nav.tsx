import { FaGithub } from "react-icons/fa6";

import Link from "next/link";
const Nav = () => {
  return (
    <div className="absolute left-0 top-0 h-[55px] bg-nav w-full flex items-center z-50">
      <div className="w-full mx-auto flex justify-between items-center max-w-2xl 2xl:max-w-3xl text-white px-4">
        <Link href={"/"} className="w-full font-medium md:text-lg ">
          데이터를 종합해 정보를 만듭니다.
        </Link>
        <div className="text-sm md:text-base text-right space-x-4 md:space-x-8 font-medium  whitespace-nowrap">
          <Link
            href={"https://github.com/leeway0507"}
            target="_blank"
            rel="noreferer"
          >
            <FaGithub size={"24px"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;
