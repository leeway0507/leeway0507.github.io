import DateFormatter from "./date-formatter";

function PostInfo({ category, date }: { category: string[]; date: string }) {
  return (
    <div className="flex gap-x-2 text-neutral-400  pb-2">
      <div className="font-medium">
        {category.map((cat) => (
          <span className="capitalize me-2" key={cat}>
            {cat}
          </span>
        ))}
      </div>
      {/* <DateFormatter dateString={date} /> */}
    </div>
  );
}

export default PostInfo;
