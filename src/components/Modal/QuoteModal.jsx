import { useState } from 'react';
import { X, Plus, CheckCircle } from 'lucide-react';

// Success Toast Component
const SuccessPopup = ({ message, isVisible, onClose }) => {
  useState(() => {
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
            <p className="text-sm font-medium text-gray-900 font-inter">
              Success
            </p>
            <p className="text-sm text-gray-600 font-inter mt-1">
              {message}
            </p>
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

export default function QuoteModal({
  isOpen,
  setIsOpen,
  job,
  postProposal,
  navigate
}) {
  const [formData, setFormData] = useState({
    topEstimatedCost: '',
    costBreakdown: [{ name: '', amount: '' }],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCostBreakdownChange = (index, field, value) => {
    const newCostBreakdown = [...formData.costBreakdown];
    newCostBreakdown[index][field] = value;
    setFormData(prev => ({
      ...prev,
      costBreakdown: newCostBreakdown
    }));
  };

  const addCostItem = () => {
    setFormData(prev => ({
      ...prev,
      costBreakdown: [...prev.costBreakdown, { name: '', amount: '' }]
    }));
  };

  const removeCostItem = (index) => {
    if (formData.costBreakdown.length > 1) {
      const newCostBreakdown = formData.costBreakdown.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        costBreakdown: newCostBreakdown
      }));
    }
  };

  const validateForm = () => {
    if (!formData.topEstimatedCost.trim()) {
      alert('Please enter the top estimated cost');
      return false;
    }

    if (!formData.message.trim()) {
      alert('Please enter a message for the customer');
      return false;
    }

    // Validate cost breakdown items
    const validCostItems = formData.costBreakdown.filter(item => 
      item.name.trim() && item.amount.trim()
    );

    if (validCostItems.length === 0) {
      alert('Please add at least one cost breakdown item');
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
      const validCostBreakdown = formData.costBreakdown.filter(item => 
        item.name.trim() && item.amount.trim()
      );

      // Prepare the proposal data according to your API structure
      const proposalData = {
        jobId: job?.id,
        proposedPrice: formData.topEstimatedCost,
        // costBreakdown: validCostBreakdown,
        message: formData.message,
        // Add any other required fields based on your API
      };

      console.log('Submitting proposal:', proposalData);

      // Call the postProposal action
      await postProposal(proposalData, ()=>{}, (errors) => {
        console.error('Proposal submission errors:', errors);
        // Handle errors here
        alert('Failed to submit proposal. Please try again.');
      });

      // If successful, close modal and reset form
      setFormData({
        topEstimatedCost: '',
        costBreakdown: [{ name: '', amount: '' }],
        message: ''
      });
      
      setIsOpen(false);
      
      // Show success toast instead of alert
      setShowSuccessToast(true);

    } catch (error) {
      console.error('Error submitting proposal:', error);
      alert('Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    // Reset form when closing
    setFormData({
      topEstimatedCost: '',
      costBreakdown: [{ name: '', amount: '' }],
      message: ''
    });
  };

  const handleCloseSuccessToast = () => {
    setShowSuccessToast(false);
  };

  return (
    <>
      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-[rgba(44, 44, 44, 0.377)] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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

                {/* Top Estimated Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Estimated Cost *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                       ₦
                    </span>
                    <input
                      type="text"
                      placeholder="₦0,000"
                      value={formData.topEstimatedCost}
                      onChange={(e) => handleInputChange('topEstimatedCost', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Breakdown
                  </label>
                  <div className="space-y-3">
                    {formData.costBreakdown.map((item, index) => (
                      <div key={index} className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Item Name"
                          value={item.name}
                          onChange={(e) => handleCostBreakdownChange(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                          disabled={isSubmitting}
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                             ₦
                          </span>
                          <input
                            type="text"
                            placeholder="0,000"
                            value={item.amount}
                            onChange={(e) => handleCostBreakdownChange(index, 'amount', e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            disabled={isSubmitting}
                          />
                          {formData.costBreakdown.length > 1 && (
                            <button
                              onClick={() => removeCostItem(index)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                              disabled={isSubmitting}
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Item Button */}
                    <button
                      onClick={addCostItem}
                      className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-500 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message for customer *
                  </label>
                  <textarea
                    placeholder="A short fair message into this brief on..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Apply for Job'}
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
    </>
  );
}