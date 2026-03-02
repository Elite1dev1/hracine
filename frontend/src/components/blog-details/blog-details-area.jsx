import React from 'react';
import Image from 'next/image';
// internal
import BlogSidebar from '../blog/blog-postox/blog-sidebar';
import BlogPostCommentForm from '../forms/blog-post-comment-form';
import BlogDetailsAuthor from './blog-details-author';
import BlogDetailsComments from './blog-details-comments';
import PostboxDetailsNav from './postbox-details-nav';
import PostboxDetailsTop from './postbox-details-top';
const BlogDetailsArea = ({blog}) => {
  const normalizedContent = blog?.content
    ? blog.content.replace(/\[Your Brand Name\]/gi, "HRACINE")
    : "";
  const instagramShare = {
    link: "https://www.instagram.com",
    icon: "fa-brands fa-instagram",
  };

  return (
    <section className="tp-postbox-details-area pb-120 pt-95">
      <div className="container">
        <div className="row">
          <div className="col-xl-9">
            {/* PostboxDetailsTop */}
            <PostboxDetailsTop blog={blog} />
            {/* PostboxDetailsTop */}
          </div>
          {blog?.img && (
            <div className="col-xl-12">
              <div className="tp-postbox-details-thumb" style={{marginBottom: '30px'}}>
                <Image 
                  src={blog.img} 
                  alt={blog.title || "blog-big-img"} 
                  width={1200} 
                  height={600} 
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }} 
                />
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <div className="tp-postbox-details-main-wrapper">
              <div className="tp-postbox-details-content">
                {blog?.content ? (
                  <div 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: normalizedContent }} 
                  />
                ) : (
                  <p>No content available.</p>
                )}

                <div className="tp-postbox-details-share-wrapper">
                  <div className="row">
                    <div className="col-xl-8 col-lg-6">
                      <div className="tp-postbox-details-tags tagcloud">
                        <span>Tags:</span>
                        {blog?.tags && blog.tags.length > 0 ? (
                          blog.tags.map((tag, index) => (
                            <a key={index} href="#">{tag}</a>
                          ))
                        ) : (
                          <span>No tags</span>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="tp-postbox-details-share">
                        <span>Share:</span>
                        <a href={instagramShare.link} className="me-1" target="_blank" rel="noreferrer">
                          <i className={instagramShare.icon}></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PostboxDetailsNav */}
                <PostboxDetailsNav />
                {/* PostboxDetailsNav */}

                {/* author details start */}
                <BlogDetailsAuthor />
                {/* author details end */}

                <div className="tp-postbox-details-comment-wrapper">
                  {/* BlogDetailsComments */}
                  <BlogDetailsComments blogId={blog?._id || blog?.id} />
                  {/* BlogDetailsComments */}
                </div>

                <div className="tp-postbox-details-form">
                  <h3 className="tp-postbox-details-form-title">Leave a Reply</h3>
                  <p>Your email address will not be published. Required fields are marked *</p>

                  {/* form start */}
                  <BlogPostCommentForm blogId={blog?._id || blog?.id} />
                  {/* form end */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            {/* sidebar start */}
            <BlogSidebar />
            {/* sidebar end */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;