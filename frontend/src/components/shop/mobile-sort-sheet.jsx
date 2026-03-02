import React from "react";

const MobileSortSheet = ({ isOpen, onClose, currentSort, onSortChange }) => {
  const sortOptions = [
    { value: "Default Sorting", label: "Default" },
    { value: "Low to High", label: "Price: Low to High" },
    { value: "High to Low", label: "Price: High to Low" },
    { value: "New Added", label: "Newest" },
    { value: "On Sale", label: "Most Popular" },
  ];

  const handleOptionClick = (value) => {
    onSortChange(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="tp-mobile-sort-overlay" onClick={onClose} />
      <div className="tp-mobile-sort-sheet">
        <div className="tp-mobile-sort-header">
          <h3>Sort By</h3>
          <button
            type="button"
            onClick={onClose}
            className="tp-mobile-sort-close"
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
        <div className="tp-mobile-sort-options">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className={`tp-mobile-sort-option ${
                currentSort === option.value ? "active" : ""
              }`}
            >
              <span>{option.label}</span>
              {currentSort === option.value && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.667 5L7.5 14.167 3.333 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileSortSheet;
