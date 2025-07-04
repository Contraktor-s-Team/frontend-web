import { configureStore } from '@reduxjs/toolkit';
import jobPostReducer from './slices/jobPostSlice';
import hireArtisanReducer from './slices/hireArtisanSlice';

export const store = configureStore({
  reducer: {
    jobPost: jobPostReducer,
    hireArtisan: hireArtisanReducer,
  },
});
