import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

/**
 * Reusable navigation buttons for multi-step workflows
 * @param {Object} props - Component props
 * @param {string} props.previousPath - Path for the previous step
 * @param {string} props.nextPath - Path for the next step 
 * @param {boolean} props.showPrevious - Whether to show the previous button
 * @param {boolean} props.showNext - Whether to show the next/continue button
 * @param {string} props.nextLabel - Label for the next button
 * @param {string} props.previousLabel - Label for the previous button
 * @param {function} props.onNext - Function to call before navigating to next step
 * @param {function} props.onPrevious - Function to call before navigating to previous step
 * @param {boolean} props.disableNext - Whether the next button should be disabled
 * @param {string} props.className - Additional classes for the container
 * @param {string} props.alignButtons - How to align the buttons ('between', 'start', 'end')
 */
const WorkflowButtons = ({
  previousPath,
  nextPath,
  showPrevious = true,
  showNext = true,
  nextLabel = 'Continue',
  previousLabel = 'Previous',
  onNext = null,
  onPrevious = null,
  disableNext = false,
  className = '',
  btnClassName = ''
}) => {
  const navigate = useNavigate();

  const handleNext = () => {
    if (onNext) {
      onNext(() => navigate(nextPath));
    } else {
      navigate(nextPath);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious(() => navigate(previousPath));
    } else {
      navigate(previousPath);
    }
  };

  return (
    <div className={`flex items-center gap-3 mt-8 ${className}`}>
      {showPrevious && (
        <Button 
          variant="secondary" 
          onClick={handlePrevious}
          className={btnClassName}
        >
          {previousLabel}
        </Button>
      )}
      
      {showNext && (
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={disableNext}
          className={btnClassName}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
};

export default WorkflowButtons;
