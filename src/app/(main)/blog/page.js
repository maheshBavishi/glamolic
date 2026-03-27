import { GetAllBlogCategories, GetAllBlogs } from "@/graphql/graphql";
import { graphcms } from "@/graphql/graphQLClient";
import Blog from "@/routes/blog";
import { GET_SEO } from "@/utils/seo";
import React from "react";

export async function generateMetadata() {
  const seoData = await GET_SEO("blog");
  return {
    title: seoData.title,
    description: seoData.description,
    // keywords: seoData.keywords,
    authors: [{ name: "Glamolic AI" }],
    publisher: "Glamolic AI Team",
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      locale: "en_US",
      siteName: "Glamolic AI",
      type: "website",
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

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const parsedPage = Number(params?.page);
  const currentPage = parsedPage > 0 ? parsedPage : 1;
  const category = params?.category;
  const filters = {
    ...(category && {
      blog_categories: {
        slug: {
          in: [category],
        },
      },
    }),
    ...(params?.search && {
      title: {
        contains: params.search,
      },
    }),
  };
  const variables = {
    pagination: {
      page: currentPage,
      pageSize: 9,
    },
    sort: ["createdAt:desc"],
    ...(Object.keys(filters).length > 0 && { filters }),
  };

  const Data = await graphcms.request(GetAllBlogs, variables);
  const CategoriesData = await graphcms.request(GetAllBlogCategories, {
    pagination: {
      page: 1,
      pageSize: 100,
    },
  });
  return (
    <div>
      <Blog Blogs={Data?.blog?.data} paginationData={Data?.blog?.meta?.pagination} Categories={CategoriesData?.blogCategories?.data} />
    </div>
  );
}
