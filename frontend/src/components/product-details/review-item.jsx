import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Rating } from "react-simple-star-rating";

const ReviewItem = ({ review }) => {
  const { comment, createdAt, rating, userId } = review || {};
  const displayName = review?.displayName || userId?.name || 'Customer';
  const displayDate = review?.reviewDate || (review?.source !== 'manual' ? createdAt : null);
  return (
    <div className="tp-product-details-review-avater d-flex align-items-start">
      <div className="tp-product-details-review-avater-thumb">
        {!userId?.imageURL && <h5 className="review-name">{displayName.charAt(0).toUpperCase()}</h5>}
        {userId?.imageURL && <Image src={userId.imageURL} alt={`${displayName} profile`} width={60} height={60} />}
      </div>
      <div className="tp-product-details-review-avater-content">
        <div className="tp-product-details-review-avater-rating d-flex align-items-center">
          {Number.isFinite(Number(rating)) && Number(rating) >= 1 && <Rating allowFraction size={16} initialValue={Number(rating)} readonly={true} />}
        </div>
        <h3 className="tp-product-details-review-avater-title">{displayName}</h3>
        <span className="tp-product-details-review-avater-meta">
          {displayDate && dayjs(displayDate).isValid() ? dayjs(displayDate).format("MMMM D, YYYY") : ''}
          {review?.verifiedPurchase === true && <span className="tp-review-verified" style={{ marginLeft: 8, color: '#287a46', fontWeight: 600 }}>Verified Purchase</span>}
        </span>

        <div className="tp-product-details-review-avater-comment">
          <p>
            {comment}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
