import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSanitize from 'rehype-sanitize';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { visit } from "unist-util-visit";
import rehypeSlug from 'rehype-slug'


export type Toc = { id: string; numbering: string, title: string, depth: number }[]

let headingCount = [0, 0, 0];
let toc: Toc = [];

// remark 플러그인: 헤딩 번호 추가 및 링크 삽입
const remarkHeadingNumbering = () => (tree: any) => {
  headingCount = [0, 0, 0];
  toc = [];

  visit(tree, "heading", (node) => {
    const depth = node.depth;
    if (depth > 3) return;

    headingCount[depth - 1]++;
    for (let i = depth; i < 3; i++) headingCount[i] = 0;

    const numbering = headingCount.slice(0, depth).join(".") + ". ";
    const textNode = node.children.find((child: any) => child.type === "text");
    const text = textNode ? textNode.value : "";
    const id = (numbering + text).toLowerCase().replace(/\s+/g, "-").replace(":", "").replaceAll(".", "");


    // TOC 저장
    toc.push({ id, numbering: numbering, title: text, depth });


    node.children.unshift({ type: 'link', url: "#toc", children: [{ type: "text", value: `${numbering}` }] })
  });
};


export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkHeadingNumbering)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeKatex, { strict: false })
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed"
    })
    .use(rehypeStringify)
    .process(markdown);
  return { content: result.toString(), toc };
}
