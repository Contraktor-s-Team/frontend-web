import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import AvailabilityToggle from '../AvailabilityToggle';

/**
 * Reusable Page Header Component
 * @param {Object} props - Component props
 * @param {string} props.title - Main heading text
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {string} [props.buttonText] - Text for the action button
 * @param {string} [props.buttonVariant='secondary'] - Variant for the button
 * @param {string} [props.buttonHref] - URL for the button's onClick navigation
 * @param {React.ReactNode} [props.buttonIcon] - Icon component for the button
 * @param {function} [props.onButtonClick] - Click handler for the button
 * @param {React.ReactNode} [props.children] - Additional content to render in the header
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.showAvailability] - Whether to show the availability toggle (for artisan view)
 * @param {boolean} [props.initialAvailability] - Initial state for availability toggle
 * @param {function} [props.onAvailabilityChange] - Callback when availability changes
 */
const PageHeader = ({
  title,
  subtitle,
  buttonText,
  buttonVariant = 'secondary',
  buttonHref,
  buttonIcon,
  onButtonClick,
  children,
  className = '',
  showAvailability = false,
  initialAvailability = true,
  onAvailabilityChange,
}) => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(initialAvailability);

  const handleButtonClick = (e) => {
    if (onButtonClick) {
      onButtonClick(e);
    } else if (buttonHref) {
      navigate(buttonHref);
    }
  };

  const handleAvailabilityToggle = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    if (onAvailabilityChange) {
      onAvailabilityChange(newAvailability);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 ${className}`}>
      <div>
        {title && <h1 className="font-manrope text-2xl font-semibold text-gray-900">{title}</h1>}
        {subtitle && <p className="text-neu-dark-1">{subtitle}</p>}
      </div>
      
      {(buttonText || children || showAvailability) && (
        <div className="flex items-center gap-3">
          {children}
          
          {showAvailability && (
            <AvailabilityToggle
              available={isAvailable}
              onChange={handleAvailabilityToggle}
            />
          )}
          
          {buttonText && (
            <Button
              variant={buttonVariant}
              leftIcon={buttonIcon}
              onClick={handleButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string,
  buttonVariant: PropTypes.string,
  buttonHref: PropTypes.string,
  buttonIcon: PropTypes.node,
  onButtonClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  showAvailability: PropTypes.bool,
  initialAvailability: PropTypes.bool,
  onAvailabilityChange: PropTypes.func,
};

export default PageHeader;
