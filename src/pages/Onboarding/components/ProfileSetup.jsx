import React, { useRef, useCallback } from 'react';
import { FiUpload } from 'react-icons/fi';
import Button from '../../../components/Button';
import { TextInput } from '../../../components/Form';

const ProfileSetup = ({ 
  onNext,
  onImageUpload,
  onRemoveImage,
  onFormChange,
  formData = {},
  selectedServices = [],
  onToggleService
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = React.useState(false);
  const { firstName = '', lastName = '', phoneNumber = '' } = formData;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const services = [
    'Carpentry', 'Banking', 'Interior', 'Gas works', 'Plumbing', 'AC/Refrigeration',
    'Beauty/Salon', 'Bricklaying / POP', 'Catering', 'Cleaning', 'Fumigation',
    'DSTV/CCTV', 'Generator Repair', 'Haulage/Movers', 'Painter', 'Photographer',
    'Electrician'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <div className="mt-[58px] pb-6 w-full md:max-w-[704px]">
      <div className="space-y-2">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Finish creating account</h3>
        <p className="font-inter font-medium text-[#101928] text-sm md:text-base">
          Add your name and phone number to finish creating your account
        </p>
      </div>

      <div className="mt-8">
        {/* Profile Image Upload */}
        <div 
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FiUpload className="text-gray-400 text-2xl" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG (max. 2MB)</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              id="first-name"
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={handleChange}
              required
            />
            <TextInput
              id="last-name"
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mt-6">
            <TextInput
              id="phone-number"
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter your phone number"
              type="tel"
              value={phoneNumber}
              onChange={handleChange}
              className="mt-6"
              required
            />
          </div>

          {/* Services Selection */}
          {selectedServices && (
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Services (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => onToggleService(service)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedServices.includes(service)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Button 
        variant="secondary" 
        className="w-full max-w-[384px] mt-8 py-3"
        onClick={onNext}
        disabled={!firstName || !lastName || !phoneNumber || selectedServices.length === 0}
      >
        Save & Continue
      </Button>
    </div>
  );
};

export default ProfileSetup;
