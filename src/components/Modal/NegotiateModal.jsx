import { useState, useEffect, useContext } from 'react';
import { useProposal } from '../../contexts/ProposalContext';
import { X } from 'lucide-react';
import SuccessModal from './SuccessModal';

export default function NegotiationModal({
  isOpen,
  setIsOpen,
  closeModal,
  selectedProposal,
  negotiateProposal,
  proposals,
  negotiations = [], // Array of negotiations from API
  negotiateSuccess,
  negotiationsLoading = false, // Loading state for negotiations
  currentUserId, // Current user's ID to determine sender/receiver
  currentUserRole = 'User', // Current user's role (User/Artisan)
  errors
}) {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'typing', 'sent'
  const [negotiationData, setNegotiationData] = useState({
    message: '',
    proposedPrice: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalError, setModalError] = useState(false);

  // Get acceptNegotiation and rejectNegotiation from context
  const { acceptNegotiation, rejectNegotiation } = useProposal();

  // Reset form when modal opens/closes or proposal changes
  useEffect(() => {
    if (!isOpen) {
      setNegotiationData({ message: '', proposedPrice: '' });
      setCurrentView('list');
    }
  }, [isOpen, selectedProposal]);

  const handleInputChange = (field, value) => {
    setNegotiationData((prev) => ({
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
          setShowSuccessModal(true);
          setCurrentView('sent');
          setNegotiationData({ message: '', proposedPrice: '' });
        },
        () => {
          // Error callback
          setModalError(true);
          console.error('Failed to send negotiation:', errors);
        }
      );
    }
  };

  const handleAcceptLatestOffer = () => {
    const latestNegotiation = negotiations[0];
    if (!latestNegotiation || !acceptNegotiation) return;
    acceptNegotiation(
      latestNegotiation.id,
      () => {
        setShowSuccessModal(true);
        closeModal();
      },
      (error) => {
        setModalError(error || 'Failed to accept negotiation');
      }
    );
  };

  const handleRejectLatestOffer = () => {
    const latestNegotiation = negotiations[0];
    if (!latestNegotiation || !rejectNegotiation) return;
    rejectNegotiation(
      latestNegotiation.id,
      () => {
        setShowSuccessModal(true);
        closeModal();
      },
      (error) => {
        setModalError(error || 'Failed to reject negotiation');
      }
    );
  };
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
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
  const artisanName = selectedProposal?.artisan
    ? `${selectedProposal.artisan.firstName} ${selectedProposal.artisan.lastName}`
    : 'Artisan';

  console.log('NegotiationModal Debug:', {
    isOpen,
    selectedProposal,
    artisanName,
    negotiations,
    currentView,
    initialBudget
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden relative min-h-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        {modalError && (
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
                  <p>{errors}</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Initial Budget */}
              <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">₦{initialBudget.toLocaleString()}</div>
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
                      <div key={negotiation.id} className="bg-gray-100 rounded-2xl p-4">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          ₦{negotiation.proposedPrice?.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-700">{negotiation.message}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Action Buttons: Only show if the latest negotiation is from the other party */}
              {(() => {
                // If there are negotiations, check the latest sender
                const latest = sortedNegotiations[0];
                // If no negotiations, allow actions (first proposal)
                if (!latest) {
                  return (
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
                  );
                }
                // If the latest negotiation was sent by the current user (by id or role), hide actions
                if (
                  (latest.senderId && latest.senderId === currentUserId) ||
                  (latest.senderRole && latest.senderRole === currentUserRole)
                ) {
                  return (
                    <div className="text-center text-gray-500 text-sm mt-2">
                      Waiting for a response from the other party...
                    </div>
                  );
                }
                // Otherwise, show actions
                return (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAcceptLatestOffer}
                      className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-medium hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={handleRejectLatestOffer}
                      className="flex-1 bg-red-500 text-white py-3 px-4 rounded-full font-medium hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleRenegotiate}
                      className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-600 transition-colors"
                    >
                      Renegotiate
                    </button>
                  </div>
                );
              })()}
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
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Initial Budget */}
              <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">₦{initialBudget.toLocaleString()}</div>
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
                  <div key={negotiation.id} className="bg-gray-100 rounded-2xl p-4">
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
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Initial Budget */}
              <div className="bg-gray-100 rounded-2xl p-4 mb-4 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">₦{initialBudget.toLocaleString()}</div>
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
                  <div key={negotiation.id} className="bg-gray-100 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ₦{negotiation.proposedPrice?.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-700">{negotiation.message}</p>
                  </div>
                ))}

                {/* Latest sent negotiation */}
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ₦
                    {negotiationData.proposedPrice
                      ? parseFloat(negotiationData.proposedPrice.replace(/[^0-9]/g, '')).toLocaleString()
                      : '0'}
                  </div>
                  <p className="text-sm text-gray-700">{negotiationData.message || 'Your latest offer'}</p>
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
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          title="Negotiation Sent Successfully!"
          message="Your negotiation has been sent to the artisan. You'll receive a response shortly."
          primaryButtonText="Continue"
          onPrimaryButtonClick={handleCloseSuccessModal}
        />
      )}
    </div>
  );
}
