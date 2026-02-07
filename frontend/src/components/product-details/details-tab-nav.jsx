import React, { useRef, useEffect } from 'react';
import ReviewForm from '../forms/review-form';
import ReviewItem from './review-item';

const DetailsTabNav = ({ product }) => {
  const {_id, description, additionalInformation, reviews } = product || {};
  const activeRef = useRef(null)
  const marker = useRef(null);
  // handleActive
  const handleActive = (e) => {
    if (e.target.classList.contains('active')) {
      marker.current.style.left = e.target.offsetLeft + "px";
      marker.current.style.width = e.target.offsetWidth + "px";
    }
  }
  useEffect(() => {
    if (activeRef.current?.classList.contains('active')) {
      marker.current.style.left = activeRef.current.offsetLeft + 'px';
      marker.current.style.width = activeRef.current.offsetWidth + 'px';
    }
  }, []);
  // nav item
  function NavItem({ active = false, id, title, linkRef }) {
    return (
      <button
        ref={linkRef}
        className={`nav-link ${active ? "active" : ""}`}
        id={`nav-${id}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#nav-${id}`}
        type="button"
        role="tab"
        aria-controls={`nav-${id}`}
        aria-selected={active ? "true" : "false"}
        tabIndex="-1"
        onClick={e => handleActive(e)}
      >
        {title}
      </button>
    );
  }

  return (
    <>
      <div className="tp-product-details-tab-nav tp-tab">
        <nav>
          <div className="nav nav-tabs justify-content-center p-relative tp-product-tab" id="navPresentationTab" role="tablist">
            <NavItem active={true} linkRef={activeRef} id="desc" title="Description" />
            <NavItem id="howtouse" title="How to Use" />
            <NavItem id="ingredients" title="Ingredients" />
            <NavItem id="additional" title="Key Benefits" />
            <NavItem id="review" title={`Reviews (${reviews.length})`} />

            <span ref={marker} id="productTabMarker" className="tp-product-details-tab-line"></span>
          </div>
        </nav>
        <div className="tab-content" id="navPresentationTabContent">
          {/* nav-desc */}
          <div className="tab-pane fade show active" id="nav-desc" role="tabpanel" aria-labelledby="nav-desc-tab" tabIndex="-1">
            <div className="tp-product-details-desc-wrapper pt-60">
              <div className="row">
                <div className="col-xl-12">
                  <div className="tp-product-details-desc-item">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="tp-product-details-desc-content">
                          {description ? (
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B', whiteSpace: 'pre-line' }}>
                              {description}
                            </p>
                          ) : (
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B', fontStyle: 'italic' }}>
                              No description available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* how to use */}
          <div className="tab-pane fade" id="nav-howtouse" role="tabpanel" aria-labelledby="nav-howtouse-tab" tabIndex="-1">
            <div className="tp-product-details-desc-wrapper pt-60">
              <div className="row">
                <div className="col-xl-12">
                  <div className="tp-product-details-desc-item">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="tp-product-details-desc-content">
                          <h4 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>How to Use</h4>
                          {product?.howToUse ? (
                            <div>
                              {Array.isArray(product.howToUse) ? (
                                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                                  {product.howToUse.map((step, i) => (
                                    <li key={i} style={{ marginBottom: '10px', fontSize: '16px', color: '#55585B' }}>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B', whiteSpace: 'pre-line' }}>
                                  {product.howToUse}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B', fontStyle: 'italic' }}>
                              No usage instructions available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ingredients */}
          <div className="tab-pane fade" id="nav-ingredients" role="tabpanel" aria-labelledby="nav-ingredients-tab" tabIndex="-1">
            <div className="tp-product-details-desc-wrapper pt-60">
              <div className="row">
                <div className="col-xl-12">
                  <div className="tp-product-details-desc-item">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="tp-product-details-desc-content">
                          <h4 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>Ingredients</h4>
                          {product?.ingredients ? (
                            <div>
                              {Array.isArray(product.ingredients) ? (
                                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B' }}>
                                  {product.ingredients.join(', ')}
                                </p>
                              ) : (
                                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B', whiteSpace: 'pre-line' }}>
                                  {product.ingredients}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B', fontStyle: 'italic' }}>
                              No ingredients information available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Key Benefits */}
          <div className="tab-pane fade" id="nav-additional" role="tabpanel" aria-labelledby="nav-additional-tab" tabIndex="-1">
            <div className="tp-product-details-desc-wrapper pt-60">
              <div className="row">
                <div className="col-xl-12">
                  <div className="tp-product-details-desc-item">
                    <div className="row align-items-center">
                      <div className="col-lg-12">
                        <div className="tp-product-details-desc-content">
                          <h4 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>Key Benefits</h4>
                          {product?.keyBenefits && product.keyBenefits.length > 0 ? (
                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', listStyle: 'none' }}>
                              {product.keyBenefits.map((benefit, i) => (
                                <li key={i} style={{ marginBottom: '12px', fontSize: '16px', color: '#55585B', position: 'relative', paddingLeft: '25px' }}>
                                  <span style={{ position: 'absolute', left: 0, color: '#C47070', fontSize: '20px', lineHeight: '1' }}>•</span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#55585B', fontStyle: 'italic' }}>
                              No key benefits information available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* review */}
          <div className="tab-pane fade" id="nav-review" role="tabpanel" aria-labelledby="nav-review-tab" tabIndex="-1">
            <div className="tp-product-details-review-wrapper pt-60">
              <div className="row">
                <div className="col-lg-6">
                  <div className="tp-product-details-review-statics">

                    {/* reviews */}
                    <div className="tp-product-details-review-list pr-110">
                      <h3 className="tp-product-details-review-title">Rating & Review</h3>
                      {reviews.length === 0 && <h3 className="tp-product-details-review-title">
                        There are no reviews yet.
                      </h3>
                      }
                      {reviews.length > 0 && reviews.map(item => (
                        <ReviewItem key={item._id} review={item} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="tp-product-details-review-form">
                    <h3 className="tp-product-details-review-form-title">Review this product</h3>
                    <p>Your email address will not be published. Required fields are marked *</p>
                    {/* form start */}
                    <ReviewForm product_id={_id} />
                    {/* form end */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsTabNav;