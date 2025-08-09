import { useState, useEffect } from 'react';
import { X, Plus, CheckCircle } from 'lucide-react';

// Success Toast Component
const SuccessPopup = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 font-inter">Success</p>
            <p className="text-sm text-gray-600 font-inter mt-1">{message}</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Modal Component
const SuccessModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Modal Content */}
        <div className="p-8 text-center">
          {/* Check Circle */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FDF1DC' }}>
            <CheckCircle size={32} style={{ color: '#F3A218' }} />
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Application Sent</h2>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">
            Your application for this job has been sent. You will be notified when the customer accepts your application.
          </p>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default function QuoteModal({ 
  isOpen, 
  setIsOpen, 
  job, 
  postProposal, 
  navigate, 
  onApplicationSuccess 
}) {
  const [formData, setFormData] = useState({
    topEstimatedCost: '',
    costBreakdown: [{ name: '', amount: '' }],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Debug logging
  useEffect(() => {
    if (job) {
      console.log('Job object:', job);
      console.log('Job ID field:', job.id || job.jobId);
    }
  }, [job]);

  // Format number with commas
  const formatWithCommas = (value) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    // Add commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (field, value) => {
    if (field === 'topEstimatedCost') {
      // Format the value with commas
      const formattedValue = formatWithCommas(value);
      setFormData((prev) => ({
        ...prev,
        [field]: formattedValue
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCostBreakdownChange = (index, field, value) => {
    const newCostBreakdown = [...formData.costBreakdown];
    newCostBreakdown[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      costBreakdown: newCostBreakdown
    }));
  };

  const addCostItem = () => {
    setFormData((prev) => ({
      ...prev,
      costBreakdown: [...prev.costBreakdown, { name: '', amount: '' }]
    }));
  };

  const removeCostItem = (index) => {
    if (formData.costBreakdown.length > 1) {
      const newCostBreakdown = formData.costBreakdown.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        costBreakdown: newCostBreakdown
      }));
    }
  };

  const validateForm = () => {
    // Check if job exists and has an ID
    if (!job || (!job.id && !job.jobId)) {
      alert('Job information is missing. Please refresh and try again.');
      return false;
    }

    if (!formData.topEstimatedCost.trim()) {
      alert('Please enter the top estimated cost');
      return false;
    }

    if (!formData.message.trim()) {
      alert('Please enter a message for the customer');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty cost breakdown items
      const validCostBreakdown = formData.costBreakdown.filter((item) => item.name.trim() && item.amount.trim());

      // Use the correct ID field - try both possibilities
      const jobId = job.id || job.jobId;
      
      // Remove commas from the cost for API submission
      const cleanCost = formData.topEstimatedCost.replace(/,/g, '');
      
      // Prepare the proposal data according to your API structure
      const proposalData = {
        jobId: jobId,
        proposedPrice: cleanCost,
        message: formData.message
      };

      console.log('Submitting proposal with correct jobId:', proposalData);

      // Call the postProposal action
      await postProposal(
        proposalData,
        () => {
          // Mark as submitted to disable button
          setIsSubmitted(true);
          
          // Notify parent component about successful application
          if (onApplicationSuccess && jobId) {
            onApplicationSuccess(jobId);
          }
          
          // Show success modal
          setShowSuccessModal(true);
          
          // Reset form and close main modal on success
          setFormData({
            topEstimatedCost: '',
            costBreakdown: [{ name: '', amount: '' }],
            message: ''
          });
          setIsOpen(false);
        },
        (errors) => {
          console.error('Proposal submission errors:', errors);
          
          // More specific error handling
          if (errors && typeof errors === 'object') {
            const errorMessage = errors.message || JSON.stringify(errors);
            alert(`Failed to submit proposal: ${errorMessage}`);
          } else {
            alert('Failed to submit proposal. Please check your authentication and try again.');
          }
        }
      );

    } catch (error) {
      console.error('Error submitting proposal:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        
        if (status === 403) {
          alert('Access denied. Please make sure you are logged in and authorized to submit proposals.');
        } else if (status === 401) {
          alert('Authentication required. Please log in and try again.');
        } else {
          alert(`Server error (${status}): ${message}`);
        }
      } else if (error.request) {
        // Network error
        alert('Network error. Please check your connection and try again.');
      } else {
        // Other error
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    // Reset form and submission state when closing
    setFormData({
      topEstimatedCost: '',
      costBreakdown: [{ name: '', amount: '' }],
      message: ''
    });
    setIsSubmitted(false);
  };

  const handleCloseSuccessToast = () => {
    setShowSuccessToast(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setIsSubmitted(false); // Reset submission state when modal is closed
  };

  return (
    <>
      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-white opacity-100 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Apply for This Job</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <p className="text-sm text-gray-600">
                  Please read requirements and breakdown so that we can negotiate cost on fair
                </p>
                
                {/* Budget Display */}
                {job?.budget != null ? (
                  <div className="w-full bg-blue-100 rounded-lg px-4 py-4 inline-block">
                    <span className="text-[#005790]">Customer Budget: </span>
                    <span className="font-bold text-[#005790]">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(job?.budget || 0)}
                    </span>
                  </div>
                ) : (
                  <div className="w-full bg-blue-100 rounded-lg px-4 py-4 inline-block">
                    <span className="text-[#005790]">Consultation Fee: </span>
                    <span className="font-bold text-[#005790]">₦18,000</span>
                  </div>
                )}

                {/* Debug Info - Remove in production */}
                {process.env.NODE_ENV === 'development' && job && (
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    Debug: Job ID = {job.id || job.jobId || 'MISSING'}
                  </div>
                )}

                {/* Top Estimated Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Top Estimated Cost *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="text"
                      placeholder="₦0,000"
                      value={formData.topEstimatedCost}
                      onChange={(e) => handleInputChange('topEstimatedCost', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={isSubmitting || isSubmitted}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message for customer *</label>
                  <textarea
                    placeholder="A short fair message into this brief on..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    disabled={isSubmitting || isSubmitted}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isSubmitted}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : isSubmitted ? 'Proposal Sent' : 'Apply for Job'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Toast */}
      <SuccessPopup
        message="Proposal submitted successfully!"
        isVisible={showSuccessToast}
        onClose={handleCloseSuccessToast}
      />

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </>
  );
}