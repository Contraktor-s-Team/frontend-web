import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/NewJobRequests';
import { useLocation, useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';
import { useUser } from '../../../contexts/UserContext';
import { useArtisan } from '../../../contexts/ArtisanContext';
import { useProposal } from '../../../contexts/ProposalContext';
import { useJobListings } from '../../../contexts/JobListingContext';

const Dashboard = () => {
  const location = useLocation();
  const { tab: activeTab = 'new' } = useParams();
  const [proposalNegotiations, setProposalNegotiations] = useState({});

  // Refs for managing async operations
  const timeoutsRef = useRef(new Map());
  const loadingStateRef = useRef({
    userLoaded: false,
    artisanLoaded: false,
    jobListingsLoaded: false,
    proposalsLoaded: false,
    currentTab: null
  });
  const dataProcessingRef = useRef({
    isProcessingProposals: false,
    isProcessingJobs: false,
    lastProposalDataHash: null,
    lastJobDataHash: null
  });

  // Context hooks
  const { state: userState, fetchCurrentUser } = useUser();
  const { state: artisanState, fetchArtisanById } = useArtisan();
  const { state: proposalState, fetchArtisanProposal, fetchNegotiation } = useProposal();
  const { fetchArtisanJobListings, state: jobListingState } = useJobListings();

  // Derived state
  const userData = userState.user.data;
  const user = userData?.data || userData;
  const userLoading = userState.user.loading;
  const artisan = artisanState.artisan.data;
  const userId = userData?.data?.id || user?.id;
  const currentUserId = userId;

  const proposals = proposalState.artisanProposal.data?.data || [];
  const proposalLoading = proposalState.artisanProposal.loading;
  const proposalError = proposalState.artisanProposal.error;
  const negotiations = proposalState.negotiate.data;

  // 1. MAIN DATA LOADING EFFECT - Handles sequential user -> artisan -> job listings
  useEffect(() => {
    // Reset loading state if tab changed
    if (loadingStateRef.current.currentTab !== activeTab) {
      loadingStateRef.current.currentTab = activeTab;
      loadingStateRef.current.jobListingsLoaded = false;
      loadingStateRef.current.proposalsLoaded = false;
    }

    // Step 1: Load user data if needed
    if (!user && !userLoading && fetchCurrentUser && !loadingStateRef.current.userLoaded) {
      console.log('Dashboard: Fetching user data...');
      loadingStateRef.current.userLoaded = true;
      fetchCurrentUser();
      return;
    }

    // Step 2: Load artisan data if user is available
    const isArtisanEmpty = !artisan || Object.keys(artisan).length === 0;
    if (
      user &&
      userId &&
      isArtisanEmpty &&
      !artisanState.artisan.loading &&
      fetchArtisanById &&
      !loadingStateRef.current.artisanLoaded
    ) {
      console.log('Dashboard: Fetching artisan profile...');
      loadingStateRef.current.artisanLoaded = true;
      fetchArtisanById(userId);
      return;
    }

    // Step 3: Load job listings for 'new' tab when both user and artisan are ready
    if (
      activeTab === 'new' &&
      user &&
      artisan &&
      !artisanState.artisan.loading &&
      fetchArtisanJobListings &&
      !loadingStateRef.current.jobListingsLoaded
    ) {
      const subcategoryId = artisan?.subcategories?.result?.[0]?.subcategory?.id;
      const hasJobListings = jobListingState.artisanJobListings.data?.data?.items?.length > 0;

      if (subcategoryId && !hasJobListings && !jobListingState.artisanJobListings.loading) {
        console.log('Dashboard: Loading job listings...');
        loadingStateRef.current.jobListingsLoaded = true;
        fetchArtisanJobListings([subcategoryId]);
      }
    }

    // Step 4: Load proposals for 'proposals' tab
    if (activeTab === 'proposals' && user && fetchArtisanProposal && !loadingStateRef.current.proposalsLoaded) {
      const hasProposals = proposals.length > 0;

      if (!hasProposals && !proposalLoading) {
        console.log('Dashboard: Loading proposals...');
        loadingStateRef.current.proposalsLoaded = true;
        fetchArtisanProposal();
      }
    }
  }, [
    user,
    userLoading,
    userId,
    artisan,
    artisanState.artisan.loading,
    activeTab,
    fetchCurrentUser,
    fetchArtisanById,
    fetchArtisanJobListings,
    fetchArtisanProposal,
    jobListingState.artisanJobListings.loading,
    proposalLoading,
    proposals.length,
    jobListingState.artisanJobListings.data?.data?.items?.length
  ]);

  // Reset loading flags when data is successfully loaded
  useEffect(() => {
    if (user && !userLoading) {
      loadingStateRef.current.userLoaded = true;
    }
    if (artisan && Object.keys(artisan).length > 0) {
      loadingStateRef.current.artisanLoaded = true;
    }
    if (jobListingState.artisanJobListings.data?.data?.items?.length > 0) {
      loadingStateRef.current.jobListingsLoaded = true;
    }
    if (proposals.length > 0) {
      loadingStateRef.current.proposalsLoaded = true;
    }
  }, [user, userLoading, artisan, jobListingState.artisanJobListings.data, proposals.length]);

  // 2. PROPOSAL DATA PROCESSING EFFECT - Handles proposal-related API calls
  useEffect(() => {
    if (activeTab !== 'proposals' || !proposals.length) return;

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
      console.log(`Dashboard: Loading negotiations for ${proposalsNeedingNegotiation.length} proposals`);
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
  }, [proposals, activeTab]);

  // 3. DATA SYNCHRONIZATION EFFECT - Handles state updates from API responses
  useEffect(() => {
    // Store negotiations data when received
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

  // 4. UI STATE MANAGEMENT - Memoized service data transformation
  const processedServices = useMemo(() => {
    if (activeTab === 'proposals' && proposals.length > 0) {
      // Process proposals for display
      const mergedData = proposals
        .map((proposal) => {
          const proposalNegotiationsData = proposalNegotiations[proposal.id] || [];

          return {
            ...proposal,
            negotiations: proposalNegotiationsData,
            id: proposal.id,
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

      return mergedData;
    } else if (activeTab === 'new' && jobListingState.artisanJobListings.data?.data?.items) {
      // Process job listings for display
      const jobListings = jobListingState.artisanJobListings.data.data.items;
      if (Array.isArray(jobListings)) {
        const transformedJobListings = jobListings
          .map((job, index) => ({
            ...job,
            id: job.id || `job-${index}`,
            title: job.title || 'Untitled Job',
            description: job.description || 'No description available',
            customer: job.customer?.name || job.userFullName || 'Unknown Customer',
            customerDetails: job.customer || {
              name: job.userFullName || 'Unknown Customer',
              location: job.location || 'Location not specified'
            },
            location: job.location || job.customer?.location || 'Location not specified',
            category: 'new-job-request'
          }))
          .slice(0, 5); // Limit to 5 items

        return transformedJobListings;
      }
    }

    // Default return empty array
    return [];
  }, [activeTab, proposals, proposalNegotiations, jobListingState.artisanJobListings.data]);

  // 5. CLEANUP EFFECT - Handles cleanup when component unmounts or tab changes
  useEffect(() => {
    const currentTimeouts = timeoutsRef.current;

    return () => {
      // Clear all timeouts on unmount or tab change
      currentTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      currentTimeouts.clear();
    };
  }, [activeTab]);

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

  // Loading and error state calculations
  const isLoadingDataPipeline = () => {
    if (activeTab === 'new') {
      return (
        userLoading ||
        artisanState.artisan.loading ||
        jobListingState.artisanJobListings.loading ||
        (user && (!artisan || Object.keys(artisan).length === 0) && !artisanState.artisan.error) ||
        (artisan &&
          Object.keys(artisan).length > 0 &&
          !jobListingState.artisanJobListings.data &&
          !jobListingState.artisanJobListings.error)
      );
    }
    if (activeTab === 'proposals') {
      return proposalLoading;
    }
    return false;
  };

  const getErrorMessage = () => {
    if (isLoadingDataPipeline()) return null;

    if (activeTab === 'new') {
      if (artisanState.artisan.error && (!artisan || Object.keys(artisan).length === 0)) {
        const error = artisanState.artisan.error;
        return typeof error === 'string' && error.trim()
          ? `Failed to load artisan profile: ${error}`
          : `Failed to load artisan profile: Unable to load artisan data`;
      }

      if (
        jobListingState.artisanJobListings.error &&
        (!jobListingState.artisanJobListings.data?.data?.items ||
          !Array.isArray(jobListingState.artisanJobListings.data.data.items) ||
          jobListingState.artisanJobListings.data.data.items.length === 0)
      ) {
        const error = jobListingState.artisanJobListings.error;
        return typeof error === 'string'
          ? error
          : error?.message
          ? error.message
          : error?.data?.message
          ? error.data.message
          : 'An error occurred while loading job requests';
      }
    }

    if (activeTab === 'proposals') {
      if (proposalError && (!proposals || proposals.length === 0)) {
        const error = proposalError;
        return typeof error === 'string'
          ? error
          : error?.message
          ? error.message
          : error?.data?.message
          ? error.data.message
          : 'An error occurred while loading proposals';
      }
    }

    return null;
  };

  const getLoadingMessage = () => {
    if (activeTab === 'proposals') return 'Loading proposals...';
    if (activeTab === 'new') {
      if (userLoading) return 'Loading user profile...';
      if (artisanState.artisan.loading) return 'Loading artisan profile...';
      if (jobListingState.artisanJobListings.loading) return 'Loading job requests...';
      if (user && (!artisan || Object.keys(artisan).length === 0)) return 'Setting up artisan profile...';
      if (artisan && Object.keys(artisan).length > 0 && !jobListingState.artisanJobListings.data)
        return 'Fetching available job requests...';
      return 'Loading job requests...';
    }
    return 'Loading...';
  };

  const errorMessage = getErrorMessage();
  const currentLoading = isLoadingDataPipeline();

  const tabs = [
    { id: 'proposals', label: 'Proposal Sent' },
    { id: 'new', label: 'New Job Requests' },
    { id: 'in-progress', label: 'Jobs In Progress' },
    { id: 'today', label: "Today's Jobs" }
  ];

  return (
    <>
      <DashboardHeader data={user} />
      <TabNav
        tabs={tabs}
        activeTab={activeTab}
        basePath="/artisan/dashboard"
        navClassName="flex flex-wrap items-center gap-8 font-inter font-medium"
      />
      <div className="mt-8">
        {errorMessage ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading job requests: {errorMessage}</p>
            <button
              onClick={() => {
                const subcategoryId = artisan?.subcategories?.result?.[0]?.subcategory?.id;
                if (subcategoryId) {
                  fetchArtisanJobListings([subcategoryId]);
                } else if (user?.id) {
                  fetchArtisanById(user.id);
                } else if (!user && !userLoading) {
                  fetchCurrentUser();
                }
              }}
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : currentLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">{getLoadingMessage()}</p>
            {activeTab === 'new' && (
              <p className="mt-1 text-sm text-gray-500">
                {userLoading
                  ? 'Please wait while we verify your account...'
                  : artisanState.artisan.loading
                  ? 'Retrieving your artisan profile and specializations...'
                  : jobListingState.artisanJobListings.loading
                  ? 'Finding job requests that match your skills...'
                  : 'Preparing your dashboard...'}
              </p>
            )}
          </div>
        ) : (
          <RecentServices
            services={processedServices}
            activeTab={activeTab}
            isProposalsTab={activeTab === 'proposals'}
            proposalLoading={proposalLoading}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
