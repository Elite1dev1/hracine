// API Configuration
// In development, use localhost. In production, use the Vercel URL
export const getApiBaseUrl = () => {
  // Priority 1: Use environment variable if set (most reliable)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Priority 2: Check if we're in the browser
  if (typeof window !== 'undefined') {
    // Client-side: check if we're on localhost
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'http://localhost:7000';
    }
    // Production (any other domain): use Vercel URL
    return 'https://shofy-backend-dlt.vercel.app';
  }
  
  // Server-side (SSR): check NODE_ENV
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:7000';
  }
  
  // Server-side production: use Vercel URL
  return 'https://shofy-backend-dlt.vercel.app';
};

// Export a function that gets called dynamically, not a static value
export const API_BASE_URL = getApiBaseUrl();
