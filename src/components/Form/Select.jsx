import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiHeart } from 'react-icons/fi';
import { ChevronDown } from 'lucide-react';

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
  className,
  dropdownClassName,
  id,
  showIcon = false,
  labelClassName = '',
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

  const selectedOption = options?.find(opt => opt.value === value);

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block mb-2 font-medium text-gray-700 ${labelClassName}`}
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
            flex items-center w-full px-4 py-4 text-left
            bg-white border border-gray-300
            ${className?.includes('rounded-full') ? 'rounded-full' : 'rounded-lg'}
            ${disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-gray-50'}
            ${error ? 'border-red-500' : ''}
            ${isOpen ? 'border-pri-dark-1' : ''}
            ${className || ''}
          `}
          disabled={disabled}
        >
          <div className="flex items-center flex-1 min-w-0">
            {/* {showIcon && (
              <FiHeart className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
            )} */}
            <div className="flex-1 min-w-0">
              <span className={`
                 truncate
                ${value ? 'text-gray-900' : 'text-gray-400'}
              `}>
                {selectedOption?.label || placeholder || 'Select an option'}
              </span>
              {selectedOption?.description && (
                <span className=" text-gray-500 truncate">
                  &nbsp;&nbsp;{selectedOption.description}
                </span>
              )}
            </div>
          </div>
          <ChevronDown 
            className={`flex-shrink-0 w-6 h-6 ml-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            className={`
              absolute z-10 w-full min-w-[180px] mt-2 
              bg-white rounded-lg shadow-lg border border-gray-200 
              max-h-60 overflow-auto scrollbar-hidden
              ${dropdownClassName || ''}
            `}
          >
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
                  {/* {showIcon && (
                    <FiHeart className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
                  )} */}
                  <div>
                    <span className="font-medium text-gray-900">
                      {option.label}
                    </span> 
                    {option.description && (
                      <span className="text-gray-500">
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

SelectField.propTypes = {
  /** Label text displayed above the select */
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  id: PropTypes.string,
  showIcon: PropTypes.bool,
  labelClassName: PropTypes.string,
};

SelectField.defaultProps = {
  showIcon: true,
  disabled: false,
  placeholder: 'Select an option',
  dropdownClassName: '',
};

export default SelectField;
