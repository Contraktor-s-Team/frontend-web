import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/PageHeader/PageHeader';
import SearchFilters from './searchFilters';
import TabNav from '../../../components/Navigation/TabNav';
import { useParams } from 'react-router-dom';
import { artisanJobAction, jobIdAction } from '../../../redux/Jobs/JobsAction';
import { connect } from 'react-redux';
import JobCard from './JobCard';
import { getArtisanIdAction } from '../../../redux/Artisan/ArtisanAction';
import { artisanProposalAction, negotiateAction } from '../../../redux/Proposals/ProposalAction';

const FindJob = ({
  data,
  getJob,
  getArtisanDiscovery,
  jobLoading,
  jobsData,
  jobError,
  id,
  getProposedJob,
  getProposal,
  proposalData,
  proposalLoading,
  proposedJobsData,
  getNegotiations,
  negotiations,
  negotiationsLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [datePostedFilter, setDatePostedFilter] = useState('');
  const [dateNeededFilter, setDateNeededFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [proposedJobs, setProposedJobs] = useState([]);
  const [filteredProposedJobs, setFilteredProposedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to store fetched job details
  const [fetchedJobDetails, setFetchedJobDetails] = useState({});
  // State to store negotiations for each proposal
  const [proposalNegotiations, setProposalNegotiations] = useState({});

  const { tab: activeTab = 'listings' } = useParams();

  const tabs = [
    { id: 'listings', label: 'Job Listings' },
    { id: 'requests', label: 'Proposal sent' },
  ];

  // Get current user ID from data
  const currentUserId = data?.data?.id;

  // Fetch initial data based on user ID
  useEffect(() => {
    if (id) {
      getJob(id);
    }
  }, [id, getJob]);

  useEffect(() => {
    if (data?.data?.id) {
      getArtisanDiscovery(data?.data?.id);
    }
  }, [data]);

  // Fetch proposals when switching to requests tab
  useEffect(() => {
    if (activeTab === 'requests') {
      getProposal();
    }
  }, [activeTab, getProposal]);

  // Fetch negotiations for each proposal when proposal data is available
  useEffect(() => {
    if (proposalData && proposalData.length > 0 && activeTab === 'requests') {
      proposalData.forEach(proposal => {
        if (proposal.id && !proposalNegotiations[proposal.id]) {
          getNegotiations(proposal.id);
        }
      });
    }
  }, [proposalData, activeTab, getNegotiations, proposalNegotiations]);

  // Store negotiations data when it's received
  useEffect(() => {
    if (negotiations && negotiations.data) {
      // Assuming negotiations.data contains proposalId and negotiation data
      const proposalId = negotiations.proposalId || negotiations.data.proposalId;
      if (proposalId) {
        setProposalNegotiations(prev => ({
          ...prev,
          [proposalId]: negotiations.data
        }));
      }
    }
  }, [negotiations]);

  // Handle job listings data
  useEffect(() => {
    if (jobsData && jobsData.length > 0) {
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      setLoading(false);
    }
  }, [jobsData]);

  // Handle proposal data and fetch corresponding job details
  useEffect(() => {
    if (proposalData && proposalData.length > 0) {
      // Extract unique job listing IDs from proposals
      const jobListingIds = [...new Set(proposalData.map(proposal => proposal.jobListingId))];

      // Fetch job details for each proposal
      jobListingIds.forEach(jobId => {
        // Only fetch if we haven't already fetched this job
        if (!fetchedJobDetails[jobId]) {
          getProposedJob(jobId);
        }
      });
    }
  }, [proposalData, getProposedJob, fetchedJobDetails]);

  // Store fetched job details when proposedJobsData changes
  useEffect(() => {
    if (proposedJobsData && proposedJobsData.id) {
      setFetchedJobDetails(prev => ({
        ...prev,
        [proposedJobsData.id]: proposedJobsData
      }));
    }
  }, [proposedJobsData]);

  // Helper function to check if user can accept a negotiation
  const canAcceptNegotiation = (proposal) => {
    // User cannot accept if they are the sender (artisan) themselves
    if (proposal.senderId === currentUserId) {
      return false;
    }
    return true;
  };

  // Helper function to check if there's an ongoing negotiation
  const hasOngoingNegotiation = (proposalId) => {
    const negotiationData = proposalNegotiations[proposalId];
    return negotiationData && negotiationData.length > 0;
  };

  // Merge proposal data with job details and negotiation info
  useEffect(() => {
    if (proposalData && proposalData.length > 0) {
      const mergedData = proposalData.map(proposal => {
        const jobDetails = fetchedJobDetails[proposal.jobListingId];
        const negotiations = proposalNegotiations[proposal.id] || [];
        
        return {
          ...proposal,
          jobDetails: jobDetails || null,
          negotiations: negotiations,
          // Map job details to match existing structure for JobCard compatibility
          id: proposal.id,
          title: jobDetails?.title || 'Job details unavailable',
          description: jobDetails?.description || 'Description unavailable',
          subcategoryName: jobDetails?.subcategoryName || 'Category unavailable',
          customer: jobDetails?.customer || { name: 'Customer unavailable', location: 'Location unavailable' },
          postedAt: jobDetails?.postedAt || proposal.submittedAt,
          proposalStatus: proposal.status,
          proposedPrice: proposal.proposedPrice,
          proposalMessage: proposal.message,
          imageUrls: jobDetails?.imageUrls || [],
          // Add negotiation-related properties
          canAccept: canAcceptNegotiation(proposal),
          hasNegotiation: hasOngoingNegotiation(proposal.id),
          senderId: proposal.senderId,
          currentUserId: currentUserId
        };
      });

      setProposedJobs(mergedData);
      setFilteredProposedJobs(mergedData);
    }
  }, [proposalData, fetchedJobDetails, proposalNegotiations, currentUserId]);

  // Filter jobs based on search and filters
  useEffect(() => {
    if (activeTab === 'listings') {
      let result = [...jobs];

      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          job => 
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.customer.name.toLowerCase().includes(query) ||
            job.customer.location.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (categoryFilter) {
        result = result.filter(job => 
          job.category?.toLowerCase() === categoryFilter.toLowerCase() ||
          job.subcategoryName?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      // Apply location filter
      if (locationFilter) {
        result = result.filter(job => 
          job.customer.location.toLowerCase() === locationFilter.toLowerCase()
        );
      }

      setFilteredJobs(result);
    } else if (activeTab === 'requests') {
      let result = [...proposedJobs];

      // Apply search query filter for proposals
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          job => 
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.customer.name.toLowerCase().includes(query) ||
            job.customer.location.toLowerCase().includes(query) ||
            job.proposalMessage?.toLowerCase().includes(query)
        );
      }

      // Apply category filter for proposals
      if (categoryFilter) {
        result = result.filter(job => 
          job.subcategoryName?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      // Apply location filter for proposals
      if (locationFilter) {
        result = result.filter(job => 
          job.customer.location.toLowerCase() === locationFilter.toLowerCase()
        );
      }

      setFilteredProposedJobs(result);
    }
  }, [jobs, proposedJobs, activeTab, searchQuery, categoryFilter, locationFilter]);

  // Determine current data and loading state based on active tab
  const getCurrentData = () => {
    if (activeTab === 'requests') {
      return {
        data: filteredProposedJobs,
        loading: proposalLoading,
        isEmpty: proposalData?.length === 0
      };
    }
    return {
      data: filteredJobs,
      loading: jobLoading,
      isEmpty: jobsData?.length === 0
    };
  };

  const { data: currentData, loading: currentLoading, isEmpty } = getCurrentData();

  console.log("Filtered jobs:", filteredJobs);
  console.log("Job data:", jobsData, jobs);
  console.log("Proposal data:", proposalData);
  console.log("Proposed jobs data:", proposedJobsData);
  console.log("Fetched job details:", fetchedJobDetails);
  console.log("Merged proposed jobs:", proposedJobs);
  console.log("Proposal negotiations:", proposalNegotiations);
  console.log("Current user ID:", currentUserId);

  return (
    <div className='font-inter font-medium'>
      <PageHeader
        title="Find New Jobs Near You"
        subtitle="Browse available Jobs or respond to direct requests sent by customers."
      />

      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        datePostedFilter={datePostedFilter}
        setDatePostedFilter={setDatePostedFilter}
        dateNeededFilter={dateNeededFilter}
        setDateNeededFilter={setDateNeededFilter}
      />

      <div className="">
        <TabNav tabs={tabs} activeTab={activeTab} basePath="/artisan/find-jobs" />
      </div>

      <div className="mt-6">
        {currentLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">
              {activeTab === 'requests' ? 'Loading proposals...' : 'Loading jobs...'}
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error loading {activeTab === 'requests' ? 'proposals' : 'jobs'}: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : currentData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.map((job) => (
              <JobCard
                key={job.id} 
                job={job} 
                activeTab={activeTab} 
                isProposal={activeTab === 'requests'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No {activeTab === 'requests' ? 'proposals' : 'jobs'} found
            </h3>
            <p className="text-gray-500">
              {searchQuery || categoryFilter || locationFilter 
                ? 'Try adjusting your search or filter criteria.' 
                : isEmpty
                  ? `There are currently no ${activeTab === 'requests' ? 'proposals sent' : 'jobs available'}. Please check back later.`
                  : 'Loading...'}
            </p>
            {(searchQuery || categoryFilter || locationFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setLocationFilter('');
                  setDatePostedFilter('');
                  setDateNeededFilter('');
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const mapStoreToProps = (state) => {
  console.log(state);
  return {
    data: state?.user?.data,
    jobLoading: state?.jobs?.loading,
    jobsData: state?.jobs?.data?.data,
    proposalData: state?.artisanProposal?.data?.data,
    proposalLoading: state?.artisanProposal?.loading,
    proposedJobsData: state?.singleJob?.data?.data, // This returns a single job object
    error: state?.jobs?.error,
    id: state?.artisan?.data?.subcategories?.result[0]?.subcategoryId,
    // Add negotiation state
    negotiations: state?.negotiate?.data?.data,
    negotiationsLoading: state?.negotiate?.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getJob: (id) => dispatch(artisanJobAction(id)),
    getProposedJob: (id) => dispatch(jobIdAction(id)),
    getProposal: () => dispatch(artisanProposalAction()),
    getArtisanDiscovery: (id) => dispatch(getArtisanIdAction(id)),
    getNegotiations: (proposalId) => dispatch(negotiateAction(proposalId)),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(FindJob);