import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Rating } from 'react-simple-star-rating';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus } from '@/svg';
import { add_cart_product, increment, decrement } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { handleModalClose } from '@/redux/features/productModalSlice';
import { formatCurrency } from '@/utils/currency';
import ReviewForm from '../forms/review-form';
import ReviewItem from './review-item';

const CTA_BG = '#6b2824';
const DESC_MAX_LEN = 120;

const ProductDetailsMobile = ({ productItem }) => {
  const {
    _id,
    img,
    imageURLs,
    title,
    description,
    price,
    discount,
    status,
    reviews,
    category,
    sku,
    tags,
    ingredients,
    howToUse,
    keyBenefits,
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
  const displayPrice = discount > 0 ? Number(price) - (Number(price) * Number(discount)) / 100 : Number(price);
  const needsReadMore = description && description.length > DESC_MAX_LEN;
  const shortDesc = description ? (needsReadMore ? description.substring(0, DESC_MAX_LEN) + '...' : description) : '';

  const goSlide = useCallback((dir) => {
    setSlideIndex((i) => {
      if (dir === 1) return i >= images.length - 1 ? 0 : i + 1;
      return i <= 0 ? images.length - 1 : i - 1;
    });
  }, [images.length]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) goSlide(diff > 0 ? 1 : -1);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleAddCart = () => {
    dispatch(add_cart_product(productItem));
  };
  const handleWishlist = () => {
    dispatch(add_to_wishlist(productItem));
  };
  const handleIncrement = () => dispatch(increment());
  const handleDecrement = () => dispatch(decrement());

  const shippingContent = 'We offer 30-day easy returns. Order before 2:30PM for same-day dispatch. Standard delivery 3–5 business days.';
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
      >
        <div className="tp-pdm-gallery-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
          {images.map((src, i) => (
            <div key={i} className="tp-pdm-gallery-slide">
              <Image src={src} alt={title || 'Product'} fill sizes="100vw" style={{ objectFit: 'contain' }} />
            </div>
          ))}
        </div>
        {status === 'out-of-stock' && (
          <span className="tp-pdm-badge tp-pdm-badge-out">Out of stock</span>
        )}
      </div>

      {/* 2. Product info header */}
      <div className="tp-pdm-info">
        <h1 className="tp-pdm-title">{title}</h1>
        <p className="tp-pdm-price">{formatCurrency(displayPrice)}</p>
        <div className="tp-pdm-meta">
          <div className="tp-pdm-rating">
            <Rating allowFraction size={18} initialValue={ratingVal} readonly fillColor="#111" emptyColor="#ddd" />
            <span className="tp-pdm-review-count">({reviews?.length || 0} reviews)</span>
          </div>
          <span className={`tp-pdm-stock ${inStock ? 'in' : 'out'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
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

      {/* 5. Quantity pill */}
      <div className="tp-pdm-qty">
        <span className="tp-pdm-qty-label">Quantity</span>
        <div className="tp-pdm-qty-pill">
          <button type="button" className="tp-pdm-qty-btn" onClick={handleDecrement} aria-label="Decrease">
            <Minus />
          </button>
          <span className="tp-pdm-qty-num">{orderQuantity}</span>
          <button type="button" className="tp-pdm-qty-btn" onClick={handleIncrement} aria-label="Increase">
            <Plus />
          </button>
        </div>
      </div>

      {/* 6. Add to Wishlist (secondary) */}
      <div className="tp-pdm-wishlist-row">
        <button type="button" className="tp-pdm-wishlist-btn" onClick={handleWishlist}>
          ♡ Add to Wishlist
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

      {/* Spacer for sticky bar */}
      <div className="tp-pdm-spacer" />

      {/* 9. Sticky bottom CTA */}
      <div className="tp-pdm-sticky-bar">
        <span className="tp-pdm-sticky-price">{formatCurrency(displayPrice)}</span>
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
            Buy Now
          </button>
        ) : (
          <button type="button" className="tp-pdm-sticky-cta tp-pdm-sticky-preorder" disabled>
            Pre-Order
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsMobile;
