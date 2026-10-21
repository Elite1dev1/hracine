const toValidDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? false : date;
};

const roundCurrency = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

/**
 * Returns the authoritative client-side product price used by cards, cart,
 * checkout and product details. A missing offer window means the percentage
 * discount is always active, matching the existing admin behaviour.
 */
export const getProductPricing = (product, now = new Date()) => {
  const parsedPrice = Number(product?.price);
  const originalPrice = Number.isFinite(parsedPrice) && parsedPrice >= 0
    ? parsedPrice
    : 0;
  const parsedDiscount = Number(product?.discount);
  const discountPercentage = Number.isFinite(parsedDiscount)
    ? parsedDiscount
    : 0;

  const startDate = toValidDate(product?.offerDate?.startDate);
  const endDate = toValidDate(product?.offerDate?.endDate);
  const comparisonDate = now instanceof Date ? now : new Date(now);
  const comparisonTime = comparisonDate.getTime();
  const hasInvalidWindow = startDate === false || endDate === false || Number.isNaN(comparisonTime);
  const hasStarted = !startDate || startDate.getTime() <= comparisonTime;
  const hasNotExpired = !endDate || endDate.getTime() >= comparisonTime;
  const isExplicitlyInactive = product?.discountActive === false || product?.isDiscountActive === false;

  const hasDiscount =
    originalPrice > 0 &&
    discountPercentage > 0 &&
    discountPercentage <= 100 &&
    !hasInvalidWindow &&
    hasStarted &&
    hasNotExpired &&
    !isExplicitlyInactive;

  const salePrice = hasDiscount
    ? roundCurrency(originalPrice * (1 - discountPercentage / 100))
    : originalPrice;

  return {
    originalPrice,
    salePrice,
    hasDiscount,
    discountPercentage: hasDiscount ? discountPercentage : 0,
  };
};

export const formatDiscountPercentage = (discountPercentage) => {
  const value = Number(discountPercentage);
  if (!Number.isFinite(value)) return '0';
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
};

