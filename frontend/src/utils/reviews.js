export const getRatedReviewStats = (reviews = []) => {
  const ratedReviews = (Array.isArray(reviews) ? reviews : []).filter((review) => {
    const rating = Number(review?.rating);
    return Number.isFinite(rating) && rating >= 1 && rating <= 5;
  });
  return {
    count: ratedReviews.length,
    average: ratedReviews.length
      ? ratedReviews.reduce((total, review) => total + Number(review.rating), 0) / ratedReviews.length
      : 0,
  };
};
