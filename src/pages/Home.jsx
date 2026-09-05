import HomeNav from "@/components/home/HomeNav";
import Hero from "@/components/home/Hero";
import ImpactEditorial from "@/components/home/ImpactEditorial";
import WhyBipolarAustralia from "@/components/home/WhyBipolarAustralia";
import Partnerships from "@/components/home/Partnerships";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HomeNav />
      <Hero />
      <ImpactEditorial />
      <WhyBipolarAustralia />
      <Partnerships />
      <FinalCTA />
    </div>
  );
}