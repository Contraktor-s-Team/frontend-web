import React from 'react';
import TextInput from '../Form/TextInput';
// import TextInput from '../TextInput/TextInput';

/**
 * Reusable date and time picker component
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
  // Label classes are now handled by the parent component
  showTimeFields = true
}) => {
  // Handle date change
  const handleDateChange = (e) => {
    onChange({
      ...value,
      date: e.target.value
    });
  };

  // Handle time change
  const handleTimeChange = (e) => {
    onChange({
      ...value,
      time: e.target.value
    });
  };

  return (
    <div className="flex items-center gap-5.25 w-full">
      <div className="space-y-1 w-full">
        <label htmlFor="date-input" className="block text-sm font-medium text-gray-800">
          Date {required && <span className="text-err-norm-1">*</span>}
        </label>
        <TextInput
          type="date"
          id="date-input"
          value={value.date || ''}
          onChange={handleDateChange}
          required={required}
          className="w-full"
        />
      </div>

      {showTimeFields && (
        <div className="space-y-1 w-full">
          <label htmlFor="time-input" className="block text-sm font-medium text-gray-800">
            Time {required && <span className="text-err-norm-1">*</span>}
          </label>
          <TextInput
            type="time"
            id="time-input"
            value={value.time || ''}
            onChange={handleTimeChange}
            required={required}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
