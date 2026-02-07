import { apiSlice } from "../api/apiSlice";

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all published blogs
    getPublishedBlogs: builder.query({
      query: () => `/api/blog/published`,
      providesTags: ["PublishedBlogs"],
    }),
    // Get single blog by ID
    getSingleBlog: builder.query({
      query: (id) => `/api/blog/${id}`,
      providesTags: (result, error, arg) => [{ type: "Blog", id: arg }],
    }),
    // Get featured blogs
    getFeaturedBlogs: builder.query({
      query: () => `/api/blog/published`,
      providesTags: ["FeaturedBlogs"],
      transformResponse: (response) => {
        if (response?.data) {
          return response.data.filter((blog) => blog.featured === true);
        }
        return [];
      },
    }),
    // Get blog comments
    getBlogComments: builder.query({
      query: (blogId) => `/api/blog-comment/blog/${blogId}`,
      providesTags: (result, error, arg) => [{ type: "BlogComments", id: arg }],
    }),
    // Add blog comment
    addBlogComment: builder.mutation({
      query: (data) => ({
        url: "/api/blog-comment/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "BlogComments", id: arg.blogId },
      ],
    }),
  }),
});

export const {
  useGetPublishedBlogsQuery,
  useGetSingleBlogQuery,
  useGetFeaturedBlogsQuery,
  useGetBlogCommentsQuery,
  useAddBlogCommentMutation,
} = blogApi;
