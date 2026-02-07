import { apiSlice } from "../api/apiSlice";

export const consultationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Create consultation (public)
    createConsultation: builder.mutation({
      query: (data) => ({
        url: "/api/consultation",
        method: "POST",
        body: data,
      }),
    }),
    // Get all consultations (admin only)
    getAllConsultations: builder.query({
      query: () => "/api/consultation",
      providesTags: ["Consultations"],
    }),
    // Get single consultation (admin only)
    getConsultation: builder.query({
      query: (id) => `/api/consultation/${id}`,
      providesTags: (result, error, arg) => [{ type: "Consultation", id: arg }],
    }),
    // Update consultation status (admin only)
    updateConsultationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/consultation/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Consultations", "Consultation"],
    }),
    // Delete consultation (admin only)
    deleteConsultation: builder.mutation({
      query: (id) => ({
        url: `/api/consultation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Consultations"],
    }),
  }),
});

export const {
  useCreateConsultationMutation,
  useGetAllConsultationsQuery,
  useGetConsultationQuery,
  useUpdateConsultationStatusMutation,
  useDeleteConsultationMutation,
} = consultationApi;
