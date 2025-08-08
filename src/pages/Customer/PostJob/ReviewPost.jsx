import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import { resetJobData } from '../../../redux/slices/jobPostSlice';
import { postJobAction } from '../../../redux/Jobs/JobsAction';
import Button from '../../../components/Button/Button';
import SuccessModal from '../../../components/Modal/SuccessModal';
import LoaderComp from '../../../assets/animation/loader';
import { Pencil } from 'lucide-react';

const ReviewPost = ({
  postJob,
  jobLoading,
  jobError,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const jobData = useSelector(state => state.jobPost);
  
  const [posted, setPosted] = useState(false);
  const [errors, setErrors] = useState(false);

  const handlePrev = () => navigate('/customer/post-job/time-location');

  // CHANGE 2: Moved postJob submission logic here from DescribeJob
  const handlePost = async () => {
    setErrors(false);
    
    try {
      const formData = new FormData();

      // Get job data from Redux state and location state
      const jobTitle = jobData.jobTitle || location?.state?.data?.jobtitle;
      const description = jobData.description || location?.state?.data?.description;
      const subcategory = jobData.subcategory || location?.state?.category;
      const budgetType = jobData.budgetType;
      const budgetAmount = jobData.budgetAmount;
      const files = jobData.files || location?.state?.file || [];

      // Build FormData for API submission
      formData.append('title', jobTitle);
      formData.append('description', description);
      formData.append('artisanSubcategoryId', subcategory?.value);
      formData.append('ProposalRequiresPrice', budgetType);
      
      if (budgetType === true && budgetAmount) {
        formData.append('Budget', budgetAmount);
      }

      // Append files
      files.forEach((file) => {
        formData.append('images', file);
      });

      console.log("Submitting job data", formData);

      // CHANGE 3: Submit job via API
      await postJob(formData, 
        () => {
          // Success callback
          console.log("Job posted successfully");
          
          // Clear draft and reset Redux state
          localStorage.removeItem('postJobDraft');
          dispatch(resetJobData());
          setPosted(true);
        },
        () => {
          // Error callback
          setErrors(true);
        }
      );
      
    } catch (error) {
      console.error('Job submission failed:', error);
      setErrors(true);
    }
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
    navigate('/customer/jobs/ongoing');
  };

  return (
    <>
      <div className="font-inter font-medium bg-white p-7.5 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <h2 className="font-manrope font-semibold text-2xl">Make sure everything looks good before posting</h2>
        
        {/* CHANGE 4: Added error display */}
        {errors && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>{jobError || 'An error occurred while posting the job. Please try again.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 auto-rows-auto mt-10">
          {/* Service Description */}
          <div className="space-y-3 pl-7.5 md:max-w-[496px] border-l-2 border-neu-light-3 h-auto self-start">
            <div className="flex gap-2.5 items-center">
              <h3 className="font-semibold text-gray-900">Service Description</h3>
              {/* CHANGE 5: Updated edit button to go to describe job page */}
              <Button 
                variant="text-pri" 
                size="small" 
                iconOnly 
                leftIcon={<Pencil size={20} />} 
                onClick={() => navigate('/customer/post-job/describe')} 
              />
            </div>

            <div className="flex flex-col gap-2.5 mt-7.5">
              <p className="text-sm text-neu-dark-1">Service Category</p>
              <p className='text-sm'>{(jobData.subcategory || location?.state?.category)?.label}</p>
            </div>

            <div className="flex flex-col gap-2.5 mt-11">
              <p className="text-sm text-neu-dark-1">Job Description</p>
              <p className='text-sm'>{jobData.description || location?.state?.data?.description}</p>              
            </div>

            <div className="flex flex-col gap-2.5 mt-11">
              <p className="text-sm text-neu-dark-1">Photos</p>
              {/* CHANGE: Updated to properly handle files from Redux state or location state */}
              {(() => {
                const files = jobData.files || location?.state?.file || [];
                return files.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {files.map((file, idx) => {
                      if (!file) return null;
                      
                      // Check if it's a File object or just a file reference
                      const isVideo = file.type ? file.type.startsWith('video/') : false;
                      const fileUrl = file instanceof File ? URL.createObjectURL(file) : file;
                        
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
                              src={fileUrl} 
                              alt={`Job media ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                );
              })()}              
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
                onClick={() => navigate('/customer/post-job/time-location')} 
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
          <Button variant="grey-sec" onClick={handlePrev} className="px-6 py-4.25">
            Previous
          </Button>
          {/* CHANGE 6: Updated Post Job button with loading state */}
          <Button 
            variant="primary" 
            onClick={handlePost} 
            className="px-6 py-4.25"
            disabled={jobLoading}
          >
            {jobLoading ? (
              <LoaderComp />
            ) : (
              "Post Job"
            )}
          </Button>
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

// CHANGE 7: Added Redux connection for postJob action
const mapStoreToProps = (state) => {
  return {
    jobLoading: state?.jobpost?.loading,
    jobError: state?.jobpost?.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postJob: (postState, successCallback, errorCallback) => 
      dispatch(postJobAction(postState, successCallback, errorCallback)),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(ReviewPost);