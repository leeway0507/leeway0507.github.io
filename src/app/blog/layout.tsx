import Footer from "@/components/common/footer";
import Nav from "@/components/common/nav";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return <>
    <Nav />
    <div className="pt-[55px] px-2 mx-auto w-full grow">
      {children}
    </div>
    <Footer />
    </>
}