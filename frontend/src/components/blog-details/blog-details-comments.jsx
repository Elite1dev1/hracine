import React from "react";
import Image from "next/image";
import { useGetBlogCommentsQuery } from "@/redux/features/blogApi";
import { ClipLoader } from 'react-spinners';

const BlogDetailsComments = ({ blogId }) => {
  const { data, isLoading, error } = useGetBlogCommentsQuery(blogId, {
    skip: !blogId,
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day} ${month}, ${year} at ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <ClipLoader size={30} color="#3498db" />
      </div>
    );
  }

  if (error || !data?.data || data.data.length === 0) {
    return (
      <div className="tp-postbox-details-comment-inner">
        <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  const comments = data.data;

  return (
    <div className="tp-postbox-details-comment-inner">
      <ul>
        {comments.map((comment) => (
          <li key={comment._id || comment.id}>
            <div className="tp-postbox-details-comment-box d-sm-flex align-items-start">
              <div className="tp-postbox-details-comment-thumb">
                <Image 
                  src={comment.userId?.imageURL || '/assets/img/users/user-2.jpg'} 
                  alt={comment.userId?.name || "user img"}
                  width={60}
                  height={60}
                  style={{borderRadius: '50%', objectFit: 'cover'}}
                />
              </div>
              <div className="tp-postbox-details-comment-content">
                <div className="tp-postbox-details-comment-top d-flex justify-content-between align-items-start">
                  <div className="tp-postbox-details-comment-avater">
                    <h4 className="tp-postbox-details-comment-avater-title">
                      {comment.userId?.name || 'Anonymous'}
                    </h4>
                    <span className="tp-postbox-details-avater-meta">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <ul className="children">
                {comment.replies.map((reply) => (
                  <li key={reply._id || reply.id}>
                    <div className="tp-postbox-details-comment-box d-sm-flex align-items-start">
                      <div className="tp-postbox-details-comment-thumb">
                        <Image 
                          src={reply.userId?.imageURL || '/assets/img/users/user-2.jpg'} 
                          alt={reply.userId?.name || "user img"}
                          width={60}
                          height={60}
                          style={{borderRadius: '50%', objectFit: 'cover'}}
                        />
                      </div>
                      <div className="tp-postbox-details-comment-content">
                        <div className="tp-postbox-details-comment-top d-flex justify-content-between align-items-start">
                          <div className="tp-postbox-details-comment-avater">
                            <h4 className="tp-postbox-details-comment-avater-title">
                              {reply.userId?.name || 'Anonymous'}
                            </h4>
                            <span className="tp-postbox-details-avater-meta">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p>{reply.comment}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetailsComments;
