// Updated TimeLocation.jsx with proper urgent state management
import React, { useState } from 'react';
import { useJobPost } from '../../../contexts/JobPostContext';
import { FormSection, DateTimePicker, AddressFields, WorkflowButtons } from '../../../components/FormWorkflow';
import Button from '../../../components/Button/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const TimeLocation = () => {
  const { state: jobData, dispatch } = useJobPost();
  const navigate = useNavigate();
  const location = useLocation();

  const [date, setDate] = useState(jobData.date || '');
  const [time, setTime] = useState(jobData.time || '');
  const [urgent, setUrgent] = useState(jobData.urgent || false);
  const [formAddress, setFormAddress] = useState({
    line1: jobData.address?.street || '',
    line2: jobData.address?.landmark || '',
    city: jobData.address?.city || '',
    state: jobData.address?.state || '',
    postalCode: jobData.address?.lga || '',
    country: 'Nigeria'
  });

  // Track whether saved address is active
  const [savedAddressActive, setSavedAddressActive] = useState(false);

  const handleCheckboxChange = (e) => {
    const isUrgent = e.target.checked;
    setUrgent(isUrgent);

    // Log for debugging
    console.log('Urgent checkbox changed:', isUrgent);

    // If marking as urgent, we might want to clear date/time or keep them as preference
    // Based on your UI, it seems like date/time are still required even for urgent jobs
    // So we'll keep them as is
  };

  const handleDateTimeChange = (dateTimeValue) => {
    setDate(dateTimeValue.date || '');
    setTime(dateTimeValue.time || '');

    console.log('Date/Time changed:', {
      date: dateTimeValue.date,
      time: dateTimeValue.time,
      urgent
    });
  };

  const saveFormData = () => {
    // Map the form address structure to the expected Redux structure
    const addressData = {
      street: formAddress.line1,
      landmark: formAddress.line2,
      city: formAddress.city,
      lga: formAddress.postalCode,
      state: formAddress.state
    };

    // Save all data including urgent flag to Redux
    const dataToSave = {
      date,
      time,
      urgent, // Make sure urgent is included
      address: addressData
    };

    console.log('Saving form data to Redux:', dataToSave);

    dispatch({ type: 'UPDATE_JOB_DATA', payload: dataToSave });
    return true;
  };

  const toggleSavedAddress = () => {
    if (savedAddressActive) {
      // Clear the address
      setFormAddress({
        line1: '',
        line2: '',
        city: '',
        postalCode: '',
        state: '',
        country: 'Nigeria'
      });
      setSavedAddressActive(false);
    } else {
      // Fill with saved address
      setFormAddress({
        line1: '23 Adeyemi Street',
        line2: 'Close to Yaba Tech gate',
        city: 'Yaba',
        postalCode: 'Ikosi-Isheri',
        state: 'Lagos',
        country: 'Nigeria'
      });
      setSavedAddressActive(true);
    }
  };

  const isFormValid = () => {
    // Basic validation - date and time are required regardless of urgent status
    const hasDateTime = date && time;
    const hasAddress = formAddress.line1 && formAddress.city && formAddress.postalCode && formAddress.state;

    return hasDateTime && hasAddress;
  };

  const handleContinue = () => {
    saveFormData();

    // Pass complete data to review page
    const navigationState = {
      jobData: {
        ...jobData,
        date,
        time,
        urgent, // Make sure urgent is passed
        address: {
          street: formAddress.line1,
          landmark: formAddress.line2,
          city: formAddress.city,
          lga: formAddress.postalCode,
          state: formAddress.state
        }
      },
      date,
      time,
      urgent, // Include urgent in navigation state as well
      formAddress,
      data: {
        jobtitle: jobData.jobTitle,
        description: jobData.description
      },
      file: jobData.files || [],
      category: jobData.subcategory
    };

    console.log('Navigating with state:', navigationState);

    navigate('/customer/post-job/review', { state: navigationState });
  };

  return (
    <FormSection
      title="When and where should this be done?"
      className="space-y-6 sm:space-y-8 px-2 sm:px-4 md:px-8"
      showDivider={false}
    >
      {/* Date and Time section with urgent checkbox */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-13">
        <div className="w-full md:w-[713px]">
          <DateTimePicker
            value={{ date, time }}
            onChange={handleDateTimeChange}
            required
            labelClasses="text-sm"
            disabled={urgent}
          />
        </div>

        {/* Set as urgent checkbox */}
        <div className="pt-10">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgent-checkbox"
              checked={urgent}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-pri-norm-1 focus:ring-pri-norm-1"
            />
            <label htmlFor="urgent-checkbox" className="text-sm text-gray-700">
              Set as urgent
            </label>
          </div>
          {urgent && <p className="text-xs text-gray-500 mt-1">Job will be marked as ASAP priority</p>}
        </div>
      </div>

      {/* Address section with saved address button */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-13">
        <div className="w-full md:w-[713px]">
          <div className="space-y-5">
            <h3 className="font-medium text-gray-700">Address</h3>

            <AddressFields
              address={formAddress}
              onChange={setFormAddress}
              required
              labelClasses="text-sm"
              autoComplete={{
                line1: 'street-address',
                line2: 'address-line1',
                city: 'address-level2',
                state: 'address-level1',
                postalCode: 'address-level2'
              }}
            />
          </div>
        </div>

        {/* Use saved address button */}
        <div className="mt-4 md:mt-20">
          <Button
            variant={savedAddressActive ? 'primary' : 'secondary'}
            className="whitespace-nowrap w-full md:w-auto"
            onClick={() => toggleSavedAddress()}
          >
            {savedAddressActive ? 'Clear address' : 'Use saved address'}
          </Button>
        </div>
      </div>

      {/* Continue button with proper urgent state handling */}
      <Button variant="primary" onClick={handleContinue} disabled={!isFormValid()}>
        Save & Continue
      </Button>
    </FormSection>
  );
};

export default TimeLocation;
