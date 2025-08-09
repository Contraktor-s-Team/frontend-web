import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  jobTitle: '',
  category: '',
  description: '',
  photos: [null, null, null, null],
  fileUrls: [null, null, null, null],
  fileTypes: [null, null, null, null],
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

function jobPostReducer(state, action) {
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
    case 'UPDATE_DATE':
      return { ...state, date: action.payload };
    case 'UPDATE_TIME':
      return { ...state, time: action.payload };
    case 'UPDATE_URGENT':
      return { ...state, urgent: action.payload };
    case 'UPDATE_ADDRESS':
      return { ...state, address: { ...state.address, ...action.payload } };
    default:
      return state;
  }
}

const JobPostContext = createContext();

export function JobPostProvider({ children }) {
  const [state, dispatch] = useReducer(jobPostReducer, initialState);
  return <JobPostContext.Provider value={{ state, dispatch }}>{children}</JobPostContext.Provider>;
}

export function useJobPost() {
  const context = useContext(JobPostContext);
  if (!context) {
    throw new Error('useJobPost must be used within a JobPostProvider');
  }
  return context;
}
