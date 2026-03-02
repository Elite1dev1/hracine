import React from "react";
import { useRouter } from "next/router";
import { formatCurrency } from "@/utils/currency";

const MobileFilterChips = ({ onRemoveFilter }) => {
  const router = useRouter();
  const { query } = router;

  const activeFilters = [];

  // Category filter
  if (query.category) {
    activeFilters.push({
      key: "category",
      value: query.category,
      label: query.category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    });
  }

  // Subcategory filter
  if (query.subCategory) {
    activeFilters.push({
      key: "subCategory",
      value: query.subCategory,
      label: query.subCategory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    });
  }

  // Status filter
  if (query.status) {
    const statusLabels = {
      "on-sale": "On Sale",
      "in-stock": "In Stock",
    };
    activeFilters.push({
      key: "status",
      value: query.status,
      label: statusLabels[query.status] || query.status,
    });
  }

  // Price filter (if we have min/max in query)
  if (query.minPrice || query.maxPrice) {
    const minPrice = query.minPrice ? formatCurrency(Number(query.minPrice)) : formatCurrency(0);
    const maxPrice = query.maxPrice
      ? formatCurrency(Number(query.maxPrice))
      : "Any";
    activeFilters.push({
      key: "price",
      value: `${query.minPrice || 0}-${query.maxPrice || ""}`,
      label: `${minPrice} - ${maxPrice}`,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemove = (filter) => {
    if (onRemoveFilter) {
      onRemoveFilter(filter);
    } else {
      // Default behavior: remove from query
      const newQuery = { ...query };
      delete newQuery[filter.key];
      if (filter.key === "price") {
        delete newQuery.minPrice;
        delete newQuery.maxPrice;
      }
      router.push(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { scroll: false }
      );
    }
  };

  return (
    <div className="tp-mobile-filter-chips">
      {activeFilters.map((filter, index) => (
        <div key={`${filter.key}-${index}`} className="tp-mobile-filter-chip">
          <span className="tp-mobile-filter-chip-label">{filter.label}</span>
          <button
            type="button"
            onClick={() => handleRemove(filter)}
            className="tp-mobile-filter-chip-remove"
            aria-label={`Remove ${filter.label} filter`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MobileFilterChips;
