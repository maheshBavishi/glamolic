import { GetBlogDetails } from "@/graphql/graphql";
import { graphcms } from "@/graphql/graphQLClient";
import BlogDetails from "@/routes/blogDetails";
import React from "react";

export async function generateMetadata({ params }) {
  const variables = {
    filters: {
      slug: { eq: params?.slug },
    },
  };

  const BlogDetail = await graphcms?.request(GetBlogDetails, variables);
  const attributes = BlogDetail?.blog?.data[0]?.attributes;

  const keywords = attributes?.SEO?.keywords?.map((item) => item?.name)?.join(", ");

  const ogImage = attributes?.SEO?.Image?.data?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_CMS_IMAGE_URL}${attributes.SEO.Image.data.attributes.url}`
    : "";

  const seoData = {
    title: attributes?.SEO?.title || "",
    description: attributes?.SEO?.description || "",
    keywords: keywords || "",
    ogImage,
    url: `https://glamolic.com/blog/${params?.slug}`,
  };
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    authors: [{ name: "Glamolic AI" }],
    publisher: "Glamolic AI Team",
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      locale: "en_US",
      siteName: "Glamolic AI",
      type: "article",
      images: [
        {
          url: seoData.ogImage,
          alt: seoData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@GlamolicAI",
      site: "@GlamolicAI",
      title: seoData.title,
      description: seoData.description,
      images: [seoData.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: seoData.url,
    },
  };
}

async function page({ searchParams }) {
  const params = await searchParams;
  const GetBlogDetails_Variables = {
    filters: {
      slug: {
        eq: params?.slug,
      },
    },
    pagination: {
      limit: 50,
    },
  };
  const BlogDetail = await graphcms?.request(GetBlogDetails, GetBlogDetails_Variables);
  const faqSchema = BlogDetail?.blog?.data[0]?.attributes?.SEO?.faqSchema;
  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
      <div>
        <BlogDetails BlogDetail={BlogDetail?.blog?.data[0]} />
      </div>
    </>
  );
}
export default page;
