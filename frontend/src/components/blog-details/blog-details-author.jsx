import React from "react";
import Image from "next/image";
// internal
import author_img from "@assets/img/users/mariam.jpg";

const BlogDetailsAuthor = () => {
  const instagramAuthor = {
    link: "https://www.instagram.com",
    icon: "fa-brands fa-instagram",
  };

  return (
    <div
      className="tp-postbox-details-author tp-blog-article-author d-flex align-items-center"
      data-bg-color="#F4F7F9"
    >
      <div className="tp-postbox-details-author-thumb">
        <a href="#">
          <Image
            src={author_img}
            alt="Mariam, Hracine blogger"
            width={90}
            height={90}
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
        </a>
      </div>
      <div className="tp-postbox-details-author-content">
        <span>Written by</span>
        <h5 className="tp-postbox-details-author-title">
          <a href="#">Mariam</a>
        </h5>
        <p>
          Mariam is a hair-care blogger who shares practical, easy-to-follow guidance for healthier scalps and stronger hair. Through honest product reviews, ingredient breakdowns, routine tips, and protective-style inspiration, she helps readers make confident choices and build simple hair-care habits that work for everyday life.
        </p>

        <div className="tp-postbox-details-author-social">
          <a href={instagramAuthor.link} target="_blank" rel="noreferrer" className="me-1">
            <i className={instagramAuthor.icon}></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsAuthor;
