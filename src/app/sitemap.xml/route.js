import { graphcms } from "@/graphql/graphQLClient";
import { GetAllBlogs } from "@/graphql/graphql";
import { getServerSideSitemap } from "next-sitemap";

export async function GET() {
  const variables = {
    pagination: {
      limit: 1000,
    },
    sort: ["publishedAt:desc"],
  };
  const Data = await graphcms?.request(GetAllBlogs, variables);
  const BlogsPath = Data?.blog?.data?.map((Data) => `/blog/${Data?.attributes?.slug}`);
  const IndexPath = [
    "/",
    "/blog",
    "/contact-us",
    "/about-us",
    "/privacy-policy",
    "/cookie-policy",
    "/terms-and-conditions",
    ...BlogsPath,
  ];
  const fields = IndexPath?.map((Data) => ({
    loc: `https://glamolic.com${Data}`?.trim(),
    lastmod: new Date().toISOString(),
    changefreq: "daily",
    priority: 1,
  }));
  return getServerSideSitemap(fields, {
    "Content-Type": "text/xml, application/xml",
  });
}
