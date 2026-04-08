import { GetSEOData } from "@/graphql/graphql";
import { graphcms } from "@/graphql/graphQLClient";

export async function GET_SEO(slug) {
  try {
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

    const FAQ_Schema = seoEntry?.FAQ_Schema;
    const Organization_Schema = seoEntry?.Organization_Schema;
    const BreadcrumbList_Schema = seoEntry?.BreadcrumbList_Schema;

    return {
      title: seoEntry?.Title || "",
      description: seoEntry?.Description || "",
      ogImage,
      url: seoEntry?.URL || slug || "",
      FAQ_Schema: FAQ_Schema || "",
      Organization_Schema: Organization_Schema || "",
      BreadcrumbList_Schema: BreadcrumbList_Schema || "",
    };
  } catch (error) {
    console.error("GET_SEO error:", error);
    return {
      title: "",
      description: "",
      ogImage: "",
      url: slug || "",
      FAQ_Schema: "",
      Organization_Schema: "",
      BreadcrumbList_Schema: "",
    };
  }
}
