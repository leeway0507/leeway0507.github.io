import Nav from "./nav";
import { Noto_Sans_KR } from "next/font/google";
const notoSans = Noto_Sans_KR({
  subsets: ["cyrillic"],
  display: "swap",
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`px-6 ${notoSans.className}`}>
      <Nav />
      <div className="mx-auto w-full grow h-full">{children}</div>
    </div>
  );
}
