import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightLong, Comment, Date } from "@/svg";
// internal

const GridItem = ({ blog,style_2=false }) => {
  const {id, slug, img, date, comments, author, title, desc } = blog || {};
  // Use slug if available, otherwise fall back to ID
  const blogIdentifier = slug || id || blog?._id;
  return (
    <>
      <div className={`tp-blog-grid-item ${style_2?'tp-blog-grid-style2':''} p-relative mb-30`}>
        <div className="tp-blog-grid-thumb fix mb-30">
          <Link href={`/blog-details/${blogIdentifier}`}>
            <Image src={img || ''} alt={title || "blog img"} width={600} height={400} style={{width:'100%',height:'100%',objectFit:'cover'}} />
          </Link>
        </div>
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
              {" "} Comments ({comments})
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
                <ArrowRightLong />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default GridItem;
