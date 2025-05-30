import React from 'react';

const CtaButton = ({ variant = 'green', children, onClick, type = 'button', disabled = false, className = '' }) => {
  const baseClasses = `
    px-4 py-2 rounded-lg text-white font-semibold text-sm 
    transition-all duration-150 ease-in-out 
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    green: `
      bg-success-norm-3
      hover:bg-success-norm-1 
      focus:bg-success-dark-2
    `,
    orange: `
      bg-warning-norm-3
      hover:bg-warning-norm-1 
      focus:bg-warning-dark-2
    `,
    blue: `
      bg-pri-norm-3
      hover:bg-pri-norm-1 
      focus:bg-pri-dark-2
    `,
  };

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CtaButton;
