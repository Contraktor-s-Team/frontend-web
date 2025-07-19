import React from 'react';
import PropTypes from 'prop-types';

const AvailabilityToggle = ({ available, onChange, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-neu-dark-1 font-medium text-sm mr-4 select-none">
        Set Availability
      </span>
      <button
        onClick={() => onChange(!available)}
        className="relative flex w-[220px] h-12 rounded-full bg-neu-light-1 transition-colors"
      >
        {/* Slider Indicator */}
        <span
          className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-10 bg-white rounded-full shadow transition-all duration-300 ${
            available ? 'translate-x-0' : 'translate-x-full'
          }`}
        />

        {/* Available */}
        <div className="flex items-center justify-center w-1/2 z-10 relative">
          <span
            className={`w-2.5 h-2.5 rounded-full mr-1.5 transition-colors ${
              available ? 'bg-success-norm-1' : 'bg-neu-norm-1'
            }`}
          />
          <span
            className={`text-sm font-medium transition-colors ${
              available ? 'text-success-norm-1' : 'text-neu-norm-1'
            }`}
          >
            Available
          </span>
        </div>

        {/* Unavailable */}
        <div className="flex items-center justify-center w-1/2 z-10 relative">
          <span
            className={`text-sm font-medium transition-colors ${
              !available ? 'text-err-norm-1' : 'text-neu-norm-1'
            }`}
          >
            Unavailable
          </span>
        </div>
      </button>
    </div>
  );
};

AvailabilityToggle.propTypes = {
  available: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default AvailabilityToggle;
