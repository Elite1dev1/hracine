import React from "react";
import Image from "next/image";
// internal
import author_img from "@assets/img/users/mariam.jpg";
import social_data from "@/data/social-data";

const BlogDetailsAuthor = () => {
  return (
    <div
      className="tp-postbox-details-author d-sm-flex align-items-start"
      data-bg-color="#F4F7F9"
    >
      <div className="tp-postbox-details-author-thumb">
        <a href="#">
          <Image src={author_img} alt="author_img" />
        </a>
      </div>
      <div className="tp-postbox-details-author-content">
        <span>Written by</span>
        <h5 className="tp-postbox-details-author-title">
          <a href="#">Mariam</a>
        </h5>
        <p>
          Mariam is a passionate skincare expert dedicated to helping individuals achieve healthier skin and scalp through education, research-backed routines, and safe, effective product choices. She shares practical tips, ingredient insights, and simple care routines designed to support long-term skin and hair wellness.
        </p>

        <div className="tp-postbox-details-author-social">
          {social_data.map((s) => (
            <a href={s.link} target="_blank" className="me-1" key={s.id}>
              <i className={s.icon}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsAuthor;
