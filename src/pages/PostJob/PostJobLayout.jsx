import React from 'react';
import { Outlet } from 'react-router-dom';
import { StepIndicator } from '../../components/FormWorkflow';

const steps = [
  { label: 'Describe the Job', path: 'describe' },
  { label: 'Time & Location', path: 'time-location' },
  { label: 'Review & Post', path: 'review' }
];

// Custom function to generate path for step navigation
const getStepPath = (basePath, stepPath) => {
  return `${basePath}/${stepPath}`;
};

const PostJobLayout = () => (
  <>
    <div className="flex items-center justify-between">
      <div className="sm:w-[248px]">
        <h1 className="font-manrope text-2xl font-semibold text-gray-900 mb-1">Post a Job</h1>
        <p className="text-neu-dark-1 mb-6">Describe the service you need</p>
      </div>
      <div className="w-min-[579px]">
        <StepIndicator 
          steps={steps}
          basePath="/post-job"
          getStepPath={getStepPath}
          className="mb-8 overflow-x-auto"
        />
      </div>
    </div>
    <Outlet />
  </>
);

export default PostJobLayout;
