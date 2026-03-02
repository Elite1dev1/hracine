import React from "react";
import { Comment, Date, UserTwo } from "@/svg";

const PostboxDetailsTop = ({blog}) => {
  const {title,date,comments,author} = blog || {};
  const displayAuthor =
    !author || author.trim().toLowerCase() === "blog author"
      ? "HRACINE Team"
      : author;
  return ( 
    <div className="tp-postbox-details-top">
      <h3 className="tp-postbox-details-title">
        {title}
      </h3>
      <div className="tp-postbox-details-meta mb-50">
        <span data-meta="author">
          <UserTwo />
          By <a href="#">{" "}{displayAuthor}</a>
        </span>
        <span>
          <Date />
          {" "}{date}
        </span>
        <span>
          <Comment />
          <a href="#">Comments ({comments})</a>
        </span>
      </div>
    </div>
  );
};

export default PostboxDetailsTop;
