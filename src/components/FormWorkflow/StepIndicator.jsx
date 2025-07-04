import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

/**
 * Reusable StepIndicator component for multi-step workflows
 * @param {Object} props - Component props
 * @param {Array} props.steps - Array of step objects with label and path
 * @param {string} props.basePath - Base path for navigation (optional)
 * @param {string} props.className - Additional classes for the container (optional)
 * @param {function} props.getStepPath - Custom function to generate step paths (optional)
 */
const StepIndicator = ({ 
  steps, 
  basePath = '', 
  className = '',
  getStepPath = (basePath, stepPath) => `${basePath}/${stepPath}`
}) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const current = steps.findIndex((s) => currentPath.includes(s.path));

  return (
    <div className={`font-inter font-medium flex items-center gap-4 ${className}`}>
      {steps.map((step, idx) => {
        const completed = idx < current;
        const active = idx === current;
        return (
          <Fragment key={step.path}>
            <Link
              to={completed ? getStepPath(basePath, step.path) : '#'}
              className={`flex items-center gap-2 whitespace-nowrap ${idx > 0 && idx !== steps.length && 'w-full'}`}
            >
              <div className={`${idx > 0 && idx !== steps.length && 'flex-1'} flex items-center`}>
                {idx > 0 && idx !== steps.length && (
                  <div className={`w-[41px] h-0.5 bg-neu-light-3 ${active || completed ? 'bg-pri-norm-2' : ''}`} />
                )}
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
          </Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
