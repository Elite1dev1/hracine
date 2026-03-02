import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import InputRange from "@/ui/input-range";
import { formatCurrency } from "@/utils/currency";

const MobileFilterModal = ({ all_products, otherProps, onApplyFilters }) => {
  const { priceFilterValues, setCurrPage } = otherProps;
  const { filterSidebar } = useSelector((state) => state.shopFilter);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;

  // Local state for draft filters (not applied until Apply is clicked)
  const [draftPrice, setDraftPrice] = useState(priceFilterValues.priceValue);
  const [draftStatus, setDraftStatus] = useState(query.status || "");
  const [draftCategory, setDraftCategory] = useState(query.category || "");

  // Initialize draft filters from current query
  useEffect(() => {
    if (filterSidebar) {
      setDraftPrice(priceFilterValues.priceValue);
      setDraftStatus(query.status || "");
      setDraftCategory(query.category || "");
    }
  }, [filterSidebar, query, priceFilterValues.priceValue]);

  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  const handlePriceChange = (val) => {
    setDraftPrice(val);
  };

  const handleApplyFilters = () => {
    const newQuery = { ...query };

    // Apply price filter
    if (draftPrice[0] > 0 || draftPrice[1] < maxPrice) {
      newQuery.minPrice = draftPrice[0].toString();
      newQuery.maxPrice = draftPrice[1].toString();
    } else {
      delete newQuery.minPrice;
      delete newQuery.maxPrice;
    }

    // Apply status filter
    if (draftStatus) {
      newQuery.status = draftStatus;
    } else {
      delete newQuery.status;
    }

    // Apply category filter
    if (draftCategory) {
      newQuery.category = draftCategory;
    } else {
      delete newQuery.category;
    }
    delete newQuery.brand;

    setCurrPage(1);
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { scroll: false }
    );

    dispatch(handleFilterSidebarClose());
    
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  const handleResetFilters = () => {
    setDraftPrice([0, maxPrice]);
    setDraftStatus("");
    setDraftCategory("");
  };

  const handleClose = () => {
    dispatch(handleFilterSidebarClose());
  };

  if (!filterSidebar) return null;

  return (
    <>
      <div className="tp-mobile-filter-overlay" onClick={handleClose} />
      <div className="tp-mobile-filter-modal">
        <div className="tp-mobile-filter-header">
          <h3>Filters</h3>
          <button
            type="button"
            onClick={handleClose}
            className="tp-mobile-filter-close"
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="tp-mobile-filter-content">
          {/* Price Filter */}
          <div className="tp-mobile-filter-section">
            <h4 className="tp-mobile-filter-section-title">Price Range</h4>
            <div className="tp-mobile-filter-price">
              <div className="tp-mobile-filter-price-slider">
                <InputRange
                  STEP={1}
                  MIN={0}
                  MAX={maxPrice}
                  values={draftPrice}
                  handleChanges={handlePriceChange}
                />
              </div>
              <div className="tp-mobile-filter-price-display">
                {formatCurrency(draftPrice[0])} - {formatCurrency(draftPrice[1])}
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="tp-mobile-filter-section">
            <h4 className="tp-mobile-filter-section-title">Product Status</h4>
            <div className="tp-mobile-filter-checkboxes">
              <label className="tp-mobile-filter-checkbox">
                <input
                  type="checkbox"
                  checked={draftStatus === "on-sale"}
                  onChange={(e) =>
                    setDraftStatus(e.target.checked ? "on-sale" : "")
                  }
                />
                <span>On Sale</span>
              </label>
              <label className="tp-mobile-filter-checkbox">
                <input
                  type="checkbox"
                  checked={draftStatus === "in-stock"}
                  onChange={(e) =>
                    setDraftStatus(e.target.checked ? "in-stock" : "")
                  }
                />
                <span>In Stock</span>
              </label>
            </div>
          </div>

          {/* Categories - Simplified for mobile */}
          <div className="tp-mobile-filter-section">
            <h4 className="tp-mobile-filter-section-title">Categories</h4>
            <div className="tp-mobile-filter-scrollable">
              {/* This will be populated by CategoryFilter component logic */}
              <p className="tp-mobile-filter-note">
                Category selection will be handled by existing filter component
              </p>
            </div>
          </div>
        </div>

        <div className="tp-mobile-filter-footer">
          <button
            type="button"
            onClick={handleResetFilters}
            className="tp-mobile-filter-reset-btn"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApplyFilters}
            className="tp-mobile-filter-apply-btn"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterModal;
