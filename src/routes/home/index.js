import CreatePerfectPhotos from "./createPerfectPhotos";
import FaqSection from "./faqSection";
import FeaturedArticle from "./featuredArticle";
import Herobanner from "./herobanner";
import HowItWorks from "./howItWorks";
import PartnerLogo from "./partnerLogo";
import ReadytoTransform from "./readytoTransform";
import SimpleAffordable from "./simpleAffordable";
import TrustedByBrands from "./trustedByBrands";

export default function HomePage() {
  return (
    <div>
      <Herobanner />
      <PartnerLogo />
      <CreatePerfectPhotos />
      <HowItWorks />
      <SimpleAffordable />
      <TrustedByBrands />
      <FaqSection />
      <FeaturedArticle />
      <ReadytoTransform />
    </div>
  );
}
