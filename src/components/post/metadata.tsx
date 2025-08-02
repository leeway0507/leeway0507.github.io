import { Post } from "@/interfaces/post";
import Script from "next/script";

export function JsonLDComponent({ post }: { post: Post }) {
  const { desc, title, date, category } = post;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: desc,
    datePublished: date,
    keywords: category,
    author: {
      "@type": "Person",
      name: process.env.NEXT_PUBLIC_AUTHOR,
    },
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_PAGE_TITLE,
      logo: {
        "@type": "ImageObject",
        url: new URL(
          "/favicon/favicon-32x32.png",
          process.env.NEXT_PUBLIC_URL
        ).toString(),
      },
    },
    image: new URL("og/og-default.png", process.env.NEXT_PUBLIC_URL).toString(),
  };
  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
