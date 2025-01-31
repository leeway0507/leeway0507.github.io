"use client";
import markdownStyles from "./markdown-styles.module.css";
import { useEffect } from "react";
import mediumZoom from "medium-zoom";
import Giscus from "@giscus/react";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  useEffect(() => {
    const zoom = mediumZoom(".markdown-body img");

    return () => {
      zoom.detach();
    };
  }, []);

  return (
    <main className=" 2xl:max-w-3xl mx-auto markdown-body">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Giscus
        id="comments"
        repo="yangoos57/yangoos57.github.io"
        repoId="R_kgDOIDaSkA"
        category="comments"
        categoryId="DIC_kwDOIDaSkM4CgqOT"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </main>
  );
}
