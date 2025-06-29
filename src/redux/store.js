import { configureStore } from '@reduxjs/toolkit';
import jobPostReducer from './slices/jobPostSlice';

export const store = configureStore({
  reducer: {
    jobPost: jobPostReducer,
  },
});
