import Navbar from "@/components/public/core/navbar";
import Cta from "@/components/public/landing/cta";
import Faq from "@/components/public/landing/faq";
import Features from "@/components/public/landing/features";
import Footer from "@/components/public/landing/footer";
import Hero from "@/components/public/landing/hero";
import HowItWorks from "@/components/public/landing/how-it-works";
import Pricing from "@/components/public/landing/pricing";
import { getPlans } from "@/utils/plans";
import { getLocale } from "next-intl/server";

const Home = async () => {
  const locale = await getLocale();
  const plans = await getPlans(locale);

  return (
    <div className="min-h-dvh flex flex-col relative">
      <Navbar />
      <div className="relative flex flex-col justify-center items-center px-0 flex-1 gap-14">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing plans={plans} />
        <Faq />
        <Cta />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
