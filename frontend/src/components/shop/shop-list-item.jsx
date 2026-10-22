import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
// internal
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";
import { formatCurrency } from "@/utils/currency";
import { formatDiscountPercentage, getProductPricing } from "@/utils/productPricing";
import { getRatedReviewStats } from "@/utils/reviews";

const ShopListItem = ({ product }) => {
  const { _id, img, category, title, reviews, tags, description } = product || {};
  const dispatch = useDispatch()
  const { originalPrice, salePrice, hasDiscount, discountPercentage } = getProductPricing(product);
  const [ratingVal, setRatingVal] = useState(0);
  useEffect(() => {
    setRatingVal(getRatedReviewStats(reviews).average);
  }, [reviews]);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle compare product
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };

  return (
    <div className="tp-product-list-item d-md-flex">
      <div className="tp-product-list-thumb p-relative fix">
        <Link href={`/product-details/${_id}`}>
          <Image src={img} alt="product img" width={350} height={310} />
        </Link>

        {hasDiscount && (
          <span className="product-hot" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, padding: '5px 9px', borderRadius: '999px', backgroundColor: '#85312c', color: '#fff', fontSize: '11px', fontWeight: 700 }}>
            -{formatDiscountPercentage(discountPercentage)}% OFF
          </span>
        )}

        {/* <!-- product action --> */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
              onClick={() => dispatch(handleProductModal(product))}
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
            <button
              type="button"
              onClick={()=> handleWishlistProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-to-wishlist-btn"
            >
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Wishlist
              </span>
            </button>
            <button
              type="button"
              onClick={()=> handleCompareProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-to-compare-btn"
            >
              <CompareThree />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Compare
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-list-content">
        <div className="tp-product-content-2 pt-15">
          <div className="tp-product-tag-2">
            {tags?.map((t, i) => <a key={i} href="#">{t}</a>)}
          </div>
          <h3 className="tp-product-title-2">
            <Link href={`/product-details/${_id}`}>{title}</Link>
          </h3>
          <div className="tp-product-rating-icon tp-product-rating-icon-2">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
          <div className="tp-product-price-wrapper-2">
            {hasDiscount ? (
              <>
                <span className="tp-product-price-2 new-price" style={{ color: '#85312c', fontWeight: 700 }}>{formatCurrency(salePrice)}</span>
                <span className="tp-product-price-2 old-price">
                  {" "} {formatCurrency(originalPrice)}
                </span>
              </>
            ) : (
              <span className="tp-product-price-2 new-price">{formatCurrency(salePrice)}</span>
            )}
          </div>
          <p>
            {description.substring(0, 100)}
          </p>
          <div className="tp-product-list-add-to-cart">
            <button onClick={() => handleAddProduct(product)} className="tp-product-list-add-to-cart-btn">
              Pre-Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListItem;
