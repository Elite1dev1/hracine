import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import { ArrowRightLong, Comment, Date } from "@/svg";

const ListItem = ({blog}) => {
  const {id, slug, list_img, img, date, comments, author, title, desc} = blog || {};
  const imageUrl = list_img || img || '';
  // Use slug if available, otherwise fall back to ID
  const blogIdentifier = slug || id || blog?._id;
  return (
    <div className="tp-blog-list-item d-md-flex d-lg-block d-xl-flex">
      <div className="tp-blog-list-thumb">
        <Link href={`/blog-details/${blogIdentifier}`}>
          <Image src={imageUrl} alt={title || "blog img"} width={300} height={200} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </Link>
      </div>
      <div className="tp-blog-list-content">
        <div className="tp-blog-grid-content">
          <div className="tp-blog-grid-meta">
            <span>
              <span>
                <Date/>
              </span>
             {" "}{date}
            </span>
            <span>
              <span>
                <Comment/>
              </span>
              {" "}Comments ({comments})
            </span>
          </div>
          <h3 className="tp-blog-grid-title">
            <Link href={`/blog-details/${blogIdentifier}`}>{title}</Link>
          </h3>
          <p>{desc}</p>

          <div className="tp-blog-grid-btn">
            <Link href={`/blog-details/${blogIdentifier}`} className="tp-link-btn-3">
              Read More{" "}
              <span>
                <ArrowRightLong/>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;