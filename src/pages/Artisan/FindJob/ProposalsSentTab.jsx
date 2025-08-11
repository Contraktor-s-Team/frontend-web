import React, { useState, useEffect, useMemo, useRef } from 'react';
import ProposalCard from './ProposalCard';
import Pagination from '../../../components/Pagination';
import { useProposal } from '../../../contexts/ProposalContext.jsx';
import { useUser } from '../../../contexts/UserContext.jsx';

const ITEMS_PER_PAGE = 10;

const ProposalsSentTab = ({
  searchQuery,
  categoryFilter,
  locationFilter,
  datePostedFilter,
  dateNeededFilter,
  sortBy,
  activeTab
}) => {
  // State management
  const [proposedJobs, setProposedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Context hooks
  const { state: proposalState, fetchArtisanProposal } = useProposal();
  const { state: userState } = useUser();

  // Extract user data
  const userData = userState?.user?.data;
  const user = userData?.data || userData;
  const currentUserId = user?.id || userData?.id || userState?.user?.data?.data?.id;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, locationFilter, datePostedFilter, dateNeededFilter, sortBy]);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      if (!currentUserId) return;

      setLoading(true);
      setError(null);

      try {
        console.log('📋 ProposalsSentTab: Fetching proposals for user:', currentUserId);

        if (fetchArtisanProposal) {
          await fetchArtisanProposal();
        }
      } catch (err) {
        console.error('❌ ProposalsSentTab: Error fetching proposals:', err);
        setError('Failed to load proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [currentUserId, fetchArtisanProposal]);

  // Process proposal data
  useEffect(() => {
    const proposalData = proposalState?.artisanProposal?.data?.data || [];
    const apiError = proposalState?.artisanProposal?.error;

    console.log('📋 ProposalsSentTab: Processing proposals:', {
      proposalData,
      proposalDataLength: proposalData?.length,
      fullResponse: proposalState?.artisanProposal
    });

    // Check if there's a real error (not just an empty object)
    const hasRealError =
      apiError && (typeof apiError === 'string' || (typeof apiError === 'object' && Object.keys(apiError).length > 0));

    if (Array.isArray(proposalData) && proposalData.length > 0) {
      // Process proposals with only basic data
      const processedData = proposalData.map((proposal, index) => ({
        ...proposal,
        id: `${proposal.jobListingId || proposal.id}-${index}`, // Ensure unique ID
        proposalId: proposal.id,
        title: `Proposal #${proposal.id?.slice(0, 8) || 'Unknown'}`,
        description: proposal.message || 'No proposal message available',
        subcategoryName: 'Category unavailable',
        customer: {
          name: 'Customer information unavailable',
          location: 'Location unavailable'
        },
        postedAt: proposal.submittedAt,
        proposalStatus: proposal.status,
        proposedPrice: proposal.proposedPrice,
        proposalMessage: proposal.message,
        imageUrls: [],
        senderId: proposal.senderId,
        currentUserId: currentUserId
      }));

      console.log('✅ ProposalsSentTab: Processed proposal data:', processedData);
      setProposedJobs(processedData);
      setError(null); // Clear any previous errors
    } else {
      setProposedJobs([]);
      // Only set error if there's actually a real API error
      if (hasRealError) {
        console.error('🚨 ProposalsSentTab: Real API Error:', apiError);
        setError('Failed to load proposals');
      } else {
        console.log('ℹ️ ProposalsSentTab: No proposals found, but no API error');
        setError(null);
      }
    }

    // Handle real API errors specifically
    if (hasRealError) {
      console.error('🚨 ProposalsSentTab: API Error detected:', apiError);
      setError('Failed to load proposals');
    }
  }, [proposalState?.artisanProposal, currentUserId]);

  // Memoized filtered and sorted data for proposals (from fetchArtisanProposal)
  const filteredAndSortedProposals = useMemo(() => {
    let filtered = [...proposedJobs];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (proposal) =>
          proposal.title.toLowerCase().includes(query) ||
          proposal.description.toLowerCase().includes(query) ||
          proposal.proposalMessage?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.category?.toLowerCase() === categoryFilter.toLowerCase() ||
          proposal.subcategoryName?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter((proposal) =>
        proposal?.customer?.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply date posted filter
    if (datePostedFilter) {
      const filterDate = new Date(datePostedFilter);
      filtered = filtered.filter((proposal) => {
        const proposalDate = new Date(proposal.postedAt);
        return proposalDate >= filterDate;
      });
    }

    // Apply date needed filter
    if (dateNeededFilter) {
      const filterDate = new Date(dateNeededFilter);
      filtered = filtered.filter((proposal) => {
        const proposalDate = new Date(proposal.dateNeeded);
        return proposalDate >= filterDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedAt) - new Date(a.postedAt);
        case 'oldest':
          return new Date(a.postedAt) - new Date(b.postedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'location':
          return (a.customer?.location || '').localeCompare(b.customer?.location || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [proposedJobs, searchQuery, categoryFilter, locationFilter, datePostedFilter, dateNeededFilter, sortBy]);

  // Pagination calculations
  const totalItems = filteredAndSortedProposals.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredAndSortedProposals.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Error loading proposals: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 hover:underline">
          Refresh page
        </button>
      </div>
    );
  }

  if (proposedJobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl">📝</div>
          <h3 className="text-xl font-semibold text-gray-600">No Proposals Sent</h3>
          <p className="text-gray-500 max-w-md">
            You haven't sent any proposals yet. Browse the job requests tab to find opportunities and send your first
            proposal!
          </p>
          <button onClick={() => window.location.reload()} className="mt-2 ml-4 text-blue-600 hover:underline">
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  if (currentPageData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600">No Results Found</h3>
          <p className="text-gray-500 max-w-md">
            Try adjusting your search criteria or filters to find your proposals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPageData.map((proposal, index) => (
          <ProposalCard key={`proposal-${proposal.proposalId}-${index}`} proposal={proposal} activeTab={activeTab} />
        ))}
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalResults={totalItems}
            resultsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      )}
    </>
  );
};

export default ProposalsSentTab;
