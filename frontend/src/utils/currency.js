/** Format a value as Nigerian Naira. */
export const formatCurrency = (amount, decimals = 2) => {
  const value = Number(amount);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
};

/** Format a number without a currency symbol. */
export const formatAmount = (amount, decimals = 2) => {
  const value = Number(amount);
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
};

export const getCurrencySymbol = () => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
}).formatToParts(0).find((part) => part.type === 'currency')?.value || 'NGN';

export const getCurrencyCode = () => 'NGN';
