import React, { useState, useMemo } from 'react';
import { GridTab, ListTab } from '@/svg';
import GridItem from './grid-item';
import ListItem from './list-item';
import Pagination from '@/ui/Pagination';
import BlogSidebar from '../blog-postox/blog-sidebar';
import { useGetPublishedBlogsQuery } from '@/redux/features/blogApi';
import { transformBlogs } from '@/utils/blogTransform';
import { ClipLoader } from 'react-spinners';

const BlogGridArea = ({ list_area = false }) => {
  const { data, isLoading, error } = useGetPublishedBlogsQuery();
  
  // Filter and transform blogs for blog-grid type
  const blog_items = useMemo(() => {
    if (!data?.data) return [];
    const blogs = transformBlogs(data.data);
    return blogs.filter((b) => b.blog === "blog-grid" || b.blog_type === "blog-grid");
  }, [data]);

  const [filteredRows, setFilteredRows] = useState(blog_items);
  const [currPage, setCurrPage] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(6);

  // Update filteredRows when blog_items change
  React.useEffect(() => {
    setFilteredRows(blog_items);
  }, [blog_items]);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  if (isLoading) {
    return (
      <section className="tp-blog-grid-area pb-120">
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
      <section className="tp-blog-grid-area pb-120">
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
      <section className="tp-blog-grid-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="tp-blog-grid-wrapper">
                <div className="tp-blog-grid-top d-flex justify-content-between mb-40">
                  <div className="tp-blog-grid-result">
                    <p>Showing {blog_items.length > 0 ? pageStart + 1 : 0}–{Math.min(pageStart + countOfPage, blog_items.length)} of {blog_items.length} results</p>
                  </div>
                  <div className="tp-blog-grid-tab tp-tab">
                    <nav>
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className={`nav-link ${list_area ? '' : 'active'}`} id="nav-grid-tab" data-bs-toggle="tab" data-bs-target="#nav-grid" type="button" role="tab" aria-controls="nav-grid" aria-selected="true">
                          <ListTab />
                        </button>
                        <button className={`nav-link ${list_area ? 'active' : ''}`} id="nav-list-tab" data-bs-toggle="tab" data-bs-target="#nav-list" type="button" role="tab" aria-controls="nav-list" aria-selected="false">
                          <GridTab />
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>

                <div className="tab-content" id="nav-tabContent">
                  <div className={`tab-pane fade ${list_area ? '' : 'show active'}`} id="nav-grid" role="tabpanel" aria-labelledby="nav-grid-tab" tabIndex="0">
                    {/*  blog grid item wrapper */}
                    <div className="tp-blog-grid-item-wrapper">
                      <div className="row tp-gx-30">
                        {filteredRows.slice(pageStart, pageStart + countOfPage).map((blog) => (
                          <div key={blog.id || blog._id} className="col-lg-6 col-md-6">
                            <GridItem blog={blog} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`tab-pane fade ${list_area ? 'show active' : ''}`} id="nav-list" role="tabpanel" aria-labelledby="nav-list-tab" tabIndex="0">
                    {/* blog list wrapper */}
                    <div className="tp-blog-list-item-wrapper">
                      {filteredRows.slice(pageStart, pageStart + countOfPage).map((blog) => (
                        <ListItem key={blog.id || blog._id} blog={blog} />
                      ))}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="tp-blog-pagination mt-30">
                        <div className="tp-pagination">
                          <Pagination
                            items={blog_items}
                            countOfPage={6}
                            paginatedData={paginatedData}
                            currPage={currPage}
                            setCurrPage={setCurrPage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4">
              {/* blog sidebar start  */}
              <BlogSidebar />
              {/* blog sidebar end  */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogGridArea;