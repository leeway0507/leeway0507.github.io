import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function Nav() {
  return (
    <div
      className={`mx-auto w-full max-w-4xl min-h-[70px] border-b-[0.5px] border-gray-400/50 flex justify-between items-center ${spaceGrotesk.className} font-medium`}
    >
      <Link href={"/portfolio"} className="text-lg">
        Leeway
      </Link>
      <div className="flex gap-4 text-sm">
        <Link href={"/"} target="_blank">
          Blog
        </Link>
        <Link href={"https://github.com/leeway0507"} target="_blank">
          Github
        </Link>
      </div>
    </div>
  );
}
