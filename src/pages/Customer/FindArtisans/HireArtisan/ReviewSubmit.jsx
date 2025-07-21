import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { resetJobData } from '../../../../redux/slices/hireArtisanSlice';
import SuccessModal from '../../../../components/Modal/SuccessModal';
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
  const dispatch = useDispatch();
  const {
    // Using all these variables in the component
    category,
    description,
    fileUrls,
    fileTypes,
    date,
    time,
    address
  } = useSelector((state) => state.hireArtisan);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePrevious = () => {
    // Get the path parts to construct the new path
    const pathParts = location.pathname.split('/');
    const basePath = pathParts.slice(0, pathParts.indexOf('hire-artisan') + 1).join('/');
    navigate(`${basePath}/time-location`);
  };

  const handleSubmit = () => {
    // In a real app, this would make an API call to submit the job request
    // For now, just show the success modal
    setShowSuccessModal(true);
  };

  const handleViewJob = () => {
    // In a real app, navigate to the job details page
    // For this example, navigate to dashboard/jobs
    navigate('/jobs/ongoing');
    dispatch(resetJobData());
  };

  const handleBackToDashboard = () => {
    // Navigate to dashboard
    navigate('/dashboard');
    dispatch(resetJobData());
  };

  const handleEditJobDetails = () => {
    // Get the path parts to construct the new path
    const pathParts = location.pathname.split('/');
    const basePath = pathParts.slice(0, pathParts.indexOf('hire-artisan') + 1).join('/');
    navigate(`${basePath}/describe`);
  };

  const handleEditTimeLocation = () => {
    // Get the path parts to construct the new path
    const pathParts = location.pathname.split('/');
    const basePath = pathParts.slice(0, pathParts.indexOf('hire-artisan') + 1).join('/');
    navigate(`${basePath}/time-location`);
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
                <p className="font-medium">{category || 'Electrical Repairs'}</p>
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

          <div className="flex items-center gap-3 mt-14">
            <Button variant="grey-sec" size="small" onClick={handlePrevious} className="px-6 py-4.25">
              Previous
            </Button>

            <Button variant="primary" size="small" onClick={handleSubmit} className="px-6 py-4.25">
              Submit Job Request
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
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
