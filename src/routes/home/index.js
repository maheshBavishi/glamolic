import { graphcms } from "@/graphql/graphQLClient";
import CreatePerfectPhotos from "./createPerfectPhotos";
import FaqSection from "./faqSection";
import FeaturedArticle from "./featuredArticle";
import Herobanner from "./herobanner";
import HowItWorks from "./howItWorks";
import PartnerLogo from "./partnerLogo";
import ReadytoTransform from "./readytoTransform";
import SimpleAffordable from "./simpleAffordable";
import TrustedByBrands from "./trustedByBrands";
import { GetAllBlogs } from "@/graphql/graphql";

export default async function HomePage() {
  const variables = {
    pagination: {
      limit: 3,
    },
    sort: ["createdAt:desc"],
  };

  const Data = await graphcms.request(GetAllBlogs, variables);
  return (
    <div>
      <Herobanner />
      <PartnerLogo />
      <CreatePerfectPhotos />
      <HowItWorks />
      <SimpleAffordable />
      <TrustedByBrands />
      <FaqSection />
      <FeaturedArticle Blogs={Data?.blog?.data} />
      <ReadytoTransform />
    </div>
  );
}
