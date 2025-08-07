import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NegotiationModal({ 
  isOpen, 
  setIsOpen, 
  closeModal, 
  selectedProposal, 
  negotiateProposal,
  proposals,
  negotiations = [], // Array of negotiations from API
  negotiationsLoading = false, // Loading state for negotiations
  currentUserId, // Current user's ID to determine sender/receiver
  currentUserRole = "User" // Current user's role (User/Artisan)
}) {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'typing', 'sent'
  const [negotiationData, setNegotiationData] = useState({
    message: '',
    proposedPrice: ''
  });

  // Reset form when modal opens/closes or proposal changes
  useEffect(() => {
    if (!isOpen) {
      setNegotiationData({ message: '', proposedPrice: '' });
      setCurrentView('list');
    }
  }, [isOpen, selectedProposal]);

  const handleInputChange = (field, value) => {
    setNegotiationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendNegotiation = () => {
    if (!selectedProposal?.id) {
      console.error('No proposal selected');
      return;
    }

    // Get the latest negotiation to determine parent ID
    const latestNegotiation = negotiations[0]; // Assuming sorted by most recent
    const parentNegotiationId = latestNegotiation?.id || null;

    // Format the data according to the API structure
    const negotiationPayload = {
      proposalId: selectedProposal.id,
      parentNegotiationId: parentNegotiationId,
      message: negotiationData.message.trim(),
      proposedPrice: parseFloat(negotiationData.proposedPrice.replace(/[^0-9.]/g, '')),
      sentAt: new Date().toISOString()
    };

    console.log('Sending negotiation:', negotiationPayload);
    
    // Call the negotiate function from props
    if (negotiateProposal) {
      negotiateProposal(
        selectedProposal.id, 
        negotiationPayload,
        () => {
          // Success callback - move to sent view
          setCurrentView('sent');
          setNegotiationData({ message: '', proposedPrice: '' });
        },
        (error) => {
          // Error callback
          console.error('Failed to send negotiation:', error);
        }
      );
    }
  };

  const handleAcceptLatestOffer = () => {
    const latestNegotiation = negotiations[0];
    if (!latestNegotiation) return;

    console.log('Accepting offer:', latestNegotiation);
    closeModal();
  };

  const handleRenegotiate = () => {
    setCurrentView('typing');
  };

  // Check if current user is the sender of a message
  const isCurrentUserSender = (negotiation) => {
    return negotiation.senderId === currentUserId;
  };

  // Get all negotiations sorted by date (most recent first)
  const sortedNegotiations = [...negotiations].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

  // Get initial budget (original proposal price)
  const initialBudget = selectedProposal?.proposedPrice || 0;

  // Get artisan name
  const artisanName = selectedProposal?.artisan ? 
    `${selectedProposal.artisan.firstName} ${selectedProposal.artisan.lastName}` : 
    'Artisan';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        
        {/* List View - Shows negotiation history */}
        {currentView === 'list' && (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Negotiate Price</h2>
                <p className="text-sm text-gray-500">
                  Negotiate price with <span className="text-gray-900 font-medium">{artisanName}</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Initial Budget */}
              <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ₦{initialBudget.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Your initial Budget</p>
              </div>

              {/* Negotiations List */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {negotiationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600 text-sm">Loading negotiations...</span>
                  </div>
                ) : (
                  <>
                    {/* Original Proposal - Always show first */}
                    <div className="bg-blue-100 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        ₦{selectedProposal?.proposedPrice?.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-700">{selectedProposal?.message}</p>
                    </div>

                    {/* All negotiations in chronological order */}
                    {sortedNegotiations.map((negotiation, index) => (
                      <div
                        key={negotiation.id}
                        className="bg-gray-100 rounded-2xl p-4"
                      >
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          ₦{negotiation.proposedPrice?.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-700">{negotiation.message}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAcceptLatestOffer}
                  className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-medium hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={handleRenegotiate}
                  className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-600 transition-colors"
                >
                  Renegotiate
                </button>
              </div>
            </div>
          </>
        )}

        {/* Typing View - Form to send new negotiation */}
        {currentView === 'typing' && (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Negotiate Price</h2>
                <p className="text-sm text-gray-500">
                  Negotiate price with <span className="text-gray-900 font-medium">{artisanName}</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Initial Budget */}
              <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ₦{initialBudget.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Your initial Budget</p>
              </div>

              {/* Latest offer and previous negotiations */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {/* Original Proposal - Always show first */}
                <div className="bg-blue-100 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ₦{selectedProposal?.proposedPrice?.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-700">{selectedProposal?.message}</p>
                </div>

                {/* All negotiations in chronological order */}
                {sortedNegotiations.map((negotiation, index) => (
                  <div
                    key={negotiation.id}
                    className="bg-gray-100 rounded-2xl p-4"
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ₦{negotiation.proposedPrice?.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-700">{negotiation.message}</p>
                  </div>
                ))}
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                {/* Price Input */}
                <input
                  type="text"
                  placeholder="Type new price..."
                  value={negotiationData.proposedPrice}
                  onChange={(e) => {
                    // Format the input as user types
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    handleInputChange('proposedPrice', formatted);
                  }}
                  className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />

                {/* Message Input */}
                <textarea
                  placeholder="Enter short message"
                  value={negotiationData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={3}
                  className="w-full p-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 resize-none"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendNegotiation}
                disabled={!negotiationData.message.trim() || !negotiationData.proposedPrice.trim()}
                className="w-full bg-blue-500 text-white py-3 rounded-full font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </>
        )}

        {/* Sent View - Shows the negotiation was sent */}
        {currentView === 'sent' && (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Negotiate Price</h2>
                <p className="text-sm text-gray-500">
                  Negotiate price with <span className="text-gray-900 font-medium">{artisanName}</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Initial Budget */}
              <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ₦{initialBudget.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Your initial Budget</p>
              </div>

              {/* Previous negotiations and sent negotiation */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {/* Original Proposal - Always show first */}
                <div className="bg-blue-100 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ₦{selectedProposal?.proposedPrice?.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-700">{selectedProposal?.message}</p>
                </div>

                {/* Previous negotiations */}
                {sortedNegotiations.map((negotiation, index) => (
                  <div
                    key={negotiation.id}
                    className="bg-gray-100 rounded-2xl p-4"
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ₦{negotiation.proposedPrice?.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-700">{negotiation.message}</p>
                  </div>
                ))}

                {/* Latest sent negotiation */}
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ₦{negotiationData.proposedPrice ? parseFloat(negotiationData.proposedPrice.replace(/[^0-9]/g, '')).toLocaleString() : '0'}
                  </div>
                  <p className="text-sm text-gray-700">
                    {negotiationData.message || 'Your latest offer'}
                  </p>
                </div>
              </div>

              {/* Status message */}
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">
                  Your negotiation has been sent to {artisanName}. You'll be notified when they respond.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}