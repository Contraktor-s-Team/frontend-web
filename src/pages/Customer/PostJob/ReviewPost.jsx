import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useJobPost } from '../../../contexts/JobPostContext';
import { useJobListings } from '../../../contexts/JobListingContext';
import Button from '../../../components/Button/Button';
import ActionModel from '../../../components/Modal/ActionModel';
import LoaderComp from '../../../assets/animation/loader';
import { Pencil } from 'lucide-react';

const ReviewPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: jobData, dispatch } = useJobPost();
  const { postJobListing, state: jobListingContextState, fetchCategories } = useJobListings();
  const [posted, setPosted] = useState(false);
  const [errors, setErrors] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);

  // Extract the correct state objects from JobListingContext
  const jobPostState = jobListingContextState?.jobListingPost || { loading: false, data: {}, error: {} };
  const categoriesState = jobListingContextState?.categories || { loading: false, data: {}, error: {} };

  // Clear any previous errors when component mounts and fetch categories
  useEffect(() => {
    setErrors(false);
    // Fetch categories if not already loaded to display category names
    if (!categoriesState.data?.data?.length && !categoriesState.loading) {
      fetchCategories();
    }
  }, [fetchCategories, categoriesState.data, categoriesState.loading]);

  const handlePrev = () => navigate('/customer/post-job/time-location');

  // Updated handlePost function in ReviewPost.jsx
  // Updated handlePost function in ReviewPost.jsx with fixed budget logic

  const handlePost = async () => {
    setErrors(false);
    setJobLoading(true);

    try {
      // Get job data from Redux state and location state
      const jobTitle = jobData.jobTitle || location?.state?.data?.jobtitle || location?.state?.jobTitle;
      const description = jobData.description || location?.state?.data?.description || location?.state?.description;
      const subcategory = jobData.subcategory || location?.state?.category || location?.state?.subcategory;
      const budgetType = jobData.budgetType;
      const budgetAmount = jobData.budgetAmount;

      // Get urgent flag from multiple sources
      const urgent = jobData.urgent || location?.state?.urgent || false;

      // Debug: Log actual data to see the structure
      console.log('Validation Debug:', {
        jobTitle,
        description,
        subcategory,
        urgent,
        budgetType,
        budgetAmount,
        subcategoryType: typeof subcategory,
        subcategoryValue: subcategory?.value,
        jobData,
        locationState: location?.state
      });

      // Handle files from multiple sources
      let files = [];
      if (jobData.files && Array.isArray(jobData.files)) {
        files = jobData.files;
      } else if (jobData.photos && Array.isArray(jobData.photos)) {
        files = jobData.photos.filter((photo) => photo !== null);
      } else if (location?.state?.file && Array.isArray(location.state.file)) {
        files = location.state.file;
      }

      // Get address and time data from location state or JobPost context
      const date = jobData.date || location?.state?.date;
      const time = jobData.time || location?.state?.time;
      const address = jobData.address || location?.state?.formAddress;

      // Validate required fields (Title, Description, ArtisanSubCategoryId)
      const subcategoryId = subcategory?.value || subcategory;
      const validSubcategoryId = String(subcategoryId);

      if (
        !jobTitle ||
        !description ||
        !validSubcategoryId ||
        validSubcategoryId === 'undefined' ||
        validSubcategoryId === 'null'
      ) {
        console.log('Validation failed:', {
          hasTitle: !!jobTitle,
          hasDescription: !!description,
          hasSubcategory: !!subcategoryId,
          validSubcategoryId,
          subcategoryValue: subcategory
        });
        setErrors('Please ensure all required fields (Title, Description, and Category) are filled out.');
        setJobLoading(false);
        return;
      }

      const formData = new FormData();

      // Required fields for API
      formData.append('Title', jobTitle);
      formData.append('Description', description);
      formData.append('ArtisanSubcategoryId', validSubcategoryId);

      // FIXED: Budget logic - handle consultation vs custom budget
      if (budgetType === true) {
        // User chose "Set a budget" - use their custom amount
        formData.append('ProposalRequiresPrice', true);
        if (budgetAmount) {
          formData.append('Budget', budgetAmount);
        }
      } else {
        // User chose "I will negotiate the price" - this means consultation
        // Set default consultation budget of 18,000
        formData.append('ProposalRequiresPrice', false);
        formData.append('Budget', '18000'); // Default consultation budget
      }

      // ScheduleType - FIXED: Properly implement urgent functionality
      // ASAP: when user checks "set as urgent" checkbox
      // SCHEDULED: when user selects specific date/time and doesn't check urgent
      const scheduleType = urgent ? 'ASAP' : 'SCHEDULED';
      formData.append('ScheduleType', scheduleType);

      // Additional scheduling fields based on urgent status
      if (urgent) {
        // For urgent jobs, we still want to include date/time if provided
        if (date) {
          formData.append('PreferredDate', date);
        }
        if (time) {
          formData.append('PreferredTime', time);
        }
      } else {
        // For scheduled jobs, date/time are required
        if (date) {
          formData.append('ScheduledDate', date);
        }
        if (time) {
          formData.append('ScheduledTime', time);
        }
      }

      // Append images (if any)
      files.forEach((file, index) => {
        console.log(`Appending file ${index}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });
        formData.append('Images', file);
      });

      // Debug: Log all FormData entries
      console.log('FormData entries being sent:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      console.log('Submitting job data with fixed budget logic:', {
        Title: jobTitle,
        Description: description,
        ArtisanSubcategoryId: validSubcategoryId,
        ScheduleType: scheduleType,
        IsUrgent: urgent,
        BudgetType: budgetType,
        ProposalRequiresPrice: budgetType === true,
        Budget: budgetType === true ? budgetAmount || 'custom' : '18000',
        BudgetLogic: budgetType === true ? 'Custom budget set by user' : 'Consultation budget (18k)',
        ImagesCount: files.length,
        hasDate: !!date,
        hasTime: !!time,
        urgentLogic: `urgent: ${urgent} → ScheduleType: ${scheduleType}`
      });

      // Use JobListingContext postJobListing function
      await postJobListing(
        formData,
        // Success callback
        () => {
          localStorage.removeItem('postJobDraft');
          dispatch({ type: 'RESET_JOB_DATA' });
          setPosted(true);
          setJobLoading(false);
        },
        // Error callback
        () => {
          setErrors(true);
          setJobLoading(false);
        }
      );
    } catch (error) {
      console.error('Job submission failed:', error);
      setErrors(error.message || 'An unexpected error occurred');
      setJobLoading(false);
    }
  };

  const closeModal = () => {
    setPosted(false);
  };

  const navigateToDashboard = () => {
    setPosted(false);
    navigate('/customer/dashboard/posted');
  };

  const navigateToJobView = () => {
    setPosted(false);
    navigate('/customer/jobs/ongoing');
  };

  // Debug: Log the data to see what's available
  console.log('ReviewPost Debug:', {
    jobData,
    locationState: location?.state,
    jobListingContextState,
    jobPostState,
    categoriesState,
    categoryData: {
      fromJobData: jobData.subcategory,
      fromLocation: location?.state?.category,
      categoryId: jobData.category,
      subcategoryId: jobData.subcategory,
      availableCategories: categoriesState.data?.data
    }
  });

  return (
    <>
      <div className="font-inter font-medium bg-white p-7.5 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <h2 className="font-manrope font-semibold text-2xl">Make sure everything looks good before posting</h2>

        {/* Success message display */}
        {jobPostState.data && Object.keys(jobPostState.data).length > 0 && !posted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-green-700">
                  <p>Job posted successfully!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed error display to prevent showing errors on initial state */}
        {(errors ||
          (jobPostState.error && typeof jobPostState.error === 'string' && jobPostState.error.trim() !== '') ||
          (typeof jobPostState.error === 'object' &&
            jobPostState.error &&
            Object.keys(jobPostState.error).length > 0)) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>
                    {typeof errors === 'string'
                      ? errors
                      : typeof jobPostState.error === 'string'
                      ? jobPostState.error
                      : typeof jobPostState.error === 'object' && jobPostState.error
                      ? JSON.stringify(jobPostState.error)
                      : 'An error occurred while posting the job. Please try again.'}
                  </p>
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
              <p className="text-sm">
                {(() => {
                  // Get category data from JobListingContext to display category name
                  const categories = categoriesState.data?.data || [];
                  const categoryId = jobData.category || location?.state?.categoryId;
                  const selectedCategory = categories.find((cat) => cat.id === categoryId);

                  if (selectedCategory) {
                    return selectedCategory.name;
                  }

                  // Fallback: try to get from subcategory object if it contains category info
                  const subcategory = jobData.subcategory || location?.state?.category;
                  if (subcategory?.categoryName) {
                    return subcategory.categoryName;
                  }

                  return 'No category selected';
                })()}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mt-7.5">
              <p className="text-sm text-neu-dark-1">Service Subcategory</p>
              <p className="text-sm">
                {(() => {
                  // Get subcategory data from JobListingContext to display subcategory name
                  const categories = categoriesState.data?.data || [];
                  const categoryId = jobData.category || location?.state?.categoryId;
                  const subcategoryId = jobData.subcategory || location?.state?.subcategoryId;
                  const selectedCategory = categories.find((cat) => cat.id === categoryId);
                  const selectedSubcategory = selectedCategory?.subcategories?.find((sub) => sub.id === subcategoryId);

                  if (selectedSubcategory) {
                    return selectedSubcategory.name;
                  }

                  // Fallback: try to get from location state
                  const subcategory = location?.state?.category;
                  if (subcategory?.label) {
                    return subcategory.label;
                  }

                  return 'No subcategory selected';
                })()}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mt-11">
              <p className="text-sm text-neu-dark-1">Job Title</p>
              <p className="text-sm">{jobData.jobTitle || location?.state?.data?.jobtitle || 'No title provided'}</p>
            </div>

            <div className="flex flex-col gap-2.5 mt-11">
              <p className="text-sm text-neu-dark-1">Job Description</p>
              <p className="text-sm">
                {jobData.description || location?.state?.data?.description || 'No description provided'}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mt-11">
              <p className="text-sm text-neu-dark-1">Budget</p>
              <p className="text-sm">
                {jobData.budgetType === false
                  ? 'I will negotiate the price'
                  : jobData.budgetAmount
                  ? `₦${jobData.budgetAmount}`
                  : 'Budget not specified'}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 mt-11">
              <p className="text-sm text-neu-dark-1">Photos</p>
              {/* Updated to properly handle files from multiple sources */}
              {(() => {
                // Get files from multiple possible sources
                let files = [];
                if (jobData.files && Array.isArray(jobData.files)) {
                  files = jobData.files;
                } else if (jobData.photos && Array.isArray(jobData.photos)) {
                  files = jobData.photos.filter((photo) => photo !== null);
                } else if (location?.state?.file && Array.isArray(location.state.file)) {
                  files = location.state.file;
                }

                return files.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {files
                      .map((file, idx) => {
                        if (!file) return null;

                        // Check if it's a File object or just a file reference
                        const isVideo = file.type ? file.type.startsWith('video/') : false;
                        const fileUrl = file instanceof File ? URL.createObjectURL(file) : file;

                        return (
                          <div key={idx} className="w-36 h-28 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                            {isVideo ? (
                              <video src={fileUrl} controls className="w-full h-full object-cover">
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img src={fileUrl} alt={`Job media ${idx + 1}`} className="w-full h-full object-cover" />
                            )}
                          </div>
                        );
                      })
                      .filter(Boolean)}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No photos uploaded</p>
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
                  value: (() => {
                    const date = jobData.date || location?.state?.date;
                    if (!date) return 'No date selected';
                    try {
                      return new Date(date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      });
                    } catch (error) {
                      return 'Invalid date';
                    }
                  })()
                },
                {
                  label: 'Time',
                  value: (() => {
                    const time = jobData.time || location?.state?.time;
                    if (!time) return 'No time selected';
                    try {
                      const [hours, minutes] = time.split(':');
                      const date = new Date();
                      date.setHours(parseInt(hours), parseInt(minutes));
                      return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                    } catch (error) {
                      return 'Invalid time';
                    }
                  })()
                }
              ].map((item, index) => (
                <div key={`time-${index}`} className="flex flex-col gap-2.5">
                  <p className="text-neu-dark-1 text-sm">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Urgent flag display */}
            <div className="flex flex-col gap-2.5 mt-9.5">
              <p className="text-neu-dark-1 text-sm">Priority</p>
              <p className="text-sm">{jobData.urgent || location?.state?.urgent ? 'Urgent' : 'Normal'}</p>
            </div>

            {/* Address section */}
            {(() => {
              const address = jobData.address || location?.state?.formAddress;
              const addressFields = [
                {
                  label: 'Street Address',
                  value: address?.line1 || address?.street || 'Not provided'
                },
                {
                  label: 'Nearby Landmark',
                  value: address?.line2 || address?.landmark || 'Not provided'
                },
                {
                  label: 'Area / City',
                  value: address?.city || 'Not provided'
                },
                {
                  label: 'LGA',
                  value: address?.postalCode || address?.lga || 'Not provided'
                },
                {
                  label: 'State',
                  value: address?.state || 'Not provided'
                }
              ];

              return addressFields.map((item, index) => (
                <div key={`address-${index}`} className="flex flex-col gap-2.5 mt-9.5">
                  <p className="text-neu-dark-1 text-sm">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-14">
          <Button variant="grey-sec" onClick={handlePrev} className="px-6 py-4.25">
            Previous
          </Button>
          {/* Updated Post Job button with loading state from context */}
          <Button
            variant="primary"
            onClick={handlePost}
            className="px-6 py-4.25"
            disabled={jobLoading || jobPostState.loading}
          >
            {jobLoading || jobPostState.loading ? <LoaderComp /> : 'Post Job'}
          </Button>
        </div>
      </div>

      <ActionModel
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
