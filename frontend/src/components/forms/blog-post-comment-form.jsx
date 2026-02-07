import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAddBlogCommentMutation } from '@/redux/features/blogApi';
import { toast } from 'react-toastify';

const BlogPostCommentForm = ({ blogId }) => {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [addComment, { isLoading }] = useAddBlogCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const userInfo = Cookies.get('userInfo');
    if (!userInfo) {
      toast.error('Please login to post a comment');
      router.push('/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await addComment({
        blogId,
        comment: comment.trim(),
      }).unwrap();
      toast.success('Comment posted successfully!');
      setComment('');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-postbox-details-form-wrapper">
        <div className="tp-postbox-details-form-inner">
          <div className="tp-postbox-details-input-box">
            <div className="tp-contact-input">
              <textarea 
                id="msg" 
                placeholder="Write your message here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows="5"
              ></textarea>
            </div>
            <div className="tp-postbox-details-input-title">
              <label htmlFor="msg">Your Message *</label>
            </div>
          </div>
        </div>
        <div className="tp-postbox-details-input-box">
          <button 
            className="tp-postbox-details-input-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BlogPostCommentForm;