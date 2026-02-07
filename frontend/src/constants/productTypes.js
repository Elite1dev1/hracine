// Product Types Configuration
// This is the single source of truth for all product types in the application

export const PRODUCT_TYPES = [
  { value: 'cleanse', label: 'Cleanse' },
  { value: 'treatments', label: 'Conditioners & Treatments' },
  { value: 'daily_moisture', label: 'Leave-In & Daily Moisture' },
  { value: 'sealants', label: 'Butters & Sealants' },
  { value: 'scalp_care', label: 'Scalp & Growth Oils' },
  { value: 'ritual_sets', label: 'Ritual Sets & Bundles' },
];


// Helper function to get product type label by value
export const getProductTypeLabel = (value) => {
  const type = PRODUCT_TYPES.find(t => t.value === value);
  return type ? type.label : value;
};

// Helper function to check if a product type is valid
export const isValidProductType = (value) => {
  return PRODUCT_TYPES.some(t => t.value === value);
};

// Get all product type values as an array
export const getProductTypeValues = () => {
  return PRODUCT_TYPES.map(t => t.value);
};
