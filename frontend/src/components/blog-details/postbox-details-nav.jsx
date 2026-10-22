import React from 'react';
import Link from 'next/link';
import { ArrowRightLong, ArrowRightLongPrev } from '@/svg';
import { useGetPublishedBlogsQuery } from '@/redux/features/blogApi';
import { transformBlogs } from '@/utils/blogTransform';
import { normalizeBlogSlug } from '@/utils/blogSlug';

const PostboxDetailsNav = ({ blog }) => {
  const { data } = useGetPublishedBlogsQuery();
  const posts = transformBlogs(data?.data);
  const currentIndex = posts.findIndex((post) =>
    (blog?._id || blog?.id) && String(post._id || post.id) === String(blog._id || blog.id)
      || (blog?.slug && post.slug === blog.slug)
  );

  if (currentIndex < 0) return null;

  // Published posts are returned newest first: older posts are Previous, newer are Next.
  const previousPost = posts[currentIndex + 1];
  const nextPost = posts[currentIndex - 1];
  const getPostHref = (post) =>
    `/blog-details/${normalizeBlogSlug(post.slug || post.id || post._id)}`;

  if (!previousPost && !nextPost) return null;

  return (
    <nav className="tp-postbox-details-navigation tp-blog-article-navigation" aria-label="Article navigation">
      {previousPost ? (
        <Link
          href={getPostHref(previousPost)}
          className="tp-blog-article-navigation-card tp-blog-article-navigation-previous"
          aria-label={`Previous article: ${previousPost.title}`}
        >
          <span className="tp-blog-article-navigation-arrow"><ArrowRightLongPrev /></span>
          <span className="tp-blog-article-navigation-copy">
            <span className="tp-blog-article-navigation-label">Previous Article</span>
            <span className="tp-blog-article-navigation-title">{previousPost.title}</span>
          </span>
        </Link>
      ) : null}
      {nextPost ? (
        <Link
          href={getPostHref(nextPost)}
          className="tp-blog-article-navigation-card tp-blog-article-navigation-next"
          aria-label={`Next article: ${nextPost.title}`}
        >
          <span className="tp-blog-article-navigation-copy">
            <span className="tp-blog-article-navigation-label">Next Article</span>
            <span className="tp-blog-article-navigation-title">{nextPost.title}</span>
          </span>
          <span className="tp-blog-article-navigation-arrow"><ArrowRightLong /></span>
        </Link>
      ) : null}
    </nav>
  );
};

export default PostboxDetailsNav;
