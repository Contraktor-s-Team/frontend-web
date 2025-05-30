import React from 'react';
import PropTypes from 'prop-types';

/**
 * A customizable checkbox input component with support for different states and labels.
 * @param {Object} props - Component props
 * @param {string} [label] - Label text displayed next to the checkbox
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {Function} onChange - Callback function when checkbox state changes
 * @param {boolean} [disabled] - Whether the checkbox is disabled
 * @param {boolean} [required] - Whether the checkbox is required
 * @param {string} [className] - Additional CSS classes for the container
 * @param {string} [id] - Unique identifier for the checkbox element
 * @returns {JSX.Element} A styled checkbox input with optional label
 */

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled,
  required,
  className,
  id,
}) => {
  const checkboxId = id || `checkbox-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  const handleClick = () => {
    if (!disabled) {
      // Create a synthetic event to match the expected onChange signature
      const syntheticEvent = {
        target: {
          checked: !checked,
          value: !checked
        }
      };
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <div className="relative">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="sr-only peer"
            aria-labelledby={`${checkboxId}-label`}
          />
          <div
            onClick={handleClick}
            className={`
              w-5 h-5 border rounded
              ${disabled ? 'bg-gray-100' : 'bg-white'}
              ${
                checked
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }
              peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-opacity-50
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              transition-colors duration-200
              ${className || ''}
            `}
          >
            {checked && (
              <svg
                className="w-4 h-4 text-green-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      {label && (
        <label
          id={`${checkboxId}-label`}
          htmlFor={checkboxId}
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

Checkbox.propTypes = {
  /** Label text displayed next to the checkbox */
  label: PropTypes.string,
  /** Whether the checkbox is checked */
  checked: PropTypes.bool.isRequired,
  /** Callback function when checkbox state changes */
  onChange: PropTypes.func.isRequired,
  /** Whether the checkbox is disabled */
  disabled: PropTypes.bool,
  /** Whether the checkbox is required */
  required: PropTypes.bool,
  /** Additional CSS classes for the container */
  className: PropTypes.string,
  /** Unique identifier for the checkbox element */
  id: PropTypes.string,
};

Checkbox.defaultProps = {
  disabled: false,
  required: false,
};

export default Checkbox;