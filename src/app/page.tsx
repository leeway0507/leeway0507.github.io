import Nav from "@/components/common/nav";
import Footer from "@/components/common/footer";
import { PostCardGroup } from "@/components/post-card";
import { getAllPosts } from "@/lib/api";

export default async function Index({ params }: { params: { slug: string } }) {
  const allPosts = getAllPosts();
  const { slug } = params;
  const categories = allPosts.reduce((acc, post) => {
    post.category.forEach((category) => acc.add(category));
    return acc;
  }, new Set<string>());

  const filterName = categories.has(slug) ? slug : "all";

  const filteredPosts =
    filterName === "all"
      ? allPosts
      : allPosts.filter((v) => v.category.includes(filterName));

  return (
    <>
    <Nav />
    <div className="pt-[55px] px-2 mx-auto w-full grow">
    <div className="max-w-3xl 2xl:max-w-3xl mx-auto">
      <PostCardGroup params={filterName} posts={filteredPosts} />
    </div>
    </div>
    <Footer />
    </>
  );
}
