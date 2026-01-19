import HeroSection from "./_components/_sections/hero-section";
import FeaturedCategoriesSection from "./_components/_sections/featured-categories-section";
import BestSellersSection from "./_components/_sections/best-sellers-section";
import PromoSection from "./_components/_sections/promo-section";
import HowItWorksSection from "./_components/_sections/how-it-works-section";
import NewsletterSection from "./_components/_sections/newletter-section";

export const metadata = {
  title: "StorePro - Modern E-Commerce",
  description: "Premium products at unbeatable prices",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCategoriesSection />
      <BestSellersSection />
      <PromoSection />
      <HowItWorksSection />
      <NewsletterSection />
    </>
  );
}
