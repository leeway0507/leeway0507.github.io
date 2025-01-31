import Link from "next/link";
import PostInfo from "../post-info";

interface PostCardProps {
  title: string;
  thumbnail?: string;
  date: string;
  desc?: string;
  category: string[];
  slug: string;
}

export function PostCard(props: PostCardProps) {
  const { slug, category, date, title } = props;
  return (
    <Link href={`/blog/${slug}`} className="group py-4 px-10">
      <PostInfo category={category} date={date} />
      <h1 className="text-lg md:text-xl font-medium group-hover:underline mb-3 line-clamp-1">
        {title}
      </h1>
    </Link>
  );
}
