import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Rating } from "react-simple-star-rating";
// internal
import { Wishlist, CartTwo } from "@/svg";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { formatCurrency } from "@/utils/currency";

const ProductItemMobile = ({ product }) => {
  const { _id, img, title, reviews, price, discount, status } = product || {};
  const [ratingVal, setRatingVal] = useState(0);
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  // handle add product
  const handleAddProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddedToCart) {
      // Navigate to cart if already added
      router.push('/cart');
    } else {
      dispatch(add_cart_product(product));
    }
  };

  // handle wishlist product
  const handleWishlistProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(add_to_wishlist(product));
  };

  // handle card click - navigate to product details
  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (
      e.target.closest('.tp-product-mobile-wishlist-btn') ||
      e.target.closest('.tp-product-mobile-bag-btn')
    ) {
      return;
    }
    router.push(`/product-details/${_id}`);
  };

  const currentPrice = discount > 0 
    ? Number(price) - (Number(price) * Number(discount)) / 100 
    : Number(price);

  return (
    <div className="tp-product-item-mobile">
      <div className="tp-product-mobile-card" onClick={handleCardClick}>
        {/* Image Container */}
        <div className="tp-product-mobile-thumb">
          <div className="tp-product-mobile-image-wrapper">
            <Image
              src={img}
              alt={title}
              width={400}
              height={400}
              className="tp-product-mobile-image"
              loading="lazy"
            />
          </div>
          
          {/* Out of Stock Badge */}
          {status === 'out-of-stock' && (
            <div className="tp-product-mobile-badge">
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="tp-product-mobile-content">
          {/* Product Name */}
          <h3 className="tp-product-mobile-title" title={title}>
            {title}
          </h3>

          {/* Star Rating - Optional */}
          {ratingVal > 0 && (
            <div className="tp-product-mobile-rating">
              <Rating 
                allowFraction 
                size={12} 
                initialValue={ratingVal} 
                readonly={true}
                fillColor="#FFB800"
                emptyColor="#E5E5E5"
              />
            </div>
          )}

          {/* Price */}
          <div className="tp-product-mobile-price-wrapper">
            <div className="tp-product-mobile-price-left">
              <span className="tp-product-mobile-price-current">
                {formatCurrency(currentPrice)}
              </span>
            </div>
          </div>

          {/* Action Icons - Bag and Wishlist */}
          <div className="tp-product-mobile-actions">
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={status === 'out-of-stock'}
              className={`tp-product-mobile-bag-btn ${isAddedToCart ? 'added' : ''}`}
              aria-label={isAddedToCart ? 'View cart' : 'Add to bag'}
            >
              <CartTwo />
            </button>
            <button
              type="button"
              onClick={handleWishlistProduct}
              disabled={status === 'out-of-stock'}
              className={`tp-product-mobile-wishlist-btn ${isAddedToWishlist ? 'active' : ''}`}
              aria-label="Add to wishlist"
            >
              <Wishlist />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemMobile;
