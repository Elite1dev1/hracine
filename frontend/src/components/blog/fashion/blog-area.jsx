import React, { useMemo } from 'react';
import Link from 'next/link';
// internal
import { TextShapeLine } from '@/svg';
import BlogItem from './blog-item';
import { useGetPublishedBlogsQuery } from '@/redux/features/blogApi';
import { transformBlogs } from '@/utils/blogTransform';

const BlogArea = () => {
  const { data } = useGetPublishedBlogsQuery();
  
  const blogs = useMemo(() => {
    if (!data?.data) return [];
    const transformedBlogs = transformBlogs(data.data);
    return transformedBlogs.filter(b => b.blog === 'fashion' || b.blog_type === 'fashion').slice(0, 3);
  }, [data]);
  return (
    <>
      <section className="tp-blog-area pt-110 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 mb-50 text-center">
                <span className="tp-section-title-pre-2">
                  Our Blog & News
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">Latest News & Articles</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {blogs.map(blog => (
              <div key={blog.id || blog._id} className="col-xl-4 col-lg-4 col-md-6">
                <BlogItem blog={blog} />
              </div>
            ))}
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-blog-more-2 mt-10 text-center">
                <Link href="/blog" className="tp-btn tp-btn-border tp-btn-border-sm">Discover More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogArea;