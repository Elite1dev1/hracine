import { useState, useMemo, useEffect } from "react";
// internal
import BlogSidebar from "./blog-sidebar";
import Pagination from "@/ui/Pagination";
import BlogItem from "./blog-item";
import { useGetPublishedBlogsQuery } from '@/redux/features/blogApi';
import { transformBlogs } from '@/utils/blogTransform';
import { ClipLoader } from 'react-spinners';

const BlogPostboxArea = () => {
  const { data, isLoading, error } = useGetPublishedBlogsQuery();
  
  // Show all published blogs (or filter by blog-postbox type if specified)
  const blog_items = useMemo(() => {
    if (!data?.data) return [];
    const blogs = transformBlogs(data.data);
    // Show all published blogs, but prefer blog-postbox type if available
    // If no blog-postbox blogs exist, show all published blogs
    const postboxBlogs = blogs.filter((b) => b.blog === "blog-postbox" || b.blog_type === "blog-postbox");
    return postboxBlogs.length > 0 ? postboxBlogs : blogs;
  }, [data]);

  const [filteredRows, setFilteredRows] = useState(blog_items);
  const [currPage, setCurrPage] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(4);

  // Update filteredRows when blog_items change
  useEffect(() => {
    setFilteredRows(blog_items);
  }, [blog_items]);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  if (isLoading) {
    return (
      <section className="tp-postbox-area pt-120 pb-120">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <ClipLoader size={50} color="#3498db" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tp-postbox-area pt-120 pb-120">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>
            <p>Error loading blogs. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
      <section className="tp-postbox-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="tp-postbox-wrapper pr-50">
                {filteredRows.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                    <p>No blogs found. Please create and publish blogs from the admin panel.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>
                      Make sure blogs are set to &quot;Published&quot; status and have the &quot;Blog Postbox&quot; type selected.
                    </p>
                  </div>
                ) : (
                  <>
                    {filteredRows.slice(pageStart, pageStart + countOfPage).map((item) => (
                      <BlogItem key={item.id || item._id} item={item} />
                    ))}
                    {blog_items.length > countOfPage && (
                      <div className="tp-blog-pagination mt-50">
                        <div className="tp-pagination">
                          <Pagination
                            items={blog_items}
                            countOfPage={4}
                            paginatedData={paginatedData}
                            currPage={currPage}
                            setCurrPage={setCurrPage}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-xl-3 col-lg-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostboxArea;
