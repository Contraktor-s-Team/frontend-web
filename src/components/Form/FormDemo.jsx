import React, { useState } from 'react';
import TextInput from './TextInput';
import Select from './Select';
import Checkbox from './Checkbox';
import RadioGroup from './RadioGroup';
import { FiSearch, FiMail, FiMapPin, FiEye } from 'react-icons/fi';

const FormDemo = () => {
  const [textInputValue, setTextInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [errorInputValue, setErrorInputValue] = useState('Invalid input');
  const [successInputValue, setSuccessInputValue] = useState('Valid input');
  const [readOnlyValue, _setReadOnlyValue] = useState('This is read-only');
  const [disabledValue, setDisabledValue] = useState('Disabled input');
  
  // New form component states
  const [selectedOption, setSelectedOption] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  
  const selectOptions = [
    { value: 'option1', label: 'Account settings', description: '@account' },
    { value: 'option2', label: 'Account settings', description: '@account' },
    { value: 'option3', label: 'Account settings', description: '@account' },
    { value: 'option4', label: 'Account settings', description: '@account' },
    { value: 'option5', label: 'Account settings', description: '@account' },
  ];
  
  const radioOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className="bg-gray-100 py-12 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">Form Components Demo</h1>

        {/* Text Inputs Section */}
        <section className="mb-16 p-6 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-8">Text Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">

            {/* Select Dropdown */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Select Dropdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Default Select"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  options={selectOptions}
                  placeholder="Select an option"
                  helperText="This is a helper text"
                />
                <Select
                  label="Error State"
                  value=""
                  onChange={() => {}}
                  options={selectOptions}
                  placeholder="Select an option"
                  error="This field is required"
                />
                <Select
                  label="Disabled Select"
                  value="option1"
                  onChange={() => {}}
                  options={selectOptions}
                  disabled
                  helperText="This dropdown is disabled"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Checkbox</h3>
              <div className="space-y-4">
                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <Checkbox
                  label="Subscribe to newsletter"
                  checked={true}
                  disabled
                />
              </div>
            </div>

            {/* Radio Group */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Radio Buttons</h3>
              <RadioGroup
                label="Select an option"
                name="radio-group"
                value={radioValue}
                onChange={(e) => setRadioValue(e.target.value)}
                options={radioOptions}
                helperText="Select one option from the list"
              />
              
              <div className="mt-6">
                <RadioGroup
                  label="Disabled Radio Group"
                  name="disabled-radio-group"
                  value="option1"
                  onChange={() => {}}
                  options={radioOptions}
                  disabled
                />
              </div>
            </div>

            <TextInput
              id="disabled-input"
              label="Disabled Input"
              value={disabledValue}
              onChange={(e) => setDisabledValue(e.target.value)}
              disabled
              placeholder="This input is disabled"
            />
            <TextInput
              id="default-text"
              label="Default Input"
              placeholder="Enter text here"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              helperText="This is some helper text."
            />

            <TextInput
              id="leading-icon-text"
              label="With Leading Icon"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              leadingIcon={<FiSearch />}
              helperText="Input with a search icon."
            />

            <TextInput
              id="trailing-icon-text"
              label="With Trailing Icon"
              placeholder="your.email@example.com"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              trailingIcon={<FiMail />}
              onTrailingIconClick={() => alert('Email icon clicked!')}
              helperText="Input with a clickable mail icon."
            />
            
            <TextInput
              id="password-text"
              label="Password Input"
              placeholder="Enter your password"
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              helperText="Click the eye to toggle visibility."
            />

            <TextInput
              id="success-text"
              label="Success State"
              value={successInputValue}
              onChange={(e) => setSuccessInputValue(e.target.value)}
              isSuccess
              successMessage="Input is valid!"
              leadingIcon={<FiSearch />}
            />

            <TextInput
              id="error-text"
              label="Error State"
              value={errorInputValue}
              onChange={(e) => setErrorInputValue(e.target.value)}
              isError
              errorMessage="This field has an error."
              leadingIcon={<FiSearch />}
            />
            
            <TextInput
              id="disabled-text"
              label="Disabled Input"
              placeholder="Cannot edit"
              value={disabledValue}
              disabled
              leadingIcon={<FiMail />}
              helperText="This input is disabled."
            />

            <TextInput
              id="readonly-text"
              label="Read-only Input"
              value={readOnlyValue}
              readOnly
              leadingIcon={<FiMapPin />}
              trailingIcon={<FiEye />}
              helperText="This input is read-only."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormDemo;
