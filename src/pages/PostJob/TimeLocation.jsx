import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import TextInput from '../../components/Form/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobData } from '../../redux/slices/jobPostSlice';
import { Calendar, Clock } from 'lucide-react';

const TimeLocation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobData = useSelector(state => state.jobPost);

  const [date, setDate] = useState(jobData.date);
  const [time, setTime] = useState(jobData.time);
  const [urgent, setUrgent] = useState(jobData.urgent);
  const [address, setAddress] = useState(jobData.address || {
    street: '',
    landmark: '',
    city: '',
    lga: '',
    state: ''
  });

  const handleChange = (field) => (e) => {
    setAddress({ ...address, [field]: e.target.value });
  };

  const handleNext = () => {
    dispatch(updateJobData({ date, time, urgent, address }));
    navigate('/dashboard/post-job/review');
  };

  const handlePrev = () => navigate('/dashboard/post-job/describe');

  const handleCheckboxChange = (e) => {
    setUrgent(e.target.checked);
  };

  const fillSavedAddress = () => {
    // Stub placeholder – fill with demo address
    setAddress({
      street: '23 Adeyemi Street',
      landmark: 'Close to Yaba Tech gate',
      city: 'Yaba',
      lga: 'Ikosi-Isheri',
      state: 'Lagos',
    });
  };

  return (
    <div className="font-inter font-medium space-y-8 bg-white p-7.5">
      <h1 className="font-manrope text-xl font-semibold text-gray-900">When and where should this be done?</h1>
      
      {/* Date and Time section with urgent checkbox */}
      <div className="flex gap-13">
        <div className="md:w-[713px]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Date Input */}
            <div>
              <TextInput
                label="Date"
                labelClasses="text-sm"
                type="date"
                placeholder="dd / mm / yyyy"
                // value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                // trailingIcon={<Calendar className="h-5 w-5 text-gray-400" />}
              />
            </div>

            {/* Time Input */}
            <div>
              <TextInput
                label="Time"
                labelClasses="text-sm"
                type="time"
                placeholder="Pick preferred time"
                // value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                // trailingIcon={<Clock className="h-5 w-5 text-gray-400" />}
              />
            </div>
          </div>
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
      <div className="flex gap-13">
        <div className="md:w-[713px]">
          <div className="space-y-5">
            <h3 className="font-medium text-gray-700">Address</h3>
            
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Street Address */}
              <TextInput
                label="Street Address"
                labelClasses="text-sm"
                placeholder="e.g., 23 Adeyemi Street"
                // value={address.street || ''}
                onChange={handleChange('street')}
                required
              />
              
              {/* Nearby Landmark */}
              <TextInput
                label="Nearby Landmark"
                labelClasses="text-sm"
                placeholder="e.g., Close to Yaba Tech Gate"
                // value={address.landmark || ''}
                onChange={handleChange('landmark')}
                required
              />
              
              {/* Area/City */}
              <TextInput
                label="Area / City"
                labelClasses="text-sm"
                placeholder="e.g., Yaba"
                // value={address.city || ''}
                onChange={handleChange('city')}
                required
              />
              
              {/* LGA */}
              <TextInput
                label="LGA"
                labelClasses="text-sm"
                placeholder="e.g., Ikosi-Isheri"
                // value={address.lga || ''}
                onChange={handleChange('lga')}
                required
              />
              
              {/* State */}
              <TextInput
                label="State"
                labelClasses="text-sm"
                placeholder="e.g., Lagos state"
                // value={address.state || ''}
                onChange={handleChange('state')}
                required
              />
            </div>
          </div>
        </div>

        {/* Use saved address button */}
        <div>
          <Button 
            variant="primary-trans" 
            className="whitespace-nowrap mt-20" 
            onClick={fillSavedAddress}
          >
            Use saved address
          </Button>
        </div>
      </div>


      <div className="flex gap-3 mt-14">
        <Button variant="grey-sec" onClick={handlePrev}>Previous</Button>
        <Button 
          variant="primary" 
          onClick={handleNext} 
          disabled={!date || !time || !address?.street || !address?.landmark || !address?.city || !address?.lga || !address?.state}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default TimeLocation;
