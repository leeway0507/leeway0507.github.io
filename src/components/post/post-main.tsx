"use client";
import markdownStyles from "./markdown-styles.module.css";
import { useEffect } from "react";
import mediumZoom from "medium-zoom";
import Giscus from "@giscus/react";
import { Toc } from "@/lib/markdownToHtml";

type Props = {
  content: string;
  toc: Toc
};

export function PostBody({ content, toc }: Props) {
  useEffect(() => {
    const zoom = mediumZoom(".markdown-body img");

    return () => {
      zoom.detach();
    };
  }, []);

  const TableOfContents = () => (
    <div>
      <div className="text-2xl font-semibold">목차</div>
      <nav id="toc" className="p-2">
        <ul>
          {toc.map((item) => {
            const x = (item.depth - 1) * 14
            return <li key={item.id} style={{ marginLeft: `${x}px`, }}>
              <a href={`#${item.id}`} className="text-link">{item.numbering}</a>
              {item.title}
            </li>
          }
          )}
        </ul>
      </nav>
    </div>
  );

  return (
    <main className=" 2xl:max-w-3xl mx-auto markdown-body px-2.5">
      <TableOfContents />
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="pt-8">
        <Giscus
          id="comments"
          repo="leeway0507/leeway0507.github.io"
          repoId="R_kgDOIDaSkA"
          category="comments"
          categoryId="DIC_kwDOIDaSkM4CgqOT"
          mapping="pathname"
          term="Welcome to @giscus/react component!"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="dark"
          lang="en"
          loading="lazy"
        />
      </div>
    </main>
  );
}
