import React from 'react';
import { Outlet } from 'react-router-dom';
import { StepIndicator } from '../../../components/FormWorkflow';

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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
      <div className="w-full md:w-auto md:min-w-[248px]">
        <h1 className="font-manrope text-2xl font-semibold text-gray-900 mb-1">Post a Job</h1>
        <p className="text-neu-dark-1 mb-6">Describe the service you need</p>
      </div>
      <div className="w-full md:w-auto md:min-w-[300px]">
        <StepIndicator
          steps={steps}
          basePath="/customer/post-job"
          getStepPath={getStepPath}
          className="mb-4 md:mb-8 overflow-x-auto"
        />
      </div>
    </div>
    <Outlet />
  </>
);

export default PostJobLayout;
