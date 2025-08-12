import React from 'react';
import PropTypes from 'prop-types';

const AvailabilityToggle = ({ available, onChange, className = '', disabled = false, loading = false }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-neu-dark-1 font-medium text-sm mr-4 select-none">Set Availability</span>
      <button
        onClick={() => !disabled && !loading && onChange(!available)}
        disabled={disabled || loading}
        className={`relative flex w-[220px] h-12 rounded-full transition-colors ${
          disabled || loading
            ? 'bg-neu-light-2 cursor-not-allowed opacity-50'
            : 'bg-neu-light-1 cursor-pointer hover:bg-neu-light-2'
        }`}
      >
        {/* Loading Spinner Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
            <div className="w-4 h-4 border-2 border-pri-norm-1 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Slider Indicator */}
        <span
          className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-10 bg-white rounded-full shadow transition-all duration-300 ${
            available ? 'translate-x-0' : 'translate-x-full'
          } ${loading ? 'opacity-50' : ''}`}
        />

        {/* Available */}
        <div className="flex items-center justify-center w-1/2 z-10 relative">
          <span
            className={`w-2.5 h-2.5 rounded-full mr-1.5 transition-colors ${
              available ? 'bg-success-norm-1' : 'bg-neu-norm-1'
            }`}
          />
          <span
            className={`text-sm font-medium transition-colors ${available ? 'text-success-norm-1' : 'text-neu-norm-1'}`}
          >
            Available
          </span>
        </div>

        {/* Unavailable */}
        <div className="flex items-center justify-center w-1/2 z-10 relative">
          <span
            className={`text-sm font-medium transition-colors ${!available ? 'text-err-norm-1' : 'text-neu-norm-1'}`}
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
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default AvailabilityToggle;
