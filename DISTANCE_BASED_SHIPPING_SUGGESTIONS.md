# Distance-Based Shipping Cost Calculation - Implementation Suggestions

This document outlines various approaches to accurately calculate shipping costs based on distance for your e-commerce platform.

## 1. **Google Maps Distance Matrix API** (Recommended)

### Overview
Google Maps Distance Matrix API provides accurate distance and travel time calculations between multiple origins and destinations.

### Implementation Steps:
1. **Get API Key**: Obtain a Google Maps API key from Google Cloud Console
2. **Store Warehouse/Store Location**: Save your warehouse/store coordinates in the database
3. **Calculate Distance**: When user enters shipping address, use their coordinates to calculate distance
4. **Calculate Cost**: Apply cost per kilometer/mile based on distance

### Code Example:
```javascript
// Backend route to calculate shipping cost
const axios = require('axios');

const calculateShippingCost = async (userAddress, storeLocation) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${storeLocation.lat},${storeLocation.lng}&destinations=${userAddress.lat},${userAddress.lng}&key=${apiKey}`;
  
  const response = await axios.get(url);
  const distance = response.data.rows[0].elements[0].distance.value; // in meters
  const distanceKm = distance / 1000;
  
  // Calculate cost: base cost + (distance * cost per km)
  const baseCost = 50; // ₦50 base shipping
  const costPerKm = 5; // ₦5 per kilometer
  const shippingCost = baseCost + (distanceKm * costPerKm);
  
  return {
    distance: distanceKm,
    cost: Math.round(shippingCost),
    duration: response.data.rows[0].elements[0].duration.text
  };
};
```

### Pros:
- Highly accurate distance calculations
- Real-time traffic data available
- Multiple delivery modes (driving, walking, transit)
- Well-documented API

### Cons:
- Requires API key and billing account
- Costs per request (but has free tier)
- Requires geocoding user addresses

---

## 2. **Mapbox Distance API**

### Overview
Mapbox provides similar distance calculation services with competitive pricing.

### Implementation:
```javascript
const axios = require('axios');

const calculateShippingWithMapbox = async (userCoords, storeCoords) => {
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${storeCoords.lng},${storeCoords.lat};${userCoords.lng},${userCoords.lat}?access_token=${accessToken}`;
  
  const response = await axios.get(url);
  const distance = response.data.routes[0].distance / 1000; // convert to km
  // Calculate shipping cost based on distance
};
```

### Pros:
- Competitive pricing
- Good for high-volume usage
- Open-source friendly

### Cons:
- Less popular than Google Maps
- Smaller community

---

## 3. **Postal Code / ZIP Code Based Zones**

### Overview
Create delivery zones based on postal codes and assign fixed shipping costs per zone.

### Implementation Steps:
1. **Create Zone Database**: Store postal codes and their corresponding zones
2. **Zone Pricing**: Assign shipping costs to each zone
3. **Lookup**: When user enters postal code, lookup zone and return cost

### Database Schema:
```javascript
// Zone Model
const zoneSchema = {
  name: String, // e.g., "Lagos Mainland", "Lagos Island"
  postalCodes: [String], // Array of postal codes
  shippingCost: Number, // Fixed cost for this zone
  estimatedDays: Number // Delivery time
};

// Usage
const getShippingByPostalCode = async (postalCode) => {
  const zone = await Zone.findOne({ 
    postalCodes: { $in: [postalCode] } 
  });
  return zone ? zone.shippingCost : defaultShippingCost;
};
```

### Pros:
- Simple to implement
- No API costs
- Predictable pricing
- Fast lookups

### Cons:
- Less accurate (same cost for all addresses in zone)
- Requires manual zone management
- May not reflect actual distance

---

## 4. **Haversine Formula (Simple Distance Calculation)**

### Overview
Calculate straight-line distance between two coordinates using mathematical formula.

### Implementation:
```javascript
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

// Calculate shipping cost
const calculateShippingCost = (distance) => {
  const baseCost = 50;
  const costPerKm = 5;
  return baseCost + (distance * costPerKm);
};
```

### Pros:
- No API costs
- Fast calculation
- No external dependencies

### Cons:
- Calculates straight-line distance (not road distance)
- Less accurate for actual delivery routes
- Doesn't account for traffic or road conditions

---

## 5. **Third-Party Logistics (3PL) Integration**

### Overview
Integrate with delivery service providers (e.g., GIG Logistics, DHL, FedEx) that provide shipping cost APIs.

### Implementation:
```javascript
// Example: GIG Logistics API integration
const calculateGIGShipping = async (origin, destination, weight) => {
  const response = await axios.post('https://api.giglogistics.com/calculate', {
    origin,
    destination,
    weight,
    serviceType: 'standard'
  });
  
  return {
    cost: response.data.shippingCost,
    estimatedDays: response.data.deliveryDays,
    trackingAvailable: true
  };
};
```

### Pros:
- Accurate real-world pricing
- Handles actual delivery
- Tracking included
- Professional service

### Cons:
- Requires partnership with 3PL
- Less control over pricing
- API integration complexity

---

## 6. **Hybrid Approach (Recommended for Your Use Case)**

### Recommended Implementation:
Combine multiple methods for best results:

1. **Use Postal Code Zones** for quick, predictable pricing
2. **Use Google Maps API** for accurate distance when needed
3. **Apply Distance-Based Pricing** with tiered costs

### Implementation Structure:
```javascript
// Settings Model Extension
const settingsSchema = {
  freeShippingThreshold: Number,
  baseShippingCost: Number, // Base cost for all deliveries
  costPerKm: Number, // Cost per kilometer
  maxShippingCost: Number, // Maximum shipping cost cap
  deliveryZones: [{
    name: String,
    postalCodes: [String],
    fixedCost: Number, // Override distance-based for specific zones
    useDistanceBased: Boolean
  }]
};

// Shipping Calculation Logic
const calculateShipping = async (userAddress, cartTotal) => {
  // Check if qualifies for free shipping
  const settings = await Settings.getSettings();
  if (cartTotal >= settings.freeShippingThreshold) {
    return { cost: 0, method: 'free' };
  }
  
  // Check if address is in a fixed-cost zone
  const zone = await findZoneByPostalCode(userAddress.postalCode);
  if (zone && !zone.useDistanceBased) {
    return { cost: zone.fixedCost, method: 'zone' };
  }
  
  // Calculate distance-based cost
  const distance = await calculateDistance(storeLocation, userAddress);
  const cost = Math.min(
    settings.baseShippingCost + (distance * settings.costPerKm),
    settings.maxShippingCost
  );
  
  return { cost: Math.round(cost), method: 'distance', distance };
};
```

---

## Implementation Recommendations for Your Platform

### Phase 1: Quick Implementation (Postal Code Zones)
1. Add postal code zones to Settings model
2. Create admin interface to manage zones
3. Implement zone-based shipping calculation
4. **Time**: 2-3 days

### Phase 2: Enhanced Accuracy (Google Maps Integration)
1. Integrate Google Maps Geocoding API
2. Add distance calculation using Distance Matrix API
3. Implement distance-based pricing
4. **Time**: 1 week

### Phase 3: Advanced Features
1. Multiple delivery options (standard, express, same-day)
2. Real-time tracking integration
3. Delivery time estimates
4. **Time**: 2-3 weeks

---

## Cost Considerations

### Google Maps API Pricing (as of 2024):
- **Free Tier**: $200 credit/month
- **Distance Matrix API**: $5 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests
- **Estimated Monthly Cost**: $50-200 for medium traffic

### Alternative: Use Cached Results
- Cache distance calculations for postal codes
- Reduce API calls significantly
- Update cache periodically

---

## Security Considerations

1. **API Key Protection**: Store API keys in environment variables
2. **Rate Limiting**: Implement rate limiting on shipping calculation endpoints
3. **Input Validation**: Validate and sanitize user addresses
4. **Cost Limits**: Set maximum shipping cost to prevent abuse

---

## Next Steps

1. **Decide on Approach**: Choose postal code zones (quick) or API-based (accurate)
2. **Update Settings Model**: Add shipping configuration fields
3. **Create Admin Interface**: Allow admins to configure zones and pricing
4. **Implement Calculation**: Add shipping cost calculation to checkout
5. **Test Thoroughly**: Test with various addresses and scenarios

---

## Example API Endpoints to Add

```javascript
// Get shipping cost estimate
POST /api/shipping/calculate
Body: { address, postalCode, cartTotal }
Response: { cost, method, estimatedDays }

// Get available shipping methods
GET /api/shipping/methods
Response: [{ name, cost, estimatedDays }]
```

---

## Additional Resources

- [Google Maps Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)
- [Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- [Nigeria Postal Codes Database](https://www.nipost.gov.ng/)
