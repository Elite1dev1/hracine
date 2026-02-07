import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// internal
import user from '@assets/img/users/mariam.jpg';
import signature from '@assets/img/blog/signature/signature.png';
import { Search } from '@/svg';
import { useGetPublishedBlogsQuery } from '@/redux/features/blogApi';
import { transformBlogs } from '@/utils/blogTransform';

const BlogSidebar = () => {
  const { data } = useGetPublishedBlogsQuery();
  
  // Get latest 3 published blogs
  const latest_post = React.useMemo(() => {
    if (!data?.data) return [];
    const blogs = transformBlogs(data.data);
    return blogs.slice(0, 3);
  }, [data]);

  return (
    <>
      <div className="tp-sidebar-wrapper tp-sidebar-ml--24">
        <div className="tp-sidebar-widget mb-35">
          <div className="tp-sidebar-search">
            <form action="#">
              <div className="tp-sidebar-search-input">
                <input type="text" placeholder="Search..." />
                <button type="submit">
                  <Search/>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* about  */}
        <div className="tp-sidebar-widget mb-35">
          <h3 className="tp-sidebar-widget-title">About me</h3>
          <div className="tp-sidebar-widget-content">
            <div className="tp-sidebar-about">
              <div className="tp-sidebar-about-thumb mb-25">
                <a href="#">
                  <Image src={user} alt="user" />
                </a>
              </div>
              <div className="tp-sidebar-about-content">
                <h3 className="tp-sidebar-about-title">
                  <a href="#">Mariam</a>
                </h3>
                <span className="tp-sidebar-about-designation">skincare expert</span>
                <p>Mariam is a passionate skincare expert dedicated to helping individuals achieve healthier skin and scalp through education, research-backed routines, and safe, effective product choices. She shares practical tips, ingredient insights, and simple care routines designed to support long-term skin and hair wellness.</p>
                <div className="tp-sidebar-about-signature">
                  <Image src={signature} alt="signature" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- about end --> */}

        {/* <!-- latest post start --> */}
        <div className="tp-sidebar-widget mb-35">
          <h3 className="tp-sidebar-widget-title">Latest Posts</h3>
          <div className="tp-sidebar-widget-content">
            <div className="tp-sidebar-blog-item-wrapper">
              {latest_post.length > 0 ? (
                latest_post.map(b => {
                  // Use slug if available, otherwise fall back to ID
                  const blogIdentifier = b.slug || b.id || b._id;
                  return (
                    <div key={b.id || b._id} className="tp-sidebar-blog-item d-flex align-items-center">
                      <div className="tp-sidebar-blog-thumb">
                        <Link href={`/blog-details/${blogIdentifier}`}>
                          <Image src={b.img} alt={b.title || "blog img"} width={80} height={80} style={{objectFit:'cover'}} />
                        </Link>
                      </div>
                      <div className="tp-sidebar-blog-content">
                        <div className="tp-sidebar-blog-meta">
                          <span>{b.date}</span>
                        </div>
                        <h3 className="tp-sidebar-blog-title">
                          <Link href={`/blog-details/${blogIdentifier}`}>{b.title}</Link>
                        </h3>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: '#888', fontSize: '14px' }}>No recent posts</p>
              )}
            </div>
          </div>
        </div>
        {/* <!-- latest post end --> */}

      </div>
    </>
  );
};

export default BlogSidebar;