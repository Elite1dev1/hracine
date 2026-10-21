import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Rating } from 'react-simple-star-rating';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Wishlist } from '@/svg';
import { add_cart_product, increment, decrement } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { handleModalClose } from '@/redux/features/productModalSlice';
import { formatCurrency } from '@/utils/currency';
import { formatDiscountPercentage, getProductPricing } from '@/utils/productPricing';
import ReviewForm from '../forms/review-form';
import ReviewItem from './review-item';

const DESC_MAX_LEN = 120;

const ProductDetailsMobile = ({ productItem }) => {
  const {
    _id,
    img,
    imageURLs,
    title,
    description,
    quantity,
    status,
    reviews,
    category,
    sku,
    tags,
    ingredients,
    howToUse,
    keyBenefits,
    isPreOrder,
    launchDate,
  } = productItem || {};

  const router = useRouter();
  const dispatch = useDispatch();
  const { orderQuantity } = useSelector((state) => state.cart);
  const [slideIndex, setSlideIndex] = useState(0);
  const [readMore, setReadMore] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const images = imageURLs?.length ? imageURLs.map((i) => i.img) : (img ? [img] : []);
  const ratingVal = reviews?.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const inStock = status !== 'out-of-stock';
  const { originalPrice, salePrice, hasDiscount, discountPercentage } = getProductPricing(productItem);
  const totalPrice = salePrice * orderQuantity;
  const originalTotalPrice = originalPrice * orderQuantity;
  const maxQuantity = Number(quantity) > 0 ? Number(quantity) : null;
  const isAtMaxQuantity = maxQuantity !== null && orderQuantity >= maxQuantity;
  const needsReadMore = description && description.length > DESC_MAX_LEN;
  const shortDesc = (() => {
    if (!description || !needsReadMore) return description || '';
    const excerpt = description.slice(0, DESC_MAX_LEN + 1);
    const lastWordBreak = excerpt.lastIndexOf(' ');
    return `${excerpt.slice(0, lastWordBreak > 0 ? lastWordBreak : DESC_MAX_LEN).trim()}…`;
  })();
  const launchDateValue = launchDate ? new Date(launchDate) : null;
  const formattedLaunchDate = launchDateValue && !Number.isNaN(launchDateValue.getTime())
    ? launchDateValue.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const availabilityLabel = !inStock
    ? 'Out of Stock'
    : isPreOrder
      ? 'Available for pre-order'
      : 'In Stock';

  const goSlide = useCallback((dir) => {
    setSlideIndex((i) => {
      if (dir === 1) return i >= images.length - 1 ? 0 : i + 1;
      return i <= 0 ? images.length - 1 : i - 1;
    });
  }, [images.length]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart != null && touchEnd != null) {
      const diff = touchStart - touchEnd;
      if (Math.abs(diff) > 50) goSlide(diff > 0 ? 1 : -1);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleAddCart = () => {
    dispatch(add_cart_product(productItem));
  };
  const handleWishlist = () => {
    dispatch(add_to_wishlist(productItem));
  };
  const handleIncrement = () => {
    if (!isAtMaxQuantity) dispatch(increment(maxQuantity));
  };
  const handleDecrement = () => dispatch(decrement());

  const shippingContent = isPreOrder 
    ? `Delivery begins on ${new Date(launchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. We’ll keep you updated.`
    : 'We offer 30-day easy returns. Order before 2:30PM for same-day dispatch. Standard delivery 3–5 business days.';
  const productDetailsContent = [sku && `SKU: ${sku}`, category?.name && `Category: ${category.name}`, tags?.[0] && `Tag: ${tags[0]}`].filter(Boolean).join(' • ') || 'See product info above.';

  const accordionSections = [
    { id: 'desc', title: 'Description', content: description || 'No description available.' },
    { id: 'shipping', title: 'Shipping & Returns', content: shippingContent },
    { id: 'details', title: 'Product Details', content: productDetailsContent },
    { id: 'howtouse', title: 'How to Use', content: howToUse || 'No usage instructions available.' },
    { id: 'ingredients', title: 'Ingredients', content: Array.isArray(ingredients) ? ingredients.join(', ') : (ingredients || 'No ingredients information available.') },
    { id: 'benefits', title: 'Key Benefits', content: keyBenefits?.length ? keyBenefits : null },
    { id: 'reviews', title: `Reviews (${reviews?.length || 0})`, isReviews: true },
  ];

  return (
    <div className="tp-product-details-mobile">
      {/* 1. Full-width image slider */}
      <div
        className="tp-pdm-gallery"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label={`${title || 'Product'} image gallery`}
      >
        <div className="tp-pdm-gallery-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
          {images.map((src, i) => (
            <div key={i} className="tp-pdm-gallery-slide">
              <Image
                src={src}
                alt={images.length > 1 ? `${title || 'Product'} - image ${i + 1}` : (title || 'Product')}
                fill
                sizes="(max-width: 991px) 100vw, 0px"
                priority={i === 0}
                style={{ objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="tp-pdm-gallery-dots" role="tablist" aria-label="Choose product image">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`tp-pdm-dot ${slideIndex === i ? 'active' : ''}`}
                onClick={() => setSlideIndex(i)}
                aria-label={`Show product image ${i + 1}`}
                aria-selected={slideIndex === i}
                role="tab"
              />
            ))}
          </div>
        )}
        {status === 'out-of-stock' && (
          <span className="tp-pdm-badge tp-pdm-badge-out">Out of stock</span>
        )}
        {hasDiscount && (
          <span className="tp-pdm-badge tp-pdm-badge-sale">
            -{formatDiscountPercentage(discountPercentage)}% OFF
          </span>
        )}
      </div>

      {/* 2. Product info header */}
      <div className="tp-pdm-info">
        <h1 className="tp-pdm-title">{title}</h1>
        {isPreOrder && (
          <div className="tp-pdm-preorder-notice">
            <p className="tp-pdm-preorder-title">
              This is a pre-order item
            </p>
            {formattedLaunchDate && (
              <p className="tp-pdm-preorder-date">
                Delivery begins on {formattedLaunchDate}
              </p>
            )}
          </div>
        )}
        <div className="tp-pdm-price-row">
          <p className={`tp-pdm-price ${hasDiscount ? 'is-sale' : ''}`}>
            {formatCurrency(salePrice)}
          </p>
          {hasDiscount && (
            <span className="tp-pdm-price-original">{formatCurrency(originalPrice)}</span>
          )}
        </div>
        <div className="tp-pdm-meta">
          <div className="tp-pdm-rating">
            {reviews?.length ? (
              <>
                <Rating allowFraction size={18} initialValue={ratingVal} readonly fillColor="#6b2824" emptyColor="#ddd" />
                <span className="tp-pdm-review-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
              </>
            ) : (
              <span className="tp-pdm-rating-empty">No reviews yet</span>
            )}
          </div>
          <span className={`tp-pdm-stock ${!inStock ? 'out' : isPreOrder ? 'preorder' : 'in'}`}>
            {availabilityLabel}
          </span>
        </div>
      </div>

      {/* 3. Short description + Read more */}
      {description && (
        <div className="tp-pdm-desc">
          <p className="tp-pdm-desc-text">
            {readMore ? description : shortDesc}
            {needsReadMore && (
              <button type="button" className="tp-pdm-read-more" onClick={() => setReadMore(!readMore)}>
                {readMore ? ' See less' : ' Read more'}
              </button>
            )}
          </p>
        </div>
      )}

      {/* 4. Quantity */}
      <div className="tp-pdm-qty">
        <span className="tp-pdm-qty-label">Quantity</span>
        <div className="tp-pdm-qty-pill">
          <button
            type="button"
            className="tp-pdm-qty-btn"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
            disabled={orderQuantity <= 1}
          >
            <Minus />
          </button>
          <span className="tp-pdm-qty-num">{orderQuantity}</span>
          <button
            type="button"
            className="tp-pdm-qty-btn"
            onClick={handleIncrement}
            aria-label="Increase quantity"
            disabled={isAtMaxQuantity}
          >
            <Plus />
          </button>
        </div>
      </div>

      {/* 5. Secondary cart action */}
      <div className="tp-pdm-footer">
        <button
          type="button"
          className="tp-pdm-add-cart"
          onClick={handleAddCart}
          disabled={!inStock}
        >
          {isPreOrder ? 'Add pre-order to cart' : 'Add to Cart'}
        </button>
      </div>

      {/* 6. Add to Wishlist */}
      <div className="tp-pdm-wishlist-row">
        <button type="button" className="tp-pdm-wishlist-btn" onClick={handleWishlist}>
          <Wishlist />
          <span>Add to Wishlist</span>
        </button>
      </div>

      {/* 7. Accordions */}
      <div className="tp-pdm-accordions">
        {accordionSections.map((sec) => (
          <div key={sec.id} className="tp-pdm-accordion">
            <button
              type="button"
              className="tp-pdm-accordion-head"
              onClick={() => setOpenAccordion(openAccordion === sec.id ? null : sec.id)}
              aria-expanded={openAccordion === sec.id}
            >
              <span>{sec.title}</span>
              <span className="tp-pdm-accordion-chevron">{openAccordion === sec.id ? '▲' : '▼'}</span>
            </button>
            <div className={`tp-pdm-accordion-body ${openAccordion === sec.id ? 'open' : ''}`}>
              <div className="tp-pdm-accordion-inner">
                {sec.isReviews ? (
                  <>
                    {(!reviews || reviews.length === 0) ? (
                      <>
                        <p className="tp-pdm-no-reviews">No reviews yet. Be the first to share your experience.</p>
                        <button type="button" className="tp-pdm-write-review-btn">Write a Review</button>
                        <div className="tp-pdm-review-form-wrap">
                          <ReviewForm product_id={_id} />
                        </div>
                      </>
                    ) : (
                      <>
                        {reviews.map((item) => (
                          <ReviewItem key={item._id} review={item} />
                        ))}
                        <ReviewForm product_id={_id} />
                      </>
                    )}
                  </>
                ) : sec.content && typeof sec.content === 'string' ? (
                  <p className="tp-pdm-accordion-p">{sec.content}</p>
                ) : sec.content && Array.isArray(sec.content) ? (
                  <ul className="tp-pdm-accordion-list">
                    {sec.content.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="tp-pdm-accordion-p">No content available.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 8. Sticky bottom CTA */}
      <div className="tp-pdm-sticky-bar">
        <div className="tp-pdm-sticky-price-group">
          <span className="tp-pdm-sticky-label">Total</span>
          <span className="tp-pdm-sticky-price">{formatCurrency(totalPrice)}</span>
          {hasDiscount && (
            <span className="tp-pdm-sticky-original">{formatCurrency(originalTotalPrice)}</span>
          )}
        </div>
        {inStock ? (
          <button
            type="button"
            className="tp-pdm-sticky-cta"
            onClick={() => {
              handleAddCart();
              dispatch(handleModalClose());
              router.push('/cart');
            }}
          >
            {isPreOrder ? 'Pre-order' : 'Buy Now'}
          </button>
        ) : (
          <button type="button" className="tp-pdm-sticky-cta tp-pdm-sticky-preorder" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsMobile;
