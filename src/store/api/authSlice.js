import { createSlice } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addMatcher(
        apiSlice.endpoints.login.matchPending,
        (state) => {
          state.isLoading = true
          state.error = null
        }
      )
      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, action) => {
          state.isLoading = false
          state.user = action.payload.user
          state.token = action.payload.token
          state.isAuthenticated = true
          localStorage.setItem('token', action.payload.token)
        }
      )
      .addMatcher(
        apiSlice.endpoints.login.matchRejected,
        (state, action) => {
          state.isLoading = false
          state.error = action.payload?.message || action.error?.message || 'Login failed'
        }
      )
      // Register cases
      .addMatcher(
        apiSlice.endpoints.register.matchPending,
        (state) => {
          state.isLoading = true
          state.error = null
        }
      )
      .addMatcher(
        apiSlice.endpoints.register.matchFulfilled,
        (state, action) => {
          state.isLoading = false
          // Option 1: Auto-login after registration
          if (action.payload.token) {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            localStorage.setItem('token', action.payload.token)
          }
          // Option 2: Just show success, require separate login
          // state.user = null
          // state.isAuthenticated = false
        }
      )
      .addMatcher(
        apiSlice.endpoints.register.matchRejected,
        (state, action) => {
          state.isLoading = false
          state.error = action.payload?.message || action.error?.message || 'Registration failed'
        }
      )
      // Logout cases
      .addMatcher(
        apiSlice.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null
          state.token = null
          state.isAuthenticated = false
          state.error = null
          localStorage.removeItem('token')
        }
      )
  },
})

export const { clearError, clearAuth, updateUser } = authSlice.actions
export default authSlice.reducer