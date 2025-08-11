import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import Button from '../Button/Button';

/**
 * DateTime Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {function} props.onConfirm - Function to handle datetime confirmation
 * @param {Object} props.initialValue - Initial date and time values {date, time}
 * @param {string} props.title - Modal title
 */
const DateTimeModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialValue = { date: '', time: '' },
  title = 'Select Date and Time'
}) => {
  const [selectedDate, setSelectedDate] = useState(initialValue.date || '');
  const [selectedTime, setSelectedTime] = useState(initialValue.time || '');

  // Update internal state when initial value changes
  useEffect(() => {
    setSelectedDate(initialValue.date || '');
    setSelectedTime(initialValue.time || '');
  }, [initialValue.date, initialValue.time]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Reset to initial values
        setSelectedDate(initialValue.date || '');
        setSelectedTime(initialValue.time || '');
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, initialValue.date, initialValue.time, onClose]);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Handle confirm
  const handleConfirm = () => {
    onConfirm({
      date: selectedDate,
      time: selectedTime
    });
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset to initial values
    setSelectedDate(initialValue.date || '');
    setSelectedTime(initialValue.time || '');
    onClose();
  };

  // Check if form is valid
  const isValid = selectedDate && selectedTime;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label htmlFor="modal-date" className="block text-sm font-medium text-gray-800">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="modal-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label htmlFor="modal-time" className="block text-sm font-medium text-gray-800">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="modal-time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Helper Text */}
          <div className="text-sm text-gray-500">
            <p>Select a date and time for when you need this service.</p>
            {selectedDate && selectedTime && (
              <p className="mt-2 font-medium text-gray-700">
                Selected:{' '}
                {new Date(selectedDate + 'T' + selectedTime).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!isValid}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeModal;
