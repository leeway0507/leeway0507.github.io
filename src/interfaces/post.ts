export type Post = {
  slug: string;
  title: string;
  date: string;
  thumbnail?: string;
  desc?: string;
  ogImage?: {
    url: string;
  };
  content: string;
  preview?: boolean;
  category: string[];
  publish: boolean;
};
