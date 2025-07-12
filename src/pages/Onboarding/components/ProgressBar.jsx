import React from 'react';

const ProgressBar = ({ currentStep, totalSteps = 6 }) => {
  return (
    <div className="flex gap-2 mb-[37px] xl:mb-[61px]">
      {[...Array(totalSteps)].map((_, index) => (
        <div 
          key={index}
          className={`w-100/5 h-1.5 ${currentStep >= index + 1 ? "bg-blue-500" : "bg-gray-200"} rounded`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressBar;
