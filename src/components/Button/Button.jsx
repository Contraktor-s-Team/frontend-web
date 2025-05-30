import React from 'react';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';

/**
 * A highly customizable button component that supports multiple variants, sizes, and states.
 * @param {Object} props - Component props
 * @param {string} [variant='primary'] - Button variant (primary, secondary, destructive-pri, destructive-sec, grey-pri, grey-sec, text-pri, text-sec, text-destructive)
 * @param {string} [size='small'] - Button size (small, large)
 * @param {boolean} [disabled=false] - Whether the button is disabled
 * @param {boolean} [loading=false] - Whether to show loading state
 * @param {ReactNode} [leftIcon] - Icon to display on the left
 * @param {ReactNode} [rightIcon] - Icon to display on the right
 * @param {boolean} [iconOnly=false] - Whether the button should only show an icon
 * @param {string} [type='button'] - Button type (button, submit, reset)
 * @param {string} [className=''] - Additional CSS classes
 * @param {ReactNode} children - Button content
 * @returns {JSX.Element} A button element with the specified props
 */

const Button = ({
  variant = 'primary',
  size = 'small',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'cursor-pointer flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none disabled:cursor-not-allowed';
  
  // Size classes - only small and large
  const sizeClasses = {
    small: iconOnly ? 'p-2' : 'px-3 py-2 text-sm',
    large: iconOnly ? 'p-4' : 'px-6 py-4 text-base',
  };
  
  // Gap classes based on size
  const gapClasses = {
    small: 'gap-1.5',
    large: 'gap-2.5',
  };

  // Variant classes (normal, hover, focus, active)
  const variantClasses = {
    primary: `
      bg-pri-dark-1
      text-white 
      hover:bg-pri-norm-1
      focus:bg-pri-darker
      disabled:bg-neu-norm-1
    `,
    secondary: `
      bg-white 
      text-pri-norm-1 
      border-[1.5px] border-pri-norm-1 
      hover:bg-pri-light-1 hover:border-pri-norm-1 hover:text-pri-norm-1
      focus:bg-pri-light-1 focus:border-pri-dark-1 focus:text-pri-dark-1
      disabled:border-neu-light-3 disabled:text-neu-norm-1 disabled:bg-white
    `,
    'destructive-pri': `
      bg-err-norm-2 
      text-white 
      hover:bg-err-norm-1 
      focus:bg-err-dark-1
      disabled:bg-neu-light-3
    `,
    'destructive-sec': `
      bg-white
      text-err-norm-1
      border-[1.5px] border-err-norm-1
      hover:bg-err-light-1 hover:border-err-norm-2 hover:text-err-norm-1
      focus:border-err-dark-1 focus:bg-err-light-1 focus:text-err-dark-1
      disabled:border-neu-light-3 disabled:text-neu-norm-1 disabled:bg-white
    `,
    'grey-pri': `
      bg-neu-norm-1
      text-white
      hover:bg-neu-darker
      focus:bg-neu-darker
      disabled:bg-neu-light-3
    `,
    'grey-sec': `
      bg-white
      text-black
      border-[1.5px] border-neu-light-3
      hover:bg-neu-light-1
      focus:bg-neu-light-3
      disabled:border-neu-light-3 disabled:text-neu-norm-1 disabled:bg-white
    `,
    'text-pri': `
      bg-transparent
      text-pri-norm-1
      hover:text-pri-dark-1
      focus:text-[#00263E]
      disabled:text-[#D0D5DD]
    `,
    'text-sec': `
      bg-transparent
      text-gray-500
      hover:text-gray-400
      focus:text-gray-700
        disabled:text-[#D0D5DD]
    `,
    'text-destructive': `
      bg-transparent
      text-err-norm-1
      hover:text-err-light-3
      focus:text-err-dark-1
       disabled:text-[#D0D5DD]
    `,
  };

  // Use the specified variant
  const variantToUse = variant;

  // Combine all classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variantToUse],
    className
  ].filter(Boolean).join(' ');



  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      <span className={`flex items-center ${!loading ? gapClasses[size] : ''}`}>
        {loading ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <>
            {leftIcon && !rightIcon && (
              <span className="flex items-center">
                {leftIcon}
              </span>
            )}
            {!iconOnly && children}
            {rightIcon && (
              <span className="flex items-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
};

Button.propTypes = {
  /** Button style variant */
  variant: PropTypes.oneOf([
    'primary', 
    'secondary', 
    'destructive-pri', 
    'destructive-sec', 
    'grey-pri', 
    'grey-sec', 
    'text-pri', 
    'text-sec', 
    'text-destructive'
  ]),
  /** Size of the button */
  size: PropTypes.oneOf(['small', 'large']),
  /** Disable the button */
  disabled: PropTypes.bool,
  /** Show loading spinner */
  loading: PropTypes.bool,
  /** Icon to display on the left */
  leftIcon: PropTypes.node,
  /** Icon to display on the right */
  rightIcon: PropTypes.node,
  /** Whether to show only icon (no text) */
  iconOnly: PropTypes.bool,
  /** HTML button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Button content */
  children: PropTypes.node,
};

export default Button;
