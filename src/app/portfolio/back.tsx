"use client";

import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Back() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex gap-2 items-center text-sm"
    >
      <IoMdArrowRoundBack /> 뒤로가기
    </button>
  );
}
