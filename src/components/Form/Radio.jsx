import React from 'react';
import PropTypes from 'prop-types';

/**
 * A single radio button component that works as part of a radio group.
 * @param {Object} props - Component props
 * @param {string} [label] - Label text displayed next to the radio button
 * @param {string} value - The value of the radio button
 * @param {boolean} checked - Whether the radio button is selected
 * @param {Function} onChange - Callback function when radio button is selected
 * @param {string} name - Name attribute for the radio button group
 * @param {boolean} [disabled] - Whether the radio button is disabled
 * @param {boolean} [required] - Whether the radio button is required
 * @param {string} [className] - Additional CSS classes for the container
 * @param {string} [id] - Unique identifier for the radio button element
 * @returns {JSX.Element} A styled radio button with optional label
 */

const Radio = ({
  label,
  value,
  checked,
  onChange,
  name,
  disabled,
  required,
  className,
  id,
}) => {
  const radioId = id || `radio-${value?.toString().toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <div className="relative">
          <input
            id={radioId}
            type="radio"
            value={value}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`
              w-5 h-5 border-2 rounded-full
              ${disabled ? 'bg-gray-100' : 'bg-white'}
              ${checked ? 'border-primary-500' : 'border-gray-300'}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              ${className || ''}
            `}
            aria-labelledby={`${radioId}-label`}
          />
          {checked && (
            <div className="absolute w-2.5 h-2.5 bg-primary-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      {label && (
        <label
          id={`${radioId}-label`}
          htmlFor={radioId}
          className={`ml-3 text-sm font-medium ${
            disabled ? 'text-gray-500' : 'text-gray-700'
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

Radio.propTypes = {
  /** Label text displayed next to the radio button */
  label: PropTypes.string,
  /** The value of the radio button */
  value: PropTypes.string.isRequired,
  /** Whether the radio button is selected */
  checked: PropTypes.bool.isRequired,
  /** Callback function when radio button is selected */
  onChange: PropTypes.func.isRequired,
  /** Name attribute for the radio button group */
  name: PropTypes.string.isRequired,
  /** Whether the radio button is disabled */
  disabled: PropTypes.bool,
  /** Whether the radio button is required */
  required: PropTypes.bool,
  /** Additional CSS classes for the container */
  className: PropTypes.string,
  /** Unique identifier for the radio button element */
  id: PropTypes.string,
};

Radio.defaultProps = {
  disabled: false,
  required: false,
};

export default Radio;
