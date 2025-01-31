import DateFormatter from "./date-formatter";

function PostInfo({ category, date }: { category: string[]; date: string }) {
  return (
    <div className="text-sm md:text-base flex gap-x-2 text-gray-500  pb-2">
      <div className="text-nav font-medium">
        {category.map((cat) => (
          <span className="capitalize me-2" key={cat}>
            {cat}
          </span>
        ))}
      </div>
      <DateFormatter dateString={date} />
    </div>
  );
}

export default PostInfo;
