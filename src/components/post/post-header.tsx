import PostInfo from "../post-info";

type Props = {
  title: string;
  date: string;
  category: string[];
};

export function PostHeader({ title, date, category }: Props) {
  return (
    <header className="mx-auto py-8 px-4">
      <PostInfo date={date} category={category} />
      <h1 className="text-4xl font-semibold ">{title}</h1>
    </header>
  );
}
