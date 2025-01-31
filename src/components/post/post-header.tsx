import PostInfo from "../post-info";

type Props = {
  title: string;
  date: string;
  category: string[];
};

export function PostHeader({ title, date, category }: Props) {
  return (
    <header className="mx-auto py-8 border-b">
      <PostInfo date={date} category={category} />
      <h1 className="text-2xl md:text-3xl font-semibold text-nav">{title}</h1>
    </header>
  );
}
