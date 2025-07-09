import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { use } from 'react'


const BASE_URL = 'https://kontractor.bsite.net'
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://distrolink-001-site1.anytempurl.com',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Post', 'Auth'],
  endpoints: (builder) => ({
     // Authentication endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/Auth/login',
        method: 'POST',
        body: credentials,
      }),
      providesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/api/Auth/register',
        method: 'POST',
        body: userData,
      }),
      providesTags: ['Auth'],
    }),
    validateEmail: builder.mutation({
      query: (userData) => ({
        url: '/api/Auth/validate-email',
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json', 
        },
      }),
      providesTags: ['Auth'],
    }),
    confirmEmail: builder.mutation({
      query: (userData) => ({
        url: '/api/Auth/confirm-email-validation',
        method: 'POST',
        body: userData,
      }),
      providesTags: ['Auth'],
    }),
    // Update user
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/api/users/${id}/update`,
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json', 
        },
      }),
      providesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    // Get users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    // Get single user
    getUserEmail: builder.query({
      query: (email) => `/api/Users/by-email?email=${email}`,
      providesTags: ['User'],
    }),
    // Create user
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,  
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRegisterMutation,
  useValidateEmailMutation,
  useConfirmEmailMutation,
  useGetUserEmailQuery,
} = apiSlice