import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const steps = [
  { label: 'Describe the Job', path: 'describe' },
  { label: 'Time & Location', path: 'time-location' },
  { label: 'Review & Post', path: 'review' },
];

const StepIndicator = () => {
  const location = useLocation();
  const current = steps.findIndex((s) => location.pathname.includes(s.path));

  return (
     <div className="font-inter font-medium  flex items-center gap-4 mb-8 overflow-x-auto">
      {steps.map((step, idx) => {
        const completed = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={step.path}>
            <Link to={completed ? step.path : '#'} className={`flex items-center gap-2 whitespace-nowrap ${idx > 0 && idx !== steps.length && 'w-full'}`}>
            <div className={` ${idx > 0 && idx !== steps.length && 'flex-1'} flex items-center`}>
            {idx > 0 && idx !== steps.length && <div className={`w-[41px] h-0.5 bg-neu-light-3 ${active || completed ? 'bg-pri-norm-2' : ''}`} />}
            <span
  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all
    ${
      completed 
        ? 'bg-pri-norm-1 text-white border-pri-norm-1'
        : active 
          ? 'border-pri-norm-1 text-pri-norm-1'
          : 'border-neu-light-3 text-neu-dark-1'
    }`}
>
                {completed ? <Check size={22} /> : idx + 1}
              </span>
            </div>
              <span className="text-sm font-medium text-neu-dark-1">{step.label}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const PostJobLayout = () => (
  <>
    <div className="flex items-center justify-between">
        <div className="sm:w-[248px]">
        <h1 className="font-manrope text-2xl font-semibold text-gray-900 mb-1">Post a Job</h1>
        <p className="text-neu-dark-1 mb-6">Describe the service you need</p>
        </div>
        <div className="w-min-[579px]">
    <StepIndicator />
        </div>
    </div>
    <Outlet />
  </>
);

export default PostJobLayout;
