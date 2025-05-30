import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

/**
 * A versatile text input component that supports various states and configurations.
 * @param {Object} props - Component props
 * @param {string} [id] - Unique identifier for the input element
 * @param {string} [name] - Name attribute for the input element
 * @param {string} [label] - Label text displayed above the input
 * @param {string} [value] - Controlled input value
 * @param {Function} onChange - Callback function when input value changes
 * @param {string} [placeholder] - Placeholder text
 * @param {string} [type='text'] - Input type (text, password, email, etc.)
 * @param {boolean} [disabled=false] - Whether the input is disabled
 * @param {boolean} [readOnly=false] - Whether the input is read-only
 * @param {boolean} [isError=false] - Whether to show error state
 * @param {boolean} [isSuccess=false] - Whether to show success state
 * @param {string} [errorMessage] - Error message to display
 * @param {string} [successMessage] - Success message to display
 * @param {string} [helperText] - Helper/description text
 * @param {ReactNode} [leadingIcon] - Icon to display on the left side of the input
 * @param {ReactNode} [trailingIcon] - Icon to display on the right side of the input
 * @param {Function} [onTrailingIconClick] - Callback when trailing icon is clicked
 * @param {string} [className=''] - Additional CSS classes for the container
 * @param {string} [inputClassName=''] - Additional CSS classes for the input element
 * @returns {JSX.Element} A text input field with optional icons and states
 */

const TextInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  readOnly = false,
  isError = false,
  isSuccess = false,
  errorMessage,
  successMessage,
  helperText,
  leadingIcon,
  trailingIcon,
  onTrailingIconClick,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const hasLeadingIcon = !!leadingIcon;
  const hasTrailingIcon = !!trailingIcon || (type === 'password' && value) || isError || isSuccess;

  let borderColor = 'border-gray-300';
  let iconColor = 'text-gray-400';
  let helperTextColor = 'text-gray-500';

  if (disabled || readOnly) {
    borderColor = 'border-gray-200 bg-gray-50';
    iconColor = 'text-gray-300';
    helperTextColor = 'text-gray-400';
  } else if (isError) {
    borderColor = 'border-red-500';
    iconColor = 'text-red-500';
    helperTextColor = 'text-red-600';
  } else if (isSuccess) {
    borderColor = 'border-green-500';
    iconColor = 'text-green-500';
    helperTextColor = 'text-green-600';
  }

  const baseInputClasses = `
    form-input w-full py-2 text-sm text-gray-700 bg-white border-[1.5px] focus:border-sec-norm-1 focus:outline-none
    border rounded-md shadow-sm transition-colors duration-150 ease-in-out 
    disabled:bg-gray-50 disabled:cursor-not-allowed 
    read-only:bg-gray-50 read-only:cursor-default
  `;

  let currentTrailingIcon = trailingIcon;
  if (isError) currentTrailingIcon = <FiAlertCircle />;
  if (isSuccess) currentTrailingIcon = <FiCheckCircle />;

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  let effectiveType = type;
  if (type === 'password' && showPassword) {
    effectiveType = 'text';
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {hasLeadingIcon && (
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${iconColor}`}>
            {React.cloneElement(leadingIcon, { className: 'h-5 w-5' })}
          </div>
        )}
        <input
          type={effectiveType}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isError}
          aria-describedby={errorMessage || helperText || successMessage ? `${id || name}-description` : undefined}
          className={`
            ${baseInputClasses}
            ${borderColor}
            ${hasLeadingIcon ? 'pl-10' : 'px-3'}
            ${hasTrailingIcon ? 'pr-10' : !hasLeadingIcon ? 'px-3' : 'pl-10'}
            ${inputClassName}
          `}
          {...props}
        />
        {(currentTrailingIcon || (type === 'password' && value)) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' && value && !isError && !isSuccess ? (
              <button
                type="button"
                onClick={handlePasswordToggle}
                className={`p-1 rounded-full focus:outline-none ${iconColor}`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            ) : currentTrailingIcon && (
              <button 
                type="button" 
                onClick={onTrailingIconClick}
                disabled={disabled || readOnly || isError || isSuccess} // Error/Success icons are not clickable by default
                className={`p-1 ${onTrailingIconClick && !isError && !isSuccess ? 'cursor-pointer' : 'pointer-events-none'} ${iconColor}`}
                aria-label="Trailing icon action"
              >
                {React.cloneElement(currentTrailingIcon, { className: 'h-5 w-5' })}
              </button>
            )}
          </div>
        )}
      </div>
      {(errorMessage && isError) ? (
        <p id={`${id || name}-description`} className={`mt-1 text-xs ${helperTextColor}`}>
          {errorMessage}
        </p>
      ) : (successMessage && isSuccess) ? (
        <p id={`${id || name}-description`} className={`mt-1 text-xs ${helperTextColor}`}>
          {successMessage}
        </p>
      ) : helperText ? (
        <p id={`${id || name}-description`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default TextInput;
