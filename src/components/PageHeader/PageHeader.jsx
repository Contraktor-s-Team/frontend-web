import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';

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
 */
const PageHeader = ({
  title,
  subtitle,
  buttonText,
  buttonVariant = 'secondary',
  buttonHref,
  buttonIcon,
  // onButtonClick,
  children,
  className = '',
}) => {
  const navigate = useNavigate();
  const handleClick = () => {

      navigate(buttonHref);
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 ${className}`}>
      <div>
        {title && <h1 className="font-manrope text-2xl font-semibold text-gray-900">{title}</h1>}
        {subtitle && <p className="text-neu-dark-1">{subtitle}</p>}
      </div>
      
      {(buttonText || children) && (
        <div className="flex items-center gap-3">
          {children}
          {buttonText && (
            <Button
              variant={buttonVariant}
              leftIcon={buttonIcon}
              onClick={handleClick}
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
};

export default PageHeader;
