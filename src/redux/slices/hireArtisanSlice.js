import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Form fields for job details
  jobTitle: '',
  category: '',
  description: '',
  photos: [null, null, null],
  fileUrls: [null, null, null],
  fileTypes: [null, null, null],

  // Form fields for time and location
  date: '',
  time: '',
  urgent: false,
  address: {
    street: '',
    landmark: '',
    city: '',
    lga: '',
    state: ''
  },

  // Selected artisan details
  artisan: null
};

export const hireArtisanSlice = createSlice({
  name: 'hireArtisan',
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
    updateFileUrls: (state, action) => {
      state.fileUrls = action.payload;
    },
    updateFileTypes: (state, action) => {
      state.fileTypes = action.payload;
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
    },
    setArtisanDetails: (state, action) => {
      state.artisan = action.payload;
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
  updateFileUrls,
  updateFileTypes,
  updateDate,
  updateTime,
  updateUrgent,
  updateAddress,
  setArtisanDetails
} = hireArtisanSlice.actions;

export default hireArtisanSlice.reducer;
