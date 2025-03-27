import Nav from "./nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-6">
      <Nav />
      <div className="mx-auto w-full grow h-full">{children}</div>
    </div>
  );
}
