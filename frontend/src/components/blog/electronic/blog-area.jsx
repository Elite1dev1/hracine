import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper';
// internal
import { ArrowRightLong } from '@/svg';
import BlogItem from './blog-item';
import Link from 'next/link';
import { useGetPublishedBlogsQuery } from '@/redux/features/blogApi';
import { transformBlogs } from '@/utils/blogTransform';

// slider setting 
const slider_setting = {
  slidesPerView: 3,
  spaceBetween: 20,
  autoplay: {
    delay: 4000,
  },
  navigation: {
    nextEl: ".tp-blog-main-slider-button-next",
    prevEl: ".tp-blog-main-slider-button-prev",
  },
  pagination: {
    el: ".tp-blog-main-slider-dot",
    clickable: true,
  },
  breakpoints: {
    '1200': {
      slidesPerView: 3,
    },
    '992': {
      slidesPerView: 2,
    },
    '768': {
      slidesPerView: 2,
    },
    '576': {
      slidesPerView: 1,
    },
    '0': {
      slidesPerView: 1,
    },
  }
}

const BlogArea = () => {
  const { data } = useGetPublishedBlogsQuery();
  
  const blogs = useMemo(() => {
    if (!data?.data) return [];
    const transformedBlogs = transformBlogs(data.data);
    // Show all published blogs, but prefer electronics/fashion if available
    const electronicsBlogs = transformedBlogs.filter(b => b.blog === 'electronics' || b.blog_type === 'electronics');
    const fashionBlogs = transformedBlogs.filter(b => b.blog === 'fashion' || b.blog_type === 'fashion');
    // If no electronics/fashion blogs, show all published blogs
    const filteredBlogs = electronicsBlogs.length > 0 ? electronicsBlogs : 
                          fashionBlogs.length > 0 ? fashionBlogs : 
                          transformedBlogs;
    return filteredBlogs.slice(0, 6);
  }, [data]);

  // Get first 2 blogs for mobile (or 1 if only one exists)
  const mobileBlogs = blogs.slice(0, 2);

  // Hide entire section if no blogs
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="tp-blog-area pt-50 pb-75">
      <div className="container">
        <div className="row align-items-end d-none d-md-flex">
          <div className="col-xl-4 col-md-6">
            <div className="tp-section-title-wrapper mb-50">
              <h3
                className="tp-section-title"
                style={{ fontFamily: "'Playfair Display', 'Times New Roman', serif" }}
              >
                Latest Stories
              </h3>
            </div>
          </div>
          <div className="col-xl-8 col-md-6">
            <div className="tp-blog-more-wrapper d-flex justify-content-md-end">
              <div className="tp-blog-more mb-50 text-md-end">
                <Link href="/blog" className="tp-btn tp-btn-2 tp-btn-blue">View All Blog
                  <ArrowRightLong />
                </Link>
                <span className="tp-blog-more-border"></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop/Tablet Slider */}
        <div className="row d-none d-md-block">
          <div className="col-xl-12">
            <div className="tp-blog-main-slider">
              <Swiper {...slider_setting} modules={[Pagination,Navigation,Autoplay]} className="tp-blog-main-slider-active swiper-container">
                {blogs.map((blog) => (
                  <SwiperSlide key={blog.id || blog._id}>
                    <BlogItem blog={blog} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="row d-md-none">
          <div className="col-12">
            {/* Mobile Header */}
            <div className="tp-section-title-wrapper mb-30" style={{
              marginBottom: 'clamp(20px, 4vw, 30px)'
            }}>
              <h3 className="tp-section-title" style={{
                fontSize: 'clamp(20px, 5vw, 28px)',
                marginBottom: '0',
                fontFamily: "'Playfair Display', 'Times New Roman', serif",
              }}>
                Latest Stories
              </h3>
            </div>

            {/* Mobile Blog Cards */}
            {mobileBlogs.length > 0 && (
              <div className="tp-blog-mobile-wrapper" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(20px, 4vw, 30px)',
                marginBottom: 'clamp(30px, 6vw, 40px)'
              }}>
                {mobileBlogs.map((blog) => {
                  const blogIdentifier = blog.slug || blog.id || blog._id;
                  return (
                    <Link 
                      key={blog.id || blog._id} 
                      href={`/blog-details/${blogIdentifier}`}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                        width: '100%'
                      }}
                    >
                      <div className="tp-blog-mobile-card" style={{
                        position: 'relative',
                        width: '100%',
                        height: 'clamp(200px, 50vw, 280px)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        backgroundImage: `url(${blog.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 'clamp(20px, 5vw, 30px)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                      }}
                      >
                        {/* Dark Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%)',
                          zIndex: 1
                        }}></div>
                        
                        {/* Title Overlay */}
                        <h3 style={{
                          position: 'relative',
                          zIndex: 2,
                          color: '#FFFFFF',
                          fontSize: 'clamp(18px, 4.5vw, 24px)',
                          fontWeight: '700',
                          lineHeight: '1.3',
                          margin: 0,
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                          fontFamily: "'Playfair Display', serif"
                        }}>
                          {blog.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
            {/* Centered View All Blog Button - Only show if blogs exist */}
            {mobileBlogs.length > 0 && (
              <div style={{
                textAlign: 'center',
                width: '100%',
                marginTop: 'clamp(20px, 4vw, 30px)'
              }}>
                <Link href="/blog" className="tp-btn tp-btn-2 tp-btn-blue" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto'
                }}>
                  View All Blog
                  <ArrowRightLong />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogArea;