import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.accessToken; // use token from auth slice
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users", "Posts"],
  endpoints: (builder) => ({
    // GET ALL USERS
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // UPDATE USER ROLE
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    // TOGGLE BLOCK USER
    toggleBlockUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // GET ALL POSTS (ADMIN)
    getAllPostsAdmin: builder.query({
      query: () => "/posts",
      providesTags: ["Posts"],
    }),
  }),
});

// Export hooks automatically
export const {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useToggleBlockUserMutation,
  useGetAllPostsAdminQuery,
} = adminApi;
