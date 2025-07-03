import React from 'react';

/**
 * Reusable FormSection component for creating consistent form sections
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Optional subtitle
 * @param {React.ReactNode} props.children - Form elements
 * @param {string} props.className - Additional classes for the container
 * @param {boolean} props.showDivider - Whether to show the divider after the title
 */
const FormSection = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  showDivider = true 
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <div className="mb-6">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-neu-dark-1 mt-1">{subtitle}</p>}
      </div>
      
      {showDivider && <div className="h-0.5 bg-neu-light-3 mb-6"></div>}
      
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
