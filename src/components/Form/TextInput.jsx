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
 * @param {string} [labelClasses=''] - Additional CSS classes for the label element
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
  autocomplete='on',
  className = '',
  inputClassName = '',
  labelClasses = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const hasLeadingIcon = !!leadingIcon;
  const hasTrailingIcon = !!trailingIcon || (type === 'password' && value) || isError || isSuccess;

  let borderColor = 'border-[#D0D5DD]';
  let iconColor = 'text-[#98A2B3]';
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
    font-inter block w-full border py-4 focus:outline-none
    border-[1px] focus:border-pri-norm-1
    disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-50
    read-only:bg-gray-50 read-only:cursor-default read-only:text-gray-400
    placeholder:text-neu-norm-1
    ${inputClassName.includes('rounded-') ? '' : 'rounded-[6px]'}
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
        <label htmlFor={id || name} className={`block font-medium font-inter text-[#101928] mb-[10px] ${labelClasses}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {hasLeadingIcon && (
          <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none ${iconColor}`}>
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
          autoComplete={autocomplete}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isError}
          aria-describedby={errorMessage || helperText || successMessage ? `${id || name}-description` : undefined}
          className={`
            ${baseInputClasses}
            ${borderColor}
            ${hasLeadingIcon ? 'pl-14' : 'px-3'}
            ${hasTrailingIcon ? 'pr-10' : !hasLeadingIcon ? 'px-3' : 'pl-10'}
            ${inputClassName}
          `}
          {...props}
        />
        {hasTrailingIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' && !isError && !isSuccess ? (
              <button
                type="button"
                onClick={handlePasswordToggle}
                className={`p-1 rounded-full focus:outline-none ${iconColor} hover:text-gray-600 transition-colors`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            ) : currentTrailingIcon && (
              <button 
                type="button" 
                onClick={onTrailingIconClick}
                disabled={disabled || readOnly || isError || isSuccess}
                className={`p-1 ${onTrailingIconClick && !isError && !isSuccess ? 'cursor-pointer' : 'pointer-events-none'} ${iconColor}`}
                aria-label="Trailing icon action"
              >
                {React.cloneElement(currentTrailingIcon, { className: 'h-5 w-5' })}
              </button>
            )}
          </div>
        )}
      </div>
      {isError && errorMessage ? (
        <p id={`${id || name}-description`} className={`mt-1 text-xs ${helperTextColor}`}>
          {errorMessage}
        </p>
      ) : isSuccess && successMessage ? (
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
