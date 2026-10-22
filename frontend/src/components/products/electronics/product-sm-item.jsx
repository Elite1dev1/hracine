import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { formatCurrency } from "@/utils/currency";
import { getRatedReviewStats } from "@/utils/reviews";

const ProductSmItem = ({ product }) => {
  const {_id, img, category, title,price, reviews } = product || {};
  const [ratingVal, setRatingVal] = useState(0);
  const ratedReviewCount = getRatedReviewStats(reviews).count;

  useEffect(() => {
    setRatingVal(getRatedReviewStats(reviews).average);
  }, [reviews]);

  return (
    <div className="tp-product-sm-item d-flex align-items-center">
      <div className="tp-product-thumb mr-25 fix">
        <div>
          <Image
            src={img}
            alt="product img"
            width={140}
            height={140}
          />
        </div>
      </div>
      <div className="tp-product-sm-content">
        <div className="tp-product-category">
          <a href="#">{category?.name}</a>
        </div>
        <h3 className="tp-product-title">
          <div>{title}</div>
        </h3>
        <div className="tp-product-rating d-sm-flex align-items-center">
          <div className="tp-product-rating-icon">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
          <div className="tp-product-rating-text">
          ({ratedReviewCount} {ratedReviewCount === 1 ? 'Review' : 'Reviews'})
          </div>
        </div>
        <div className="tp-product-price-wrapper">
          <span className="tp-product-price">{formatCurrency(price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductSmItem;
