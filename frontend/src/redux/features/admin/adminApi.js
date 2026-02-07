import { apiSlice } from "../../api/apiSlice";
import Cookies from "js-cookie";

export const adminApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Admin Auth
    adminLogin: builder.mutation({
      query: (data) => {
        console.log('Sending login request with data:', { email: data.email, password: '***' });
        return {
          url: "/api/admin/login",
          method: "POST",
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Backend returns data directly, not wrapped in data property
          const responseData = result.data || result;
          Cookies.set(
            "adminInfo",
            JSON.stringify({
              accessToken: responseData.token,
              admin: {
                _id: responseData._id,
                name: responseData.name,
                email: responseData.email,
                role: responseData.role,
                image: responseData.image,
              },
            }),
            { expires: 1 }
          );
        } catch (err) {
          // do nothing
        }
      },
    }),

    // Dashboard Stats
    getDashboardStats: builder.query({
      query: () => "/api/admin/dashboard/stats",
      providesTags: ["DashboardStats"],
    }),

    // Products
    adminGetAllProducts: builder.query({
      query: () => "/api/product/all",
      providesTags: ["AdminProducts"],
    }),
    adminAddProduct: builder.mutation({
      query: (data) => ({
        url: "/api/product/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminProducts", "Products"],
    }),
    adminUpdateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/product/edit-product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminProducts", "Products", "Product"],
    }),
    adminDeleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminProducts", "Products"],
    }),
    adminImportProducts: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: "/api/product/import",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["AdminProducts", "Products"],
    }),

    // Categories
    adminGetAllCategories: builder.query({
      query: () => "/api/category/all",
      providesTags: ["AdminCategories"],
    }),
    // Brands
    adminGetAllBrands: builder.query({
      query: () => "/api/brand/all",
      providesTags: ["AdminBrands"],
    }),
    adminAddBrand: builder.mutation({
      query: (data) => ({
        url: "/api/brand/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminBrands"],
    }),
    adminUpdateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/brand/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminBrands"],
    }),
    adminDeleteBrand: builder.mutation({
      query: (id) => ({
        url: `/api/brand/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminBrands"],
    }),

    // Categories
    adminAddCategory: builder.mutation({
      query: (data) => ({
        url: "/api/category/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminCategories"],
    }),
    adminUpdateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/category/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminCategories"],
    }),
    adminDeleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminCategories"],
    }),

    // Users
    adminGetAllUsers: builder.query({
      query: () => "/api/admin/users/all",
      providesTags: ["AdminUsers"],
    }),
    adminGetSingleUser: builder.query({
      query: (id) => `/api/admin/users/${id}`,
      providesTags: (result, error, arg) => [{ type: "AdminUser", id: arg }],
    }),
    adminUpdateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/admin/users/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdminUsers", "AdminUser"],
    }),
    adminUpdateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/admin/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminUsers", "AdminUser"],
    }),

    // Orders
    adminGetAllOrders: builder.query({
      query: () => "/api/admin/orders/all",
      providesTags: ["AdminOrders"],
    }),
    adminGetSingleOrder: builder.query({
      query: (id) => `/api/order/${id}`,
      providesTags: (result, error, arg) => [{ type: "AdminOrder", id: arg }],
    }),
    adminUpdateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/order/update-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdminOrders", "AdminOrder"],
    }),

    // Blogs
    adminGetAllBlogs: builder.query({
      query: () => "/api/blog/all",
      providesTags: ["AdminBlogs"],
    }),
    adminAddBlog: builder.mutation({
      query: (data) => ({
        url: "/api/blog/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminBlogs"],
    }),
    adminUpdateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/blog/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminBlogs"],
    }),
    adminDeleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminBlogs"],
    }),

    // Settings
    adminGetSettings: builder.query({
      query: () => "/api/admin/settings",
      providesTags: ["AdminSettings"],
    }),
    adminUpdateSettings: builder.mutation({
      query: (data) => ({
        url: "/api/admin/settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminSettings"],
    }),

    // Public settings (for frontend to get free shipping threshold)
    getSettings: builder.query({
      query: () => "/api/settings",
      providesTags: ["Settings"],
    }),

    // Coupons
    adminGetAllCoupons: builder.query({
      query: () => "/api/coupon",
      providesTags: ["Coupon"],
    }),
    adminGetCouponById: builder.query({
      query: (id) => `/api/coupon/${id}`,
      providesTags: (result, error, arg) => [{ type: "Coupon", id: arg }],
    }),
    adminAddCoupon: builder.mutation({
      query: (data) => ({
        url: "/api/coupon/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    adminUpdateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/coupon/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    adminDeleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetDashboardStatsQuery,
  useAdminGetAllProductsQuery,
  useAdminAddProductMutation,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,
  useAdminImportProductsMutation,
  useAdminGetAllCategoriesQuery,
  useAdminAddCategoryMutation,
  useAdminUpdateCategoryMutation,
  useAdminDeleteCategoryMutation,
  useAdminGetAllUsersQuery,
  useAdminGetSingleUserQuery,
  useAdminUpdateUserStatusMutation,
  useAdminUpdateUserMutation,
  useAdminGetAllOrdersQuery,
  useAdminGetSingleOrderQuery,
  useAdminUpdateOrderStatusMutation,
  useAdminGetAllBlogsQuery,
  useAdminAddBlogMutation,
  useAdminUpdateBlogMutation,
  useAdminDeleteBlogMutation,
  useAdminGetAllBrandsQuery,
  useAdminAddBrandMutation,
  useAdminUpdateBrandMutation,
  useAdminDeleteBrandMutation,
  useAdminGetSettingsQuery,
  useAdminUpdateSettingsMutation,
  useGetSettingsQuery,
  useAdminGetAllCouponsQuery,
  useAdminGetCouponByIdQuery,
  useAdminAddCouponMutation,
  useAdminUpdateCouponMutation,
  useAdminDeleteCouponMutation,
} = adminApi;
