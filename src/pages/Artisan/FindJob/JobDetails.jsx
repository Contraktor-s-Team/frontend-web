import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Map, MessageSquareText, Phone } from 'lucide-react';
import Button from '../../../components/Button/Button';
import Avatar from '/img/avatar1.jpg';
import { useJobListings } from '../../../contexts/JobListingContext';
import { useProposal } from '../../../contexts/ProposalContext';
import { useUser } from '../../../contexts/UserContext';
import QuoteModal from '../../../components/Modal/QuoteModal';
import NegotiationModal from '../../../components/Modal/NegotiateModal';
import FallbackImage from '../../../components/FallbackImage';

const JobDetails = () => {
  console.log('🚀 JobDetails component is mounting/rendering');
  
  const { tab, jobId } = useParams();
  const navigate = useNavigate();
  
  console.log('🔍 JobDetails: tab from useParams:', tab, 'jobId:', jobId);
  const { fetchJobListingById, state: jobListingState } = useJobListings();
  const { fetchJobProposal, fetchNegotiation, submitProposal, state: proposalState } = useProposal();

  const loading = jobListingState.jobListingById.loading;
  const data = jobListingState.jobListingById.data;
  const error = jobListingState.jobListingById.error;
  const proposalData = proposalState.jobProposal?.data;
  const negotiations = proposalState.negotiate?.data;
  const negotiationsLoading = proposalState.negotiate?.loading;

  const [job, setJob] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isNegotiationModalOpen, setIsNegotiationModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [proposalNegotiations, setProposalNegotiations] = useState([]);

  // Get current user info
  const { state: userState } = useUser();
  const userData = userState.user;
  const currentUserId = userData?.data?.id;
  const currentUserRole = userData?.data?.role || 'User'; // Assuming role is available

  useEffect(() => {
    console.log('🔍 JobDetails: useParams jobId:', jobId);
    console.log('🔍 JobDetails: current tab:', tab);
    if (jobId) {
      console.log('🔍 JobDetails: Calling fetchJobListingById with ID:', jobId);
      fetchJobListingById(jobId);
      fetchJobProposal(jobId);
    }
  }, [jobId, tab, fetchJobListingById, fetchJobProposal]);

  useEffect(() => {
    if (data?.data) {
      setJob(data.data);
    }
  }, [data]);

  // Find the current user's proposal for this job when in proposal-sent tab
  useEffect(() => {
    if (tab === 'proposal-sent' && proposalData?.data && currentUserId) {
      // The proposalData.data should be an array of proposals for this job
      const proposals = Array.isArray(proposalData.data) ? proposalData.data : [proposalData.data];

      // Find the proposal that matches current user
      const userProposal = proposals.find((proposal) => proposal.senderId === currentUserId);

      if (userProposal) {
        setSelectedProposal(userProposal);
        // Fetch negotiations for this proposal
        fetchNegotiation(userProposal.id);
      }
    }
  }, [tab, proposalData, currentUserId, jobId, fetchNegotiation]);

  // Update negotiations when they are received
  useEffect(() => {
    if (negotiations?.data) {
      if (Array.isArray(negotiations.data)) {
        setProposalNegotiations(negotiations.data);
      } else {
        setProposalNegotiations([negotiations.data]);
      }
    }
  }, [negotiations]);

  const handleBack = () => {
    navigate(-1);
  };

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const openNegotiationModal = () => setIsNegotiationModalOpen(true);

  // Check if current user can accept negotiations
  const canAcceptNegotiation = () => {
    if (!selectedProposal || !currentUserId) return false;
    // User cannot accept if they are the sender (artisan) of the proposal
    return selectedProposal.senderId !== currentUserId;
  };

  // Check if there are ongoing negotiations
  const hasOngoingNegotiation = () => {
    return proposalNegotiations && proposalNegotiations.length > 0;
  };

  // Handle accept proposal/negotiation
  const handleAccept = () => {
    console.log('Accepting proposal/negotiation:', selectedProposal);
    // Implement accept logic here
    // You would typically call an API to accept the proposal
  };

  // Handle reject proposal/negotiation
  const handleReject = () => {
    console.log('Rejecting proposal/negotiation:', selectedProposal);
    // Implement reject logic here
    // You would typically call an API to reject the proposal
  };

  // Handle negotiation submission
  const handleNegotiateProposal = (proposalId, negotiationData, successCallback, errorCallback) => {
    console.log('Sending negotiation for proposal:', proposalId, negotiationData);
    // Implement negotiation logic here
    // This should call your negotiation API
    // For now, we'll simulate success
    setTimeout(() => {
      if (successCallback) successCallback();
      // Refresh negotiations after successful submission
      fetchNegotiation(proposalId);
    }, 1000);
  };

  if (loading) {
    return <div className="p-6">Loading job details...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <Button variant="destructive-sec" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
          Back to {tab}
        </Button>
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-medium mb-2">Unable to load job details</h3>
          <p className="text-sm">{typeof error === 'string' ? error : 'An error occurred while loading job details'}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <Button variant="destructive-sec" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
          Back to {tab}
        </Button>
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">Job not found</div>
      </div>
    );
  }

  // Render action buttons based on tab and conditions
  const renderActionButtons = () => {
    if (tab === 'requests') {
      return (
        <div className="flex items-center gap-5">
          <Button variant="secondary" onClick={openQuoteModal} className="px-4 py-3.75">
            Send Proposal
          </Button>
          <Button variant="destructive-sec" className="px-4 py-3.75">
            Report Issue
          </Button>
        </div>
      );
    }

    if (tab === 'proposal-sent') {
      // Check if current user is the sender of the proposal
      const isCurrentUserSender = selectedProposal?.senderId === currentUserId;

      if (isCurrentUserSender) {
        // User is the artisan who sent the proposal - they can only view status, no actions
        let statusText = "Proposal Sent";
        let statusClass = "bg-blue-100 text-blue-700";
        
        if (hasOngoingNegotiation()) {
          const latestNegotiation = proposalNegotiations[0];
          if (latestNegotiation?.status === 'accepted') {
            statusText = "Proposal Accepted";
            statusClass = "bg-green-100 text-green-700";
          } else if (latestNegotiation?.status === 'rejected') {
            statusText = "Proposal Rejected";
            statusClass = "bg-red-100 text-red-700";
          } else {
            statusText = "Awaiting Response";
            statusClass = "bg-yellow-100 text-yellow-700";
          }
        }
        
        return (
          <div className="flex items-center gap-5">
            <div className={`px-4 py-3 rounded-lg text-sm font-medium ${statusClass}`}>
              {statusText}
            </div>
            <Button variant="grey-sec" className="px-4 py-3.75">
              Report Issue
            </Button>
          </div>
        );
      } else {
        // User is not the sender (they can accept/reject)
        if (hasOngoingNegotiation()) {
          return (
            <div className="flex items-center gap-5">
              <button
                onClick={handleAccept}
                className="py-4 px-3.75 bg-success-norm-1 text-white text-sm font-medium rounded-full hover:bg-success-norm-2"
              >
                Accept Offer
              </button>
              <Button variant="secondary" onClick={openNegotiationModal} className="px-4 py-3.75">
                Renegotiate
              </Button>
              <Button variant="grey-sec" className="px-4 py-3.75">
                Report Issue
              </Button>
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-5">
              <button
                onClick={handleAccept}
                className="py-4 px-3.75 bg-success-norm-1 text-white text-sm font-medium rounded-full hover:bg-success-norm-2"
              >
                Accept Job
              </button>
              <Button variant="destructive-sec" onClick={handleReject} className="px-4 py-3.75">
                Reject Job
              </Button>
              <Button variant="grey-sec" className="px-4 py-3.75">
                Report Issue
              </Button>
            </div>
          );
        }
      }
    }

    return null;
  };

  return (
    <div className="font-inter font-medium">
      {/* Breadcrumb */}
      <div className="">
        <p className="capitalize font-medium text-sm text-pri-norm-1">
          <Link to="/artisan/find-jobs">Find Jobs</Link> / <Link to={`/artisan/jobs/${tab}`}>{tab}</Link> /{' '}
          <span className="text-black">Job Details</span>
        </p>
      </div>

      {/* Title and Action Buttons */}
      <div className="flex items-center justify-between my-6.25">
        <h3 className="font-manrope text-2xl font-semibold">Job Details</h3>
        {renderActionButtons()}
      </div>

      {/* Negotiation Status Section (only show in requests tab) */}
      {tab === 'requests' && selectedProposal && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-lg mb-4">Proposal Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Original Proposal</p>
              <p className="text-xl font-bold">₦{selectedProposal?.proposedPrice?.toLocaleString() || '0'}</p>
            </div>
            {hasOngoingNegotiation() && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Latest Offer</p>
                  <p className="text-xl font-bold text-blue-600">
                    ₦{proposalNegotiations[0]?.proposedPrice?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Negotiations</p>
                  <p className="text-lg font-medium">
                    {proposalNegotiations.length} round{proposalNegotiations.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </>
            )}
          </div>
          {hasOngoingNegotiation() && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Latest Message:</p>
              <p className="text-gray-800">{proposalNegotiations[0]?.message || 'No message available'}</p>
              <p className="text-xs text-gray-500 mt-2">
                Sent {proposalNegotiations[0]?.sentAt ? new Date(proposalNegotiations[0].sentAt).toLocaleString() : 'Unknown date'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-5.5">
        {/* Job Summary */}
        <div className="bg-white w-full max-w-[584px] rounded-xl p-7">
          <h3 className="font-manrope text-xl font-semibold">Job Summary</h3>
          <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

          <div className="space-y-6.5">
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Job Title:</span>
              <span className="text-black">{job?.title || 'Untitled Job'}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Category:</span>
              <span className="text-black">{job?.subcategoryName || 'Category not available'}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Budget:</span>
              <span className="text-black">₦{job?.budget ? job.budget.toLocaleString() : 'Not specified'}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Date & Time:</span>
              <span className="text-black">
                {job?.postedAt
                  ? new Date(job.postedAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })
                  : 'N/A'}
              </span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Job Location:</span>
              <span className="text-black">
                {job?.customer?.location || job?.location || 'Location not specified'}
              </span>
            </p>
            <Button
              variant="secondary"
              rightIcon={<Map size={20} />}
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job?.customer?.location || job?.location || '')}`,
                  '_blank'
                )
              }
              className="py-4.5 px-5.25"
              disabled={!job?.customer?.location && !job?.location}
            >
              View Location on Map
            </Button>
          </div>

          <div className="mt-10.25 space-y-10.5">
            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Job Description</p>
              <p className="font-medium">{job?.description || 'No description available'}</p>
            </div>
            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Attached Photos</p>
              <div className="flex flex-wrap gap-2">
                {job?.imageUrls && job?.imageUrls.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job?.imageUrls?.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`photo-${index}`}
                        className="w-36 h-26 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No photos attached</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-xl p-7 h-fit w-full max-w-[482px]">
          <div className="flex items-center justify-between">
            <h3 className="font-manrope text-xl font-semibold">Customer Details</h3>
            <div className="flex items-center gap-4 text-pri-norm-1">
              <MessageSquareText size={24} />
              <Phone size={24} />
            </div>
          </div>
          <div className="h-0.25 bg-neu-light-3 my-5.5"></div>
          <div className="space-y-6.5">
            {job?.customer || job?.userFullName ? (
              <>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span>Name:</span>
                  <div className="flex items-center gap-2.5">
                    <FallbackImage src={job?.customer?.avatar} alt="customer" className="w-10 h-10 rounded-full" />
                    <div className="">{job?.customer?.name || job?.userFullName || 'Customer information unavailable'}</div>
                  </div>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span>Phone Number:</span>
                  <span className="text-black">{job?.customer?.phone || 'Not available'}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span>Email:</span>
                  <span className="text-black">{job?.customer?.email || 'Not available'}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span>Location:</span>
                  <span className="text-black">{job?.customer?.location || job?.location || 'Location not specified'}</span>
                </p>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Customer details will be available after applying to this job</p>
                <p className="text-sm mt-2">Customer ID: {job?.userId || 'Not available'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Modal for listings tab */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        setIsOpen={setIsQuoteModalOpen}
        closeModal={() => setIsQuoteModalOpen(false)}
        job={job}
        postProposal={submitProposal}
      />

      {/* Negotiation Modal for requests tab */}
      {tab === 'requests' && selectedProposal && (
        <NegotiationModal
          isOpen={isNegotiationModalOpen}
          setIsOpen={setIsNegotiationModalOpen}
          closeModal={() => setIsNegotiationModalOpen(false)}
          selectedProposal={selectedProposal}
          negotiateProposal={handleNegotiateProposal}
          proposals={proposalData || []}
          negotiations={proposalNegotiations}
          negotiationsLoading={negotiationsLoading}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
};

export default JobDetails;
