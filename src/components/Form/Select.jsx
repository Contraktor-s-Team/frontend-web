import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiHeart } from 'react-icons/fi';

/**
 * A customizable select dropdown component with support for options with descriptions.
 * @param {Object} props - Component props
 * @param {string} [label] - Label text displayed above the select
 * @param {string} value - Currently selected value
 * @param {Function} onChange - Callback function when selection changes
 * @param {Array<{value: string, label: string, description?: string}>} options - Array of select options
 * @param {string} [placeholder] - Placeholder text when no option is selected
 * @param {string} [error] - Error message to display below the select
 * @param {boolean} [disabled] - Whether the select is disabled
 * @param {string} [className] - Additional CSS classes for the container
 * @param {string} [id] - Unique identifier for the select element
 * @param {boolean} [showIcon=true] - Whether to show the leading icon
 * @returns {JSX.Element} A custom-styled select dropdown
 */

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
  className,
  id,
  showIcon = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { value: option.value } });
    setIsOpen(false);
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            flex items-center w-full px-4 py-2.5 text-left
            bg-white border border-gray-300 rounded-lg
            ${disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-gray-50'}
            ${error ? 'border-red-500' : ''}
            ${isOpen ? 'border-pri-dark-1' : ''}
            ${className || ''}
          `}
          disabled={disabled}
        >
          <div className="flex items-center flex-1 min-w-0">
            {showIcon && (
              <FiHeart className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">
                {value ? options.find(opt => opt.value === value)?.label || placeholder : placeholder}
              </span>
              {options.find(opt => opt.value === value)?.description && (
                <span className="text-sm text-gray-500 truncate">
                  &nbsp;&nbsp;{options.find(opt => opt.value === value)?.description}
                </span>
              )}
            </div>
          </div>
          <svg
            className={`flex-shrink-0 w-5 h-5 ml-3 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto scrollbar-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-2.5 text-left hover:bg-gray-50
                  ${value === option.value ? 'bg-gray-50' : ''}
                `}
              >
                <div className="flex items-center">
                  {showIcon && (
                    <FiHeart className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span> 
                    {option.description && (
                      <span className="text-sm text-gray-500">
                        &nbsp;&nbsp;{option.description}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  /** Label text displayed above the select */
  label: PropTypes.string,
  /** Currently selected value */
  value: PropTypes.string.isRequired,
  /** Callback function when selection changes */
  onChange: PropTypes.func.isRequired,
  /** Array of select options */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** The value of the option */
      value: PropTypes.string.isRequired,
      /** The display text of the option */
      label: PropTypes.string.isRequired,
      /** Optional description shown next to the label */
      description: PropTypes.string,
    })
  ).isRequired,
  /** Placeholder text when no option is selected */
  placeholder: PropTypes.string,
  /** Error message to display below the select */
  error: PropTypes.string,
  /** Whether the select is disabled */
  disabled: PropTypes.bool,
  /** Whether the field is required */
  required: PropTypes.bool,
  /** Additional CSS classes for the container */
  className: PropTypes.string,
  /** Unique identifier for the select element */
  id: PropTypes.string,
  /** Whether to show the leading icon */
  showIcon: PropTypes.bool,
};

Select.defaultProps = {
  showIcon: true,
  disabled: false,
  required: false,
};

export default Select;
