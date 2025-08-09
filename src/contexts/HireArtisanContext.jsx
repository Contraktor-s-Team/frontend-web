import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  jobTitle: '',
  category: '',
  description: '',
  photos: [null, null, null],
  fileUrls: [null, null, null],
  fileTypes: [null, null, null],
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
  artisan: null
};

function hireArtisanReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_JOB_DATA':
      return { ...state, ...action.payload };
    case 'RESET_JOB_DATA':
      return initialState;
    case 'UPDATE_JOB_TITLE':
      return { ...state, jobTitle: action.payload };
    case 'UPDATE_CATEGORY':
      return { ...state, category: action.payload };
    case 'UPDATE_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'UPDATE_PHOTOS':
      return { ...state, photos: action.payload };
    case 'UPDATE_FILE_URLS':
      return { ...state, fileUrls: action.payload };
    case 'UPDATE_FILE_TYPES':
      return { ...state, fileTypes: action.payload };
    case 'UPDATE_DATE':
      return { ...state, date: action.payload };
    case 'UPDATE_TIME':
      return { ...state, time: action.payload };
    case 'UPDATE_URGENT':
      return { ...state, urgent: action.payload };
    case 'UPDATE_ADDRESS':
      return { ...state, address: { ...state.address, ...action.payload } };
    case 'SET_ARTISAN_DETAILS':
      return { ...state, artisan: action.payload };
    default:
      return state;
  }
}

const HireArtisanContext = createContext();

export function HireArtisanProvider({ children }) {
  const [state, dispatch] = useReducer(hireArtisanReducer, initialState);
  return <HireArtisanContext.Provider value={{ state, dispatch }}>{children}</HireArtisanContext.Provider>;
}

export function useHireArtisan() {
  const context = useContext(HireArtisanContext);
  if (!context) {
    throw new Error('useHireArtisan must be used within a HireArtisanProvider');
  }
  return context;
}
