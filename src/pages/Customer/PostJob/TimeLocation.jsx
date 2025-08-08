import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobData } from '../../../redux/slices/jobPostSlice';
import { FormSection, DateTimePicker, AddressFields, WorkflowButtons } from '../../../components/FormWorkflow';
import Button from '../../../components/Button/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const TimeLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = useSelector((state) => state.jobPost);

  const [date, setDate] = useState(jobData.date);
  const [time, setTime] = useState(jobData.time);
  const [urgent, setUrgent] = useState(jobData.urgent);
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
    setUrgent(e.target.checked);
  };

  const handleDateTimeChange = (dateTimeValue) => {
    setDate(dateTimeValue.date || '');
    setTime(dateTimeValue.time || '');
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

    dispatch(updateJobData({ date, time, urgent, address: addressData }));
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
    return date && time && formAddress.line1 && formAddress.city && formAddress.postalCode && formAddress.state;
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
          <DateTimePicker value={{ date, time }} onChange={handleDateTimeChange} required labelClasses="text-sm" />
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

      {/* CHANGE: Updated navigation to pass all job data including files from Redux */}
      <Button
        variant="primary"
        onClick={() => {
          saveFormData();
          navigate('/customer/post-job/review', {
            state: {
              jobData,
              date,
              time,
              formAddress,
              data: {
                jobtitle: jobData.jobTitle, // Use Redux data
                description: jobData.description // Use Redux data
              },
              file: jobData.files || [], // Use files from Redux
              category: jobData.subcategory // Use Redux data
            }
          });
        }}
        disabled={!isFormValid()}
      >
        Save & Continue
      </Button>
    </FormSection>
  );
};

export default TimeLocation;
