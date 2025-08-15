import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Map, MessageSquareText, Phone } from 'lucide-react';
import Button from '../../../components/Button/Button';
import Avatar from '/img/avatar1.jpg';
import { useJobListings } from '../../../contexts/JobListingContext';
import { useProposal } from '../../../contexts/ProposalContext';
import { useUser } from '../../../contexts/UserContext';
import ProposalModal from '../../../components/Modal/ProposalModal';
import NegotiationModal from '../../../components/Modal/NegotiateModal';
import FallbackImage from '../../../components/FallbackImage';

const ArtisanJobDetails = () => {
  console.log('🚀 JobDetails component is mounting/rendering');

  const [isOpen, setIsOpen] = useState(false);

  const { tab, jobId } = useParams();

  const location = useLocation();

  const proposalId = location.state.proposalId;

  console.log('Job Id:', jobId);
  console.log('proposal Id', proposalId);

  const navigate = useNavigate();

  console.log('🔍 JobDetails: tab from useParams:', tab, 'jobId:', jobId);
  const { fetchJobListingById, state: jobListingState } = useJobListings();
  const { fetchJobProposal, fetchNegotiation, postProposal, state: proposalState } = useProposal();

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

  // Ref to prevent duplicate API calls
  const fetchedJobId = useRef(null);
  const fetchedProposalJobId = useRef(null);
  const fetchedNegotiationId = useRef(null);

  // Get current user info
  const { state: userState } = useUser();
  const userData = userState.user;
  const currentUserId = userData?.data?.data.id;
  const currentUserRole = userData?.data?.data.role; // Assuming role is available

  console.log(userData.data.data);
  console.log(currentUserId);
  console.log(currentUserRole);

  useEffect(() => {
    console.log('🔍 JobDetails: useParams jobId:', jobId);
    console.log('🔍 JobDetails: current tab:', tab);

    // Prevent duplicate calls for the same job
    if (jobId && fetchJobListingById && fetchedJobId.current !== jobId) {
      console.log('🔍 JobDetails: Calling fetchJobListingById with ID:', jobId);
      fetchedJobId.current = jobId;
      fetchJobListingById(jobId);
    }

    // Fetch proposals only if different job or not fetched yet
    if (jobId && fetchJobProposal && fetchedProposalJobId.current !== jobId) {
      fetchedProposalJobId.current = jobId;
      fetchJobProposal(jobId);
    }
  }, [jobId]); // Only depend on jobId

  useEffect(() => {
    console.log('🔍 JobDetails: data received:', data);

    // Fix: Check if data exists and has the correct structure
    if (data) {
      // If data has isSuccess and data properties, use data.data
      if (data.isSuccess && data.data) {
        console.log('🔍 JobDetails: Setting job from data.data:', data.data);
        setJob(data.data);
      }
      // If data is the job object itself, use it directly
      else if (data.id) {
        console.log('🔍 JobDetails: Setting job from data directly:', data);
        setJob(data);
      }
      // If data has a data property but no isSuccess, try data.data
      else if (data.data && data.data.id) {
        console.log('🔍 JobDetails: Setting job from data.data (fallback):', data.data);
        setJob(data.data);
      }
    }
  }, [data]);

  // Find the current user's proposal for this job when in proposal-sent tab
  useEffect(() => {
    // Fetch negotiations when page loads for proposal-sent tab
    if (tab === 'proposal-sent' && proposalId && fetchNegotiation) {
      console.log('🔄 Fetching negotiations for proposal:', proposalId);
      fetchNegotiation(proposalId);

      // If we have proposal data, set the selected proposal
      if (proposalData?.data) {
        const proposals = Array.isArray(proposalData.data) ? proposalData.data : [proposalData.data];
        const userProposal = proposals.find((proposal) => proposal.senderId === currentUserId);
        if (userProposal) {
          setSelectedProposal(userProposal);
        }
      }
    }
  }, [tab, proposalId, fetchNegotiation, proposalData?.data, currentUserId]);

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

  // Check if current user can take actions on negotiations
  const canTakeNegotiationActions = () => {
    if (!selectedProposal || !currentUserId || !proposalNegotiations || proposalNegotiations.length === 0) {
      return false;
    }

    // Get the most recent negotiation
    const latestNegotiation = proposalNegotiations[0];

    // User cannot take actions if they are the sender of the latest negotiation
    return latestNegotiation.senderId !== currentUserId;
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

  // Check if current user can take actions on negotiations
  // const canTakeNegotiationActions = () => {
  //   if (!selectedProposal || !currentUserId || !proposalNegotiations || proposalNegotiations.length === 0) {
  //     return false;
  //   }
  //   // Get the most recent negotiation
  //   const latestNegotiation = proposalNegotiations[0];
  //   // User cannot take actions if they are the sender of the latest negotiation
  //   return latestNegotiation.senderId !== currentUserId;
  // };

  // Handle negotiation submission
  const handleNegotiateProposal = (proposalId, negotiationData, successCallback, errorCallback) => {
    // Check if user can take actions before allowing negotiation
    if (!canTakeNegotiationActions()) {
      errorCallback?.("You cannot negotiate at this time. Wait for the other party's response.");
      return;
    }

    console.log('Sending negotiation for proposal:', proposalId, negotiationData);
    // Implement negotiation logic here
    // This should call your negotiation API

    // For now, we'll simulate success
    setTimeout(() => {
      successCallback?.();
    }, 1000);
  };

  if (loading) {
    return <div className="p-6">Loading job details...</div>;
  }

  if (error && Object.keys(error).length > 0) {
    return (
      <div className="p-6">
        <Button variant="destructive-sec" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
          Back to {tab}
        </Button>
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-medium mb-2">Unable to load job details</h3>
          <p className="text-sm">{typeof error === 'string' ? error : 'An error occurred while loading job details'}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-red-600">Debug Info</summary>
            <pre className="text-xs mt-1 bg-red-100 p-2 rounded overflow-auto">
              {JSON.stringify({ data, error, loading }, null, 2)}
            </pre>
          </details>
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
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          <h3 className="font-medium mb-2">Job not found</h3>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-red-600">Debug Info</summary>
            <pre className="text-xs mt-1 bg-red-100 p-2 rounded overflow-auto">
              Data received: {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
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
      const canTakeActions = canTakeNegotiationActions();
      return (
        <div className="flex items-center gap-4">
          {/* View/Send Negotiations Button */}
          <Button
            variant="secondary"
            onClick={openNegotiationModal}
            className="px-4 py-3.75"
            disabled={hasOngoingNegotiation() && !canTakeActions}
          >
            {hasOngoingNegotiation()
              ? `View Negotiations (${proposalNegotiations.length})${!canTakeActions ? ' - Waiting for Response' : ''}`
              : 'Start Negotiation'}
          </Button>

          {/* Status Indicator */}
          <div
            className={`px-4 py-2 rounded-lg ${
              hasOngoingNegotiation() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {hasOngoingNegotiation()
              ? canTakeActions
                ? 'Your Turn to Respond'
                : 'Waiting for Response'
              : 'Proposal Sent'}
          </div>
        </div>
      );
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
                Sent{' '}
                {proposalNegotiations[0]?.sentAt
                  ? new Date(proposalNegotiations[0].sentAt).toLocaleString()
                  : 'Unknown date'}
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
              <span className="text-black">{job?.customer?.location || job?.location || 'Location not specified'}</span>
            </p>
            <Button
              variant="secondary"
              rightIcon={<Map size={20} />}
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    job?.customer?.location || job?.location || ''
                  )}`,
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
                    <div className="">
                      {job?.customer?.name || job?.userFullName || 'Customer information unavailable'}
                    </div>
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
                  <span className="text-black">
                    {job?.customer?.location || job?.location || 'Location not specified'}
                  </span>
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
      <ProposalModal
        isOpen={isQuoteModalOpen}
        setIsOpen={setIsQuoteModalOpen}
        closeModal={() => setIsQuoteModalOpen(false)}
        job={job}
        postProposal={postProposal}
      />

      {/* Negotiation Modal for proposal-sent tab */}
      {tab === 'proposal-sent' && selectedProposal && (
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

export default ArtisanJobDetails;
