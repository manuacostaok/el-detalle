import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { NightSky } from "@/components/marketing/night-sky";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NightSky />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
