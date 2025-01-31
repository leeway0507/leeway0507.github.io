import { PostCardGroup, PostFilter } from "@/components/post-card";
import { getAllPosts } from "@/lib/api";

export default async function Index({ params }: { params: { slug: string } }) {
  const allPosts = getAllPosts();
  const { slug } = params;
  const param = slug.replace("-", " ");
  const categories = allPosts.reduce((acc, post) => {
    post.category.forEach((category) => acc.add(category));
    return acc;
  }, new Set<string>());

  const filterName = categories.has(param as string) ? param : "all";
  const categoryArray = Array.from(categories);

  const filteredPosts =
    filterName === "all"
      ? allPosts
      : allPosts.filter((v) => v.category.includes(filterName as string));

  return (
    <main>
      <PostFilter params={filterName as string} categories={categoryArray} />
      <PostCardGroup params={filterName as string} posts={filteredPosts} />
    </main>
  );
}

export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const categories = allPosts.reduce((acc, post) => {
    post.category.forEach((category) => acc.add(category));
    return acc;
  }, new Set<string>());

  const cat = Array.from(categories);

  const categoryArray = ["all", ...cat];

  return categoryArray.map((s) => ({
    slug: s.replace(" ", "-"),
  }));
}
