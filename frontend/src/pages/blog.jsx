import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogBreadcrumb from "@/components/breadcrumb/blog-breadcrumb";
import BlogPostboxArea from "@/components/blog/blog-postox/blog-postbox-area";
import { PAGE_SEO } from "@/lib/seo";

const BlogPostBoxPage = () => {
  return (
    <Wrapper>
      <SEO {...PAGE_SEO.blog} />
      <HeaderTwo style_2={true} />
      <BlogBreadcrumb/>
      <BlogPostboxArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogPostBoxPage;
