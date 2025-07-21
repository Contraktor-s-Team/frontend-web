import React from 'react';
// import { FaCheck } from 'react-icons/fa';
import Button from '../Button/Button';
import { Check } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';

const SuccessModal = ({
  isOpen,
  onClose,
  title = 'Your Job has been posted!',
  message = "You'll receive quotes from artisans shortly.",
  primaryButtonText = 'View Job',
  secondaryButtonText = 'Back to Dashboard',
  onButtonClick,
  onSecondaryButtonClick
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 

        className="bg-white rounded-2xl p-10 w-full md:max-w-100 lg:max-w-150 mx-4 text-center relative"

        onClick={e => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-27 h-27 rounded-full bg-[#FFEFD8] flex items-center justify-center">
            <Check className="text-[#FFA500]" size={55} />
          </div>
        </div>

        {/* Title */}
        <h3 id="modal-title" className="text-2xl font-bold font-manrope text-[#101928] mb-2">
          {title || 'Success!'}
        </h3>

        {/* Message */}
        <p className="font-inter mb-6">{message || 'Operation completed successfully.'}</p>

        {/* Buttons */}
        <div className="w-full flex gap-4 mt-8">
          {secondaryButtonText && onSecondaryButtonClick && (
            <Button variant="grey-sec" size="large" className="flex-1 justify-center" onClick={onSecondaryButtonClick}>
              {secondaryButtonText}
            </Button>
          )}
          <Button
            variant="primary"
            size="large"
            className={`justify-center ${secondaryButtonText && onSecondaryButtonClick ? 'flex-1' : 'w-full'}`}
            onClick={onButtonClick}
          >
            {primaryButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
