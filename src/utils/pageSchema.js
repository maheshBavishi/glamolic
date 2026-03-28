"use client";
import { GetSEOData } from "@/graphql/graphql";
import { graphcms } from "@/graphql/graphQLClient";
import { usePathname } from "next/navigation";

export async function GET_PAGE_SCHEMA() {
  const path = usePathname().replace(/^\//, "");
  try {
    if (!pathname) return null;

    const path = pathname.replace(/^\/+/, "");

    const variables = {
      filters: {
        Slug: {
          eq: path,
        },
      },
    };

    const fetchSEOData = await graphcms?.request(GetSEOData, variables);
    const seoEntry = fetchSEOData?.glamolicAiSeos?.data?.[0]?.attributes;

    const schemas = [
      { key: "faqSchema", data: seoEntry?.FAQ_Schema },
      { key: "breadcrumbSchema", data: seoEntry?.BreadcrumbList_Schema },
      { key: "organizationSchema", data: seoEntry?.Organization_Schema },
    ].filter((item) => item.data);

    if (!schemas.length) return null;

    return schemas.map((item) => (
      <script
        key={item.key}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(item.data),
        }}
      />
    ));
  } catch (error) {
    console.error("Schema error:", error);
    return null;
  }
}
