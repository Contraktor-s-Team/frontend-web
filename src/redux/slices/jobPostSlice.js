import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobTitle: '',
  category: '',
  description: '',
  photos: [null, null, null, null],
  fileUrls: [null, null, null, null], // For storing serializable file data like URLs or base64
  fileTypes: [null, null, null, null], // For storing file types (image/video)
  date: '',
  time: '',
  urgent: false,
  address: {
    street: '',
    landmark: '',
    city: '',
    lga: '',
    state: ''
  }
};

export const jobPostSlice = createSlice({
  name: 'jobPost',
  initialState,
  reducers: {
    updateJobData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetJobData: () => {
      return initialState;
    },
    updateJobTitle: (state, action) => {
      state.jobTitle = action.payload;
    },
    updateCategory: (state, action) => {
      state.category = action.payload;
    },
    updateDescription: (state, action) => {
      state.description = action.payload;
    },
    updatePhotos: (state, action) => {
      state.photos = action.payload;
    },
    updateDate: (state, action) => {
      state.date = action.payload;
    },
    updateTime: (state, action) => {
      state.time = action.payload;
    },
    updateUrgent: (state, action) => {
      state.urgent = action.payload;
    },
    updateAddress: (state, action) => {
      state.address = { ...state.address, ...action.payload };
    }
  },
});

export const { 
  updateJobData, 
  resetJobData, 
  updateJobTitle,
  updateCategory,
  updateDescription,
  updatePhotos,
  updateDate,
  updateTime,
  updateUrgent,
  updateAddress
} = jobPostSlice.actions;

export default jobPostSlice.reducer;
