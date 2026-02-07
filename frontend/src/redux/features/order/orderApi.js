import { apiSlice } from "../../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // initializePayment (Paystack)
    initializePayment: builder.mutation({
      query: (data) => ({
        url: "/api/order/initialize-payment",
        method: "POST",
        body: data,
      }),
    }),
    // verifyPayment (Paystack)
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/api/order/verify-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['UserOrders'],
    }),
    // saveOrder
    saveOrder: builder.mutation({
      query: (data) => ({
        url: "/api/order/saveOrder",
        method: "POST",
        body: data,
      }),
      invalidatesTags:['UserOrders'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result) {
            localStorage.removeItem("couponInfo");
            localStorage.removeItem("cart_products");
            localStorage.removeItem("shipping_info");
          }
        } catch (err) {
          // do nothing
        }
      },

    }),
    // getUserOrders
    getUserOrders: builder.query({
      query: () => `/api/user-order`,
      providesTags:["UserOrders"],
      keepUnusedDataFor: 0, // Don't cache - always fetch fresh data
      // Force refetch to avoid 304 cached responses
      refetchOnMountOrArgChange: true,
    }),
    // getUserOrders
    getUserOrderById: builder.query({
      query: (id) => `/api/user-order/${id}`,
      providesTags: (result, error, arg) => [{ type: "UserOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentMutation,
  useSaveOrderMutation,
  useGetUserOrderByIdQuery,
  useGetUserOrdersQuery,
} = authApi;
