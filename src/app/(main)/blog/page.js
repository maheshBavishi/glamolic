import { GetAllBlogCategories, GetAllBlogs } from "@/graphql/graphql";
import { graphcms } from "@/graphql/graphQLClient";
import Blog from "@/routes/blog";
import React from "react";

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
