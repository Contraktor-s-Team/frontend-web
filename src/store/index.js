import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import authReducer from './api/authSlice'
import jobPostReducer from '../redux/slices/jobPostSlice';
import hireArtisanReducer from '../redux/slices/hireArtisanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobPost: jobPostReducer,
    hireArtisan: hireArtisanReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch