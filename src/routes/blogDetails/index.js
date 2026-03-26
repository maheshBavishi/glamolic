import React from "react";
import BlogInformation from "./blogInformation";
import TableOfContentDetails from "./tableOfContentDetails";
export default function BlogDetails({ BlogDetail }) {
  return (
    <div>
      <BlogInformation BlogDetail={BlogDetail} />
      <TableOfContentDetails BlogDetail={BlogDetail} />
    </div>
  );
}
