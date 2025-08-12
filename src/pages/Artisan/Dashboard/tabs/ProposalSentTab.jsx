import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';
import { useNavigate } from 'react-router-dom';
import { useProposal } from '../../../../contexts/ProposalContext';
import { useUser } from '../../../../contexts/UserContext';
import { getAuthToken } from '../../../../utils/authUtils';

const ProposalSentTab = () => {
  const navigate = useNavigate();
  const [proposalNegotiations, setProposalNegotiations] = useState({});
  const dataProcessingRef = useRef({
    isProcessingProposals: false,
    lastProposalDataHash: null
  });

  // Context hooks
  const { state: userState } = useUser();
  const { state: proposalState, fetchArtisanProposal, fetchNegotiation } = useProposal();

  // Derived state
  const userData = userState.user.data;
  const user = userData?.data || userData;
  const currentUserId = userData?.data?.id || user?.id;

  const proposals = proposalState.artisanProposal.data?.data || [];
  const proposalLoading = proposalState.artisanProposal.loading;
  const proposalError = proposalState.artisanProposal.error;
  const negotiations = proposalState.negotiate.data;

  // Debug logging (remove this in production)
  console.log('ProposalSentTab Debug:', {
    hasUser: !!user,
    hasAuthToken: !!getAuthToken(),
    hasData: !!proposalState.artisanProposal.data,
    dataStructure: proposalState.artisanProposal.data,
    proposalsCount: proposals.length,
    loading: proposalLoading,
    error: proposalError,
    hasError: proposalError && Object.keys(proposalError).length > 0
  });

  // Load proposals when component mounts
  useEffect(() => {
    // Only fetch if we have a user, the function exists, no proposals data exists, and not currently loading
    const hasProposalData =
      proposalState.artisanProposal.data &&
      (Array.isArray(proposalState.artisanProposal.data.data) || proposalState.artisanProposal.data.data === null);

    if (user && fetchArtisanProposal && !hasProposalData && !proposalLoading && !proposalError) {
      console.log('ProposalSentTab: Loading proposals...');
      fetchArtisanProposal();
    }
  }, [user, fetchArtisanProposal, proposalState.artisanProposal.data, proposalLoading, proposalError]);

  // Handle proposal data processing and negotiations
  useEffect(() => {
    if (!proposals.length) return;

    // Create hash to detect data changes
    const proposalDataHash = JSON.stringify(proposals.map((p) => ({ id: p.id })));

    // Skip if already processing or data hasn't changed
    if (
      dataProcessingRef.current.isProcessingProposals ||
      dataProcessingRef.current.lastProposalDataHash === proposalDataHash
    ) {
      return;
    }

    dataProcessingRef.current.isProcessingProposals = true;
    dataProcessingRef.current.lastProposalDataHash = proposalDataHash;

    // Batch fetch negotiations
    const proposalsNeedingNegotiation = proposals.filter(
      (proposal) => proposal.id && !proposalNegotiations[proposal.id]
    );

    if (proposalsNeedingNegotiation.length && fetchNegotiation) {
      console.log(`ProposalSentTab: Loading negotiations for ${proposalsNeedingNegotiation.length} proposals`);
      proposalsNeedingNegotiation.forEach((proposal, index) => {
        setTimeout(() => {
          if (!proposalNegotiations[proposal.id]) {
            fetchNegotiation(proposal.id);
          }
        }, index * 200);
      });
    }

    // Reset processing flag after a delay
    setTimeout(() => {
      dataProcessingRef.current.isProcessingProposals = false;
    }, 1000);
  }, [proposals, fetchNegotiation, proposalNegotiations]);

  // Store negotiations data when received
  useEffect(() => {
    if (negotiations?.data) {
      const proposalId = negotiations.proposalId || negotiations.data.proposalId;
      if (proposalId) {
        setProposalNegotiations((prev) => ({
          ...prev,
          [proposalId]: negotiations.data
        }));
      }
    }
  }, [negotiations]);

  // Process proposals for display
  const processedProposals = React.useMemo(() => {
    if (proposals.length > 0) {
      return proposals
        .map((proposal) => {
          const proposalNegotiationsData = proposalNegotiations[proposal.id] || [];

          return {
            ...proposal,
            negotiations: proposalNegotiationsData,
            id: proposal.id,
            jobListingId: proposal.jobListingId, // Ensure job listing ID is available for navigation
            title: `Proposal #${proposal.id?.slice(0, 8) || 'Unknown'}`,
            description: 'Proposal submitted - details available in negotiations',
            subcategoryName: 'Proposal',
            customer: 'Customer information in proposal',
            customerDetails: {
              name: 'Customer information in proposal',
              location: 'Location in proposal details'
            },
            location: 'Location in proposal details',
            postedAt: proposal.submittedAt || new Date().toISOString(),
            proposalStatus: proposal.status,
            proposedPrice: proposal.proposedPrice,
            proposalMessage: proposal.message,
            imageUrls: [],
            category: 'proposals'
          };
        })
        .slice(0, 5); // Limit to 5 items
    }
    return [];
  }, [proposals, proposalNegotiations]);

  const handleViewAll = () => {
    navigate('/artisan/find-jobs/proposal-sent');
  };

  const handleBrowseJobs = () => {
    navigate('/artisan/find-jobs');
  };

  // Handle clicking on a proposal item to view details
  const handleProposalClick = (proposal) => {
    // Extract clean job listing ID (remove any composite ID suffix)
    const extractCleanJobId = (id) => {
      if (!id) return null;
      // If ID contains a dash followed by a number at the end, remove it
      const match = id.match(/^(.+)-\d+$/);
      return match ? match[1] : id;
    };

    const jobId = extractCleanJobId(proposal.jobListingId) || extractCleanJobId(proposal.id);

    if (jobId) {
      console.log('Navigating to job details for Proposal ID:', proposal.id);
      console.log('Using Job Listing ID:', jobId);
      // Navigate to job details using the proposal-sent tab
      navigate(`/artisan/find-jobs/proposal-sent/${jobId}`);
    } else {
      console.warn('Job listing ID not found for navigation:', proposal);
    }
  };

  // Helper functions
  const canAcceptNegotiation = useCallback(
    (proposal) => {
      return proposal.senderId !== currentUserId;
    },
    [currentUserId]
  );

  const hasOngoingNegotiation = useCallback(
    (proposalId) => {
      const negotiationData = proposalNegotiations[proposalId];
      return negotiationData && negotiationData.length > 0;
    },
    [proposalNegotiations]
  );

  const renderContent = () => {
    // Show loading state
    if (proposalLoading) {
      return (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading proposals...</p>
        </div>
      );
    }

    // Show error state - only if there's actually an error AND no data was successfully loaded
    if (proposalError && Object.keys(proposalError).length > 0 && !proposalState.artisanProposal.data) {
      const error = proposalError;
      let errorMessage = 'An error occurred while loading proposals';

      // Extract more specific error information
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to view proposals.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Proposals endpoint not found. Please contact support.';
      } else if (error?.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error loading proposals: {errorMessage}</p>
          <button
            onClick={() => {
              console.log('🔄 Retrying proposal fetch...');
              fetchArtisanProposal(true);
            }}
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }

    // Show data in table format
    if (processedProposals.length > 0) {
      return (
        <ServiceTable
          items={processedProposals}
          activeTab="proposals"
          isProposalsTab={true}
          canAcceptNegotiation={canAcceptNegotiation}
          hasOngoingNegotiation={hasOngoingNegotiation}
          onRowClick={handleProposalClick}
        />
      );
    }

    // Empty state
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No proposals sent yet</h3>
        <p className="text-gray-500">You haven't sent any proposals yet. Browse available jobs to get started.</p>
        <div className="flex justify-center mt-4">
          <Button variant="primary" onClick={handleBrowseJobs}>
            Browse Jobs
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Proposal Sent</h2>
        <Button variant="secondary" onClick={handleViewAll} rightIcon={<ChevronRight size={20} />} className="">
          View All
        </Button>
      </div>

      {renderContent()}
    </div>
  );
};

export default ProposalSentTab;
