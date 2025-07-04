import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobData, updateAddress } from '../../../redux/slices/hireArtisanSlice';
import { FormSection, DateTimePicker, AddressFields, WorkflowButtons } from '../../../components/FormWorkflow';
import Button from '../../../components/Button/Button';

const TimeLocation = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { date, time, urgent, address } = useSelector((state) => state.hireArtisan);

  const [formDate, setFormDate] = useState(date);
  const [formTime, setFormTime] = useState(time);
  const [formUrgent, setFormUrgent] = useState(urgent);
  const [formAddress, setFormAddress] = useState({
    line1: address?.street || '',
    line2: address?.landmark || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.lga || '',
    country: 'Nigeria'
  });

  // These functions have been replaced by WorkflowButtons component

  const saveFormData = () => {
    // Update the time and date in Redux
    dispatch(
      updateJobData({
        date: formDate,
        time: formTime,
        urgent: formUrgent
      })
    );

    // Update address in Redux
    dispatch(
      updateAddress({
        street: formAddress.line1,
        landmark: formAddress.line2,
        city: formAddress.city,
        lga: formAddress.postalCode,
        state: formAddress.state
      })
    );
  };

  const handleUseSavedAddress = () => {
    // In a real app, this would fetch the user's saved address from the backend
    // For demo purposes, let's populate with sample data
    setFormAddress({
      line1: '23 Adeyemi Street',
      line2: 'Close to Yaba Tech main gate',
      city: 'Yaba, Lagos',
      postalCode: 'Ikosi-Isheri',
      state: 'Lagos state',
      country: 'Nigeria'
    });
  };

  const isFormValid = () => {
    return formDate && formTime && formAddress.line1 && formAddress.city && formAddress.state && formAddress.postalCode;
  };

  // Get the path parts to construct the navigation paths
  const pathParts = location.pathname.split('/');
  const basePath = pathParts.slice(0, pathParts.indexOf('hire-artisan') + 1).join('/');
  const previousPath = `${basePath}/describe`;
  const nextPath = `${basePath}/review`;

  const handleDateTimeChange = (dateTimeValue) => {
    setFormDate(dateTimeValue.date || '');
    setFormTime(dateTimeValue.time || '');
  };

  return (
    <FormSection title="When and where should this be done?" className="space-y-6">
      <div className="">
        <DateTimePicker
          value={{ date: formDate, time: formTime }}
          onChange={handleDateTimeChange}
          required
          labelClasses="text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="urgent"
          checked={formUrgent}
          onChange={(e) => setFormUrgent(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
          Set as urgent
        </label>
      </div>

      <div className="pt-4">
        <h3 className="text-base font-medium text-gray-700 mb-4">Address</h3>

        <AddressFields address={formAddress} onChange={setFormAddress} required labelClasses="text-sm" />

        <div className="mt-5.25">
          <Button variant="secondary" onClick={handleUseSavedAddress} className="px-6 py-4.25">
            Use saved address
          </Button>
        </div>
      </div>

      <WorkflowButtons
        previousPath={previousPath}
        nextPath={nextPath}
        onNext={(navigate) => {
          saveFormData();
          if (isFormValid()) {
            navigate();
          }
        }}
        onPrevious={(navigate) => {
          saveFormData();
          navigate();
        }}
        disableNext={!isFormValid()}
        className="mt-14"
        alignButtons="start"
        nextLabel="Save & Continue"
        btnClassName="px-6 py-4.25"
      />
    </FormSection>
  );
};

export default TimeLocation;
