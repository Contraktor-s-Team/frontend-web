import React from 'react';
import { FaCheck } from 'react-icons/fa';
import Button from '../Button/Button';

const SuccessModal = ({ isOpen, onClose, title, message, buttonText = 'Browse Artisans', onButtonClick }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#FFEFD8] flex items-center justify-center">
            <FaCheck className="text-[#FFA500] text-2xl" />
          </div>
        </div>
        
        {/* Title */}
        <h3 id="modal-title" className="text-2xl font-bold text-gray-900 mb-2">
          {title || 'Success!'}
        </h3>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message || 'Operation completed successfully.'}
        </p>
        
        {/* Button */}
        <div className="w-full">
          <Button
            variant="secondary"
            size="large"
            className="w-full justify-center"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
