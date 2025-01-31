import { Post } from "@/interfaces/post";
import { PostCard } from "./post-card";

type Props = {
  posts: Post[];
  params: string;
};

function SectionTitle({ cardCount }: { cardCount: number }) {
  return (
    <div className="pt-12 pb-4 text-xl font-semibold capitalize">
      <span>블로그 글</span>
      <span className="text-xl px-1">({cardCount})</span>
    </div>
  );
}

export function PostCardGroup({ posts, params }: Props) {
  const cardCount = posts.length;
  return (
    <section>
      <SectionTitle cardCount={cardCount} />
      <div className="py-2 space-y-8">
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>
    </section>
  );
}
