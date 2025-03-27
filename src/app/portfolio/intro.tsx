import { Nanum_Gothic } from "next/font/google";
const hanSan = Nanum_Gothic({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});
export default function Intro() {
  return (
    <div className="w-full max-w-4xl py-20 px-1 space-y-6 text-center">
      <h1
        className={`text-[26px] text-potext font-semibold ${hanSan.className}`}
      >
        안녕하세요, 소프트웨어 엔지니어 이양우 입니다.
      </h1>
      <h3 className="text-lg">사용자 중심의 서비스를 만들어 나갑니다.</h3>
    </div>
  );
}
