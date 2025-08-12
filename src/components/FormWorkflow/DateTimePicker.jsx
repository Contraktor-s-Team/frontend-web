import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

/**
 * Reusable date and time picker component with dropdown interface
 * @param {Object} props - Component props
 * @param {Object} props.value - Current date and time values {date, time}
 * @param {function} props.onChange - Function to handle date/time changes
 * @param {boolean} props.required - Whether these fields are required
 * @param {string} props.labelClasses - Classes to apply to labels
 * @param {boolean} props.showTimeFields - Whether to show the time input fields
 */
const DateTimePicker = ({
  value = { date: '', time: '' },
  onChange,
  required = false,
  showTimeFields = true,
  disabled = false
}) => {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);
  const timeDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false);
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setIsTimeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate date options for the next 30 days
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const displayString = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      options.push({
        value: dateString,
        label: i === 0 ? `Today, ${displayString}` : i === 1 ? `Tomorrow, ${displayString}` : displayString
      });
    }

    return options;
  };

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];

    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const date = new Date();
        date.setHours(hour, minute);
        const displayString = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        options.push({
          value: timeString,
          label: displayString
        });
      }
    }

    return options;
  };

  const dateOptions = generateDateOptions();
  const timeOptions = generateTimeOptions();

  // Format date for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Select date';
    try {
      const selectedOption = dateOptions.find((option) => option.value === dateString);
      return selectedOption
        ? selectedOption.label
        : new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
    } catch {
      return 'Select date';
    }
  };

  // Format time for display
  const formatTimeDisplay = (timeString) => {
    if (!timeString) return 'Select time';
    try {
      const selectedOption = timeOptions.find((option) => option.value === timeString);
      return selectedOption ? selectedOption.label : timeString;
    } catch {
      return 'Select time';
    }
  };

  // Handle date selection
  const handleDateSelect = (dateValue) => {
    onChange({ ...value, date: dateValue });
    setIsDateDropdownOpen(false);
  };

  // Handle time selection
  const handleTimeSelect = (timeValue) => {
    onChange({ ...value, time: timeValue });
    setIsTimeDropdownOpen(false);
  };

  return (
    <div className="flex items-center gap-5.25 w-full">
      {/* Date Dropdown */}
      <div className="space-y-1 w-full relative" ref={dateDropdownRef}>
        <label className="block text-sm font-medium text-gray-800">
          Date {required && <span className="text-err-norm-1">*</span>}
        </label>
        <div
          onClick={() => {
            if (!disabled) {
              setIsDateDropdownOpen(!isDateDropdownOpen);
              setIsTimeDropdownOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setIsDateDropdownOpen(!isDateDropdownOpen);
              setIsTimeDropdownOpen(false);
            }
          }}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label="Select date"
          aria-expanded={isDateDropdownOpen}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
            disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'cursor-pointer hover:border-gray-400'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center justify-between`}
          aria-disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <span className={value.date ? 'text-gray-900' : 'text-gray-500'}>{formatDateDisplay(value.date)}</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Date Dropdown Options */}
        {isDateDropdownOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {dateOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleDateSelect(option.value)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  value.date === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Time Dropdown */}
      {showTimeFields && (
        <div className="space-y-1 w-full relative" ref={timeDropdownRef}>
          <label className="block text-sm font-medium text-gray-800">
            Time {required && <span className="text-err-norm-1">*</span>}
          </label>
          <div
            onClick={() => {
              if (!disabled) {
                setIsTimeDropdownOpen(!isTimeDropdownOpen);
                setIsDateDropdownOpen(false);
              }
            }}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setIsTimeDropdownOpen(!isTimeDropdownOpen);
                setIsDateDropdownOpen(false);
              }
            }}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-label="Select time"
            aria-expanded={isTimeDropdownOpen}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
              disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'cursor-pointer hover:border-gray-400'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center justify-between`}
            aria-disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-400" />
              <span className={value.time ? 'text-gray-900' : 'text-gray-500'}>{formatTimeDisplay(value.time)}</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isTimeDropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {/* Time Dropdown Options */}
          {isTimeDropdownOpen && !disabled && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {timeOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleTimeSelect(option.value)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                    value.time === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
