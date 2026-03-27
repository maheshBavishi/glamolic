import { GetSEOData } from "@/graphql/graphql";
import { graphcms } from "@/graphql/graphQLClient";

export async function GET_SEO(slug) {
  const variables = {
    filters: {
      Slug: {
        eq: slug,
      },
    },
  };

  const fetchSEOData = await graphcms?.request(GetSEOData, variables);
  const seoEntry = fetchSEOData?.glamolicAiSeos?.data?.[0]?.attributes;
  const imageUrl = seoEntry?.Image?.data?.attributes?.url;
  const ogImage = imageUrl ? `${process.env.NEXT_PUBLIC_CMS_IMAGE_URL}${imageUrl}` : "";
  return {
    title: seoEntry?.Title || "",
    description: seoEntry?.Description || "",
    ogImage,
    url: seoEntry?.URL || slug || "",
  };
}
