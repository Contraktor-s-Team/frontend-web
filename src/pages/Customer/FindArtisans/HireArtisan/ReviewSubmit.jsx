import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useHireArtisan } from '../../../../contexts/HireArtisanContext';
import { useJobListings } from '../../../../contexts/JobListingContext';
import ActionModel from '../../../../components/Modal/ActionModel';
import Button from '../../../../components/Button';

// Reusable field display component to reduce repetitive code
const DisplayField = ({ label, value, spanFull = false }) => (
  <div className={spanFull ? 'md:col-span-2' : ''}>
    <p className="text-sm text-neu-dark-1">{label}</p>
    <p className="">{value}</p>
  </div>
);

const ReviewSubmit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artisanId, tab } = useParams(); // Extract both tab and artisanId
  const { state: hireArtisanState, dispatch, hireArtisan } = useHireArtisan();
  const { state: jobListingState } = useJobListings();

  // Debug logging
  // console.log('ReviewSubmit Debug Info:', {
  //   artisanId,
  //   tab,
  //   fullPath: location.pathname,
  //   allParams: useParams(),
  //   windowLocation: window.location.href
  // });
  const {
    // Using all these variables in the component
    jobTitle,
    category,
    description,
    photos,
    fileUrls,
    fileTypes,
    date,
    time,
    urgent,
    address,
    artisan,
    budgetType,
    budgetAmount
  } = hireArtisanState;

  // Get categories from API
  const categories = jobListingState.categories.data?.data || [];

  // Function to get category name from ID
  const getCategoryName = (categoryId) => {
    const categoryData = categories.find((cat) => cat.id === categoryId);
    return categoryData?.name || categoryId || 'Mot Specified';
  };

  const [showActionModel, setShowActionModel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState('');
  const [price, setPrice] = useState(''); // Add price field

  const handlePrevious = () => {
    // Navigate to time-location step (relative navigation within nested routes)
    navigate('../time-location');
  };

  const handleSubmit = async () => {
    if (!price) {
      setErrors('Please provide a price for this job.');
      return;
    }

    // Debug: Check if artisanId is available
    console.log('Debug - artisanId from params:', artisanId);
    console.log('Debug - Current URL:', window.location.href);

    if (!artisanId) {
      setErrors('Artisan ID is missing. Please try again.');
      return;
    }

    // Validate GUID format (more permissive for standard GUIDs)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(artisanId)) {
      console.error('Invalid artisan ID format:', artisanId);
      setErrors('Invalid artisan ID format. Please try again.');
      return;
    }

    // Check for null GUID
    const nullGuid = '00000000-0000-0000-0000-000000000000';
    if (artisanId === nullGuid) {
      console.error('Null GUID received as artisan ID');
      setErrors('Invalid artisan selected. Please go back and select an artisan.');
      return;
    }

    setIsSubmitting(true);
    setErrors('');

    try {
      // Validate required fields (similar to post job logic)
      const subcategoryId = category?.value || category;
      const validSubcategoryId = String(subcategoryId);

      if (
        !jobTitle ||
        !description ||
        !validSubcategoryId ||
        validSubcategoryId === 'undefined' ||
        validSubcategoryId === 'null'
      ) {
        setErrors('Please ensure all required fields (Title, Description, and Category) are filled out.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Required fields for API (same structure as post job)
      formData.append('Title', jobTitle);
      formData.append('Description', description);
      formData.append('ArtisanSubcategoryId', validSubcategoryId);

      // ScheduleType - API expects "ASAP" or "SCHEDULED"
      const scheduleType = urgent ? 'ASAP' : 'SCHEDULED';
      formData.append('ScheduleType', scheduleType);

      // Optional budget fields - only include when "Set a budget" is selected (match PostJob structure)
      if (budgetType === true) {
        formData.append('ProposalRequiresPrice', true);
        if (budgetAmount) {
          formData.append('Budget', budgetAmount);
        }
      }

      // Append images (if any)
      const files = photos.filter((photo) => photo instanceof File);
      files.forEach((file, index) => {
        console.log(`Appending file ${index}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });
        formData.append('Images', file);
      });

      // Use hireArtisan function (which will add ArtisanId and price)
      await hireArtisan(
        formData,
        artisanId,
        price,
        // Success callback
        () => {
          dispatch({ type: 'RESET_JOB_DATA' });
          setShowSuccessModal(true);
          setIsSubmitting(false);
        },
        // Error callback
        () => {
          setErrors('Failed to submit job request. Please try again.');
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      console.error('Job submission failed:', error);
      setErrors(error.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const handleViewJob = () => {
    // In a real app, navigate to the job details page
    // For this example, navigate to dashboard/jobs
    navigate('/jobs/ongoing');
    dispatch({ type: 'RESET_JOB_DATA' });
  };

  const handleBackToDashboard = () => {
    // Navigate to dashboard
    navigate('/customer/dashboard/posted');
    dispatch({ type: 'RESET_JOB_DATA' });
  };

  const handleEditJobDetails = () => {
    // Navigate to describe step (relative navigation within nested routes)
    navigate('../describe');
  };

  const handleEditTimeLocation = () => {
    // Navigate to time-location step (relative navigation within nested routes)
    navigate('../time-location');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="font-inter font-medium bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">
          Confirm the details of the job before submitting
        </h2>

        <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

        <div className="space-y-8">
          {/* Service Description Section */}
          <div className="border-b-[1.5px] border-neu-light-3 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-medium text-gray-900">Service Description</h3>
              <button onClick={handleEditJobDetails} className="text-pri-norm-1 flex items-center">
                <Pencil size={22} className="mr-1" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-sm text-neu-dark-1 mb-2.5">Service Category</p>
                <p className="font-medium">{getCategoryName(category)}</p>
              </div>

              <div>
                <p className="text-sm text-neu-dark-1 mb-2.5">Job Title</p>
                <p className="font-medium">{jobTitle}</p>
              </div>

              <div>
                <p className="text-sm text-neu-dark-1 mb-2.5">Job Description</p>
                <p className="text-sm">{description}</p>
              </div>

              {/* Photo thumbnails */}
              {fileUrls.some((url) => url !== null) && (
                <div>
                  <p className="text-sm text-neu-dark-1 mb-2.5">Photos</p>
                  <div className="flex space-x-4">
                    {fileUrls.map(
                      (url, index) =>
                        url && (
                          <div key={index} className="w-40 h-28 bg-gray-200 rounded-md overflow-hidden">
                            {fileTypes[index] === 'image' ? (
                              <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              <video src={url} controls className="w-full h-full object-cover">
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time & Location Section */}
          <div>
            <div className="flex items-center gap-3 mb-7.5">
              <h3 className="">Time & Location</h3>
              <button onClick={handleEditTimeLocation} className="text-pri-norm-1 flex items-center">
                <Pencil size={22} className="mr-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DisplayField label="Date" value={formatDate(date)} />
              <DisplayField label="Time" value={time} />
              <DisplayField label="Street Address" value={address?.street} spanFull />
              <DisplayField label="Nearby Landmark" value={address?.landmark} spanFull />
              <DisplayField label="Area / City" value={address?.city} />
              <DisplayField label="P.O Box" value="112345" />
            </div>
          </div>

          {/* Price Section */}
          <div className="border-b-[1.5px] border-neu-light-3 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Price</h3>
            <div>
              <label htmlFor="price" className="text-sm text-neu-dark-1 mb-2.5 block">
                Enter your price for this job (NGN)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pri-norm-1 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Error Display */}
          {errors && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{errors}</div>}

          <div className="flex items-center gap-2.5 mt-14">
            <Button variant="grey-sec" onClick={handlePrevious} className="px-6 py-4.25">
              Previous
            </Button>

            <Button variant="primary" onClick={handleSubmit} className="px-6 py-4.25" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Job Request'}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ActionModel
        isOpen={showActionModel}
        onClose={() => setShowActionModel(false)}
        title="Job Request Sent to Artisan"
        message="The artisan has received your job request. You'll be notified once they review and accept the job."
        primaryButtonText="View Job"
        secondaryButtonText="Back to Dashboard"
        onPrimaryButtonClick={handleViewJob}
        onSecondaryButtonClick={handleBackToDashboard}
      />
    </>
  );
};

export default ReviewSubmit;
