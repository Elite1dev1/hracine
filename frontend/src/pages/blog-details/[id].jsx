import React from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import BlogDetailsArea from "@/components/blog-details/blog-details-area";
import { useGetSingleBlogQuery } from "@/redux/features/blogApi";
import { transformBlog } from "@/utils/blogTransform";
import { ClipLoader } from 'react-spinners';
import { useRouter } from "next/router";

const BlogDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, error } = useGetSingleBlogQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <Wrapper>
        <SEO pageTitle="Blog Details" />
        <HeaderTwo style_2={true} />
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <ClipLoader size={50} color="#3498db" />
        </div>
        <Footer primary_style={true} />
      </Wrapper>
    );
  }

  if (error || !data?.data) {
    return (
      <Wrapper>
        <SEO pageTitle="Blog Details" />
        <HeaderTwo style_2={true} />
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#e74c3c' }}>
          <p>Blog not found or error loading blog.</p>
        </div>
        <Footer primary_style={true} />
      </Wrapper>
    );
  }

  const blogItem = transformBlog(data.data);

  // Get the current URL for Open Graph
  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog-details/${blogItem?.slug || id}`
    : '';

  return (
    <Wrapper>
      <SEO 
        pageTitle={blogItem?.title || "Blog Details"}
        metaTitle={blogItem?.metaTitle}
        metaDescription={blogItem?.metaDescription}
        keywords={blogItem?.keywords}
        image={blogItem?.img}
        url={currentUrl}
      />
      <HeaderTwo style_2={true} />
      <BlogDetailsArea blog={blogItem} />
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default BlogDetailsPage;

