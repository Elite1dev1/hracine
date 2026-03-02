import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";
import { Filter } from "@/svg";

const MobileFilterSortBar = ({ onFilterClick, onSortClick, activeFilterCount = 0 }) => {
  const dispatch = useDispatch();

  const handleFilterClick = () => {
    dispatch(handleFilterSidebarOpen());
    if (onFilterClick) {
      onFilterClick();
    }
  };

  return (
    <div className="tp-mobile-filter-sort-bar">
      <button
        type="button"
        onClick={handleFilterClick}
        className="tp-mobile-filter-btn"
      >
        <Filter />
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span className="tp-mobile-filter-count">{activeFilterCount}</span>
        )}
      </button>
      <button
        type="button"
        onClick={onSortClick}
        className="tp-mobile-sort-btn"
      >
        <span>Sort</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default MobileFilterSortBar;
