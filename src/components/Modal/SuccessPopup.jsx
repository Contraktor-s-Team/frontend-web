import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

const SuccessPopup = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 font-inter">
              Success
            </p>
            <p className="text-sm text-gray-600 font-inter mt-1">
              {message}
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;