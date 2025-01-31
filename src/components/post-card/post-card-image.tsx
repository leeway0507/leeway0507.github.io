import cn from "classnames";
import Image from "next/image";

type Props = {
  title: string;
  src: string;
  slug?: string;
};

export const CoverImage = ({ title, src, slug }: Props) => {
  return (
    <div className="sm:mx-0">
      <Image
        src={src}
        alt={`Cover Image for ${title}`}
        className={cn("w-full scale-[80%]", "group-hover:scale-[85%]", {
          "transition-all duration-500": slug,
        })}
        width={1300}
        height={630}
      />
    </div>
  );
};
