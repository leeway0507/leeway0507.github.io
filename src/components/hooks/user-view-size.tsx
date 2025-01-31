import { useState, useEffect } from "react";

type View = "mobile" | "general" | undefined;
const mobileSize = 640;

const detectView = () => {
  if (typeof window !== "undefined") {
    const { innerWidth } = window;
    return innerWidth < mobileSize ? "mobile" : "general";
  }
  return undefined;
};

const useMobile = () => {
  const [view, setView] = useState<View>();

  // 사이즈 변화 체크(반응형)
  useEffect(() => {
    setView(detectView());

    const handleResize = () => {
      const newView = detectView();
      if (view !== newView) setView(newView);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return view;
};

export default useMobile;
