import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSanitize from 'rehype-sanitize';
import remarkMath from 'remark-math';

import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeKatex,{ strict: false })
    .use(rehypePrettyCode, {
      theme:"github-dark-dimmed"
    })
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
