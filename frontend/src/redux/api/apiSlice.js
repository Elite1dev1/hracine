import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "@/utils/apiConfig";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: async (headers, { getState, endpoint }) => {
      try {
        // Check for admin token first (for admin endpoints)
        const adminInfo = Cookies.get('adminInfo');
        if (adminInfo) {
          const admin = JSON.parse(adminInfo);
          if (admin?.accessToken) {
            headers.set("Authorization", `Bearer ${admin.accessToken}`);
            return headers;
          }
        }
        // Fallback to user token
        const userInfo = Cookies.get('userInfo');
        if (userInfo) {
          const user = JSON.parse(userInfo);
          if (user?.accessToken) {
            headers.set("Authorization", `Bearer ${user.accessToken}`);
          }
        }
      } catch (error) {
        console.error('Error parsing auth info:', error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["Products","Coupon","Product","RelatedProducts","UserOrder","UserOrders","ProductType","OfferProducts","PopularProducts","TopRatedProducts","DashboardStats","AdminProducts","AdminReviews","AdminCategories","AdminBrands","AdminUsers","AdminUser","AdminOrders","AdminOrder","AdminBlogs","AdminSettings","Settings","Consultations","Consultation","PublishedBlogs","Blog","FeaturedBlogs","BlogComments"]
});
