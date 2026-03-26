import { GetBlogDetails } from "@/graphql/graphql";
import { graphcms } from "@/graphql/graphQLClient";
import BlogDetails from "@/routes/blogDetails";
import React from "react";

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
  return (
    <div>
      <BlogDetails BlogDetail={BlogDetail?.blog?.data[0]} />
    </div>
  );
}

export default page;
