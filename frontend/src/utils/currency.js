/**
 * Currency utility functions for Naira (NGN)
 */

/**
 * Format a number as Nigerian Naira currency
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string (e.g., "₦1,234.56")
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₦0.00';
  }
  
  const numAmount = Number(amount);
  return `₦${numAmount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format a number as Nigerian Naira currency without symbol (for calculations)
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string (e.g., "1,234.56")
 */
export const formatAmount = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  
  const numAmount = Number(amount);
  return numAmount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Get currency symbol
 * @returns {string} Currency symbol (₦)
 */
export const getCurrencySymbol = () => {
  return '₦';
};

/**
 * Get currency code
 * @returns {string} Currency code (NGN)
 */
export const getCurrencyCode = () => {
  return 'NGN';
};
