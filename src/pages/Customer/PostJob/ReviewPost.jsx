import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import SuccessModal from '../../../components/Modal/SuccessModal';
import { useSelector, useDispatch } from 'react-redux';
import { resetJobData } from '../../../redux/slices/jobPostSlice';
import { Pencil } from 'lucide-react';

const ReviewPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const jobData = useSelector(state => state.jobPost);
  const [posted, setPosted] = useState(false);

  const handlePrev = () => navigate('/customer/post-job/time-location');

  const handlePost = () => {
    // Simulate saving to localStorage list of jobs
    const list = JSON.parse (localStorage.getItem('jobs') || '[]');
    list.push({ id: Date.now(), ...jobData });
    localStorage.setItem('jobs', JSON.stringify(list));
    // clear draft
    localStorage.removeItem('postJobDraft');
    dispatch(resetJobData());
    setPosted(true);
  };

  const closeModal = () => {
    setPosted(false);
  };

  const navigateToDashboard = () => {
    setPosted(false);
    navigate('/customer/dashboard');
  };

  const navigateToJobView = () => {
    setPosted(false);
    navigate('/customer/jobs/ongoing'); // Or appropriate job view route
  };

  return (
    <>
      <div className="font-inter font-medium bg-white p-7.5 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <h2 className="font-manrope font-semibold text-2xl">Make sure everything looks good before posting</h2>
        <div className="grid md:grid-cols-2 gap-6 auto-rows-auto mt-10">
          {/* Service Description */}
          <div className="space-y-3 pl-7.5 md:max-w-[496px] border-l-2 border-neu-light-3 h-auto self-start">
            <div className="flex gap-2.5 items-center">
              <h3 className="font-semibold text-gray-900">Service Description</h3>
              <Button variant="text-pri" size="small" iconOnly leftIcon={<Pencil size={20}  />} onClick={() => navigate('/post-job/describe')} />
            </div>

            <div className="flex flex-col gap-2.5 mt-7.5">
            <p className="text-sm text-neu-dark-1">Service Category</p>
            <p className='text-sm'>{location?.state?.category?.label}</p>
            </div>

            <div className="flex flex-col gap-2.5 mt-11">
            <p className="text-sm text-neu-dark-1">Job Description</p>
            <p className='text-sm'> {location?.state?.data?.description}</p>              
              </div>

              

              <div className="flex flex-col gap-2.5 mt-11">
              <p className="text-sm text-neu-dark-1">Photos</p>
            {location?.state?.file?.some(url => url) && (
              <div className="flex flex-wrap gap-3">
                {location?.state?.file.map((fileUrl, idx) => {
                  if (!fileUrl) return null;
                  
                  // Use the stored file type
                  const isVideo = location.state.file[idx] === 'video';
                    
                  return (
                    <div key={idx} className="w-36 h-28 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {isVideo ? (
                        <video 
                          src={fileUrl}
                          controls
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img 
                          src={URL.createObjectURL(fileUrl)} 
                          alt={`Job media ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            )}              
              </div>
          </div>

          {/* Time & Location */}
          <div className="pl-8 md:max-w-[314px] border-l-2 border-neu-light-3 h-auto self-start">
            <div className="flex gap-2.5 items-center">
              <h3 className="font-semibold text-gray-900">Time & Location</h3>
              <Button 
                variant="text-pri" 
                size="small" 
                iconOnly 
                leftIcon={<Pencil size={20} />} 
                onClick={() => navigate('/post-job/time-location')} 
              />
            </div>

            {/* Date and Time section */}
            <div className="flex items-center gap-13.5 mt-7.5">
              {[
                {
                  label: 'Date',
                  value: location?.state?.date 
                    ? new Date(location?.state?.date).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      }) 
                    : ''
                },
                {
                  label: 'Time',
                  value: location?.state?.time 
                    ? new Date(`2000-01-01T${location?.state?.time}`).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      }) 
                    : ''
                }
              ].map((item, index) => (
                <div key={`time-${index}`} className="flex flex-col gap-2.5">
                  <p className="text-neu-dark-1 text-sm">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Address section */}
            {[
              { label: 'Street Address', value: location?.state?.formAddress?.line1 || 'N/A'},
              { label: 'Nearby Landmark', value: location?.state?.formAddress?.landmark || 'N/A' },
              { label: 'Area / City', value: location?.state?.formAddress?.city|| 'N/A' },
              { label: 'LGA', value: location?.state?.formAddress?.lga || 'N/A' },
              { label: 'State', value: location?.state?.formAddress?.state|| 'N/A' }
            ].map((item, index) => (
              <div key={`address-${index}`} className="flex flex-col gap-2.5 mt-9.5">
                <p className="text-neu-dark-1 text-sm">{item.label}</p>
                <p className="text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-14">
          <Button variant="grey-sec" onClick={handlePrev} className="px-6 py-4.25">Previous</Button>
          <Button variant="primary" onClick={handlePost} className="px-6 py-4.25">Post Job</Button>
        </div>
      </div>

      <SuccessModal
        isOpen={posted}
        onClose={closeModal}
        title="Your Job has been posted!"
        message="You'll receive quotes from artisans shortly."
        primaryButtonText="View Job"
        secondaryButtonText="Back to Dashboard"
        onPrimaryButtonClick={navigateToJobView}
        onSecondaryButtonClick={navigateToDashboard}
      />
    </>
  );
};

export default ReviewPost;
