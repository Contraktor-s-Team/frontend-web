import React from 'react';

const Chip = ({
  children,
  leftIcon,
  rightIcon,
  rightIconAriaLabel = 'action',
  onRightIconClick,
  onClick,
  disabled = false,
  isFocused = false,
  className = '',
  focusedStyleType = 'default' // 'default' (white bg on focus) or 'selected' (light blue bg on focus)
}) => {
  const baseClasses = `
    inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-medium
    border transition-colors duration-150 ease-in-out group
  `;

  let stateClasses = '';
  let iconColorClasses = '';

  if (disabled) {
    stateClasses = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
    iconColorClasses = 'text-gray-400';
  } else if (isFocused) {
    stateClasses = 'text-neu-norm-3 border-pri-norm-3 bg-pri-light-1';
    iconColorClasses = 'text-neu-norm-3';
  } else { // Default, non-focused, enabled state
    stateClasses = 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300 cursor-pointer';
    iconColorClasses = 'text-gray-600'; // Default icon color for enabled state
  }

  const chipClasses = [
    baseClasses,
    stateClasses,
    className,
  ].filter(Boolean).join(' ');

  const handleChipClick = (e) => {
    // Prevent click if the event target is the right icon's interactive area
    if (e.target.closest('[data-chip-right-icon]') || disabled) {
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };
  
  const handleRightIconClick = (e) => {
    e.stopPropagation(); // Prevent chip onClick from firing
    if (onRightIconClick && !disabled) {
      onRightIconClick(e);
    }
  };

  return (
    <button
      type="button"
      className={chipClasses}
      onClick={handleChipClick}
      disabled={disabled}
      aria-pressed={isFocused && (focusedStyleType === 'selected' || !!onClick)}
    >
      {leftIcon && (
        <span className={`mr-1.5 flex items-center ${iconColorClasses}`}>
          {leftIcon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {rightIcon && (
        <span
          data-chip-right-icon
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={`ml-1.5 flex items-center p-0.5 rounded-full 
                      ${disabled ? 'cursor-not-allowed' : 'hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-currentColor'} 
                      ${iconColorClasses}`}
          onClick={handleRightIconClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRightIconClick(e); }}}
          aria-label={rightIconAriaLabel}
          aria-disabled={disabled}
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Chip;
