import React from 'react';
import PropTypes from 'prop-types';
import Radio from './Radio';

/**
 * A group of radio buttons that work together as a single selection control.
 * @param {Object} props - Component props
 * @param {string} [label] - Group label displayed above the radio buttons
 * @param {string} name - Name attribute for all radio buttons in the group
 * @param {string} value - Currently selected value in the group
 * @param {Function} onChange - Callback function when selection changes
 * @param {Array<{value: string, label: string, disabled?: boolean}>} options - Array of radio button options
 * @param {boolean} [disabled] - Whether all radio buttons in the group are disabled
 * @param {boolean} [required] - Whether selection is required
 * @param {string} [error] - Error message to display below the group
 * @param {string} [helperText] - Helper/description text
 * @param {string} [className] - Additional CSS classes for the container
 * @returns {JSX.Element} A group of radio buttons with a common name and selection state
 */

const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled,
  required,
  error,
  helperText,
  className,
}) => {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && (
        <div className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      <div className="space-y-2" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled || option.disabled}
            required={required}
          />
        ))}
      </div>
      {helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

RadioGroup.propTypes = {
  /** Group label displayed above the radio buttons */
  label: PropTypes.string,
  /** Name attribute for all radio buttons in the group */
  name: PropTypes.string.isRequired,
  /** Currently selected value in the group */
  value: PropTypes.string,
  /** Callback function when selection changes */
  onChange: PropTypes.func.isRequired,
  /** Array of radio button options */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** The value of the radio button */
      value: PropTypes.string.isRequired,
      /** The display text for the radio button */
      label: PropTypes.string.isRequired,
      /** Whether this specific radio button is disabled */
      disabled: PropTypes.bool,
    })
  ).isRequired,
  /** Whether all radio buttons in the group are disabled */
  disabled: PropTypes.bool,
  /** Whether selection is required */
  required: PropTypes.bool,
  /** Error message to display below the group */
  error: PropTypes.string,
  /** Helper/description text */
  helperText: PropTypes.string,
  /** Additional CSS classes for the container */
  className: PropTypes.string,
};

RadioGroup.defaultProps = {
  disabled: false,
  required: false,
};

export default RadioGroup;
