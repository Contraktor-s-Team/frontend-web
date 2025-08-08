import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../Button/Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Job", 
  message = "Are you sure you want to delete this job? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg p-1"
            disabled={isLoading}
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* Warning Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-manrope">
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-500 mb-6 font-inter">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="grey-sec"
                onClick={onClose}
                disabled={isLoading}
                className="px-6"
              >
                {cancelText}
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={isLoading}
                className="px-6"
              >
                {isLoading ? 'Deleting...' : confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;