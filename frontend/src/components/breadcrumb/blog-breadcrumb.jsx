import React from "react";
import bg from '@assets/img/breadcrumb/breadcrumb-bg-1.jpg';

const BlogBreadcrumb = () => {
  return (
    <section
      className="breadcrumb__area include-bg pt-150 pb-150 breadcrumb__overlay breadcrumb__style-3"
      style={{
        // On desktop it applies the bg, on mobile our CSS overides/hides it
        ...(typeof window !== 'undefined' && window.innerWidth > 768
          ? { backgroundImage: `url(${bg.src})` }
          : { backgroundImage: `url(${bg.src})`, backgroundSize: 'cover' })
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .breadcrumb__area.breadcrumb__style-3 {
            background-image: none !important;
          }
          .breadcrumb__area.breadcrumb__style-3.breadcrumb__overlay::after {
            display: none !important;
          }
        }
      `}</style>
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="breadcrumb__content text-center p-relative z-index-1">
              <h3 className="breadcrumb__title">Rooted Wisdom</h3>
              <div className="breadcrumb__list">
                <span>
                  <a href="#">Home</a>
                </span>
                <span>Blog</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogBreadcrumb;
