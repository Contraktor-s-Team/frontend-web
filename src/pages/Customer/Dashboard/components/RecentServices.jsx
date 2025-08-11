import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';
import { useJobListings } from '../../../../contexts/JobListingContext';
import { Link, useParams, useNavigate } from 'react-router-dom';

const RecentServices = ({ activeTab }) => {
  const { tab: routeTab = 'posted' } = useParams();
  const navigate = useNavigate();
  const { fetchJobListings, state: jobListingState } = useJobListings();
  const loading = jobListingState.jobListings.loading;
  const jobListingData = jobListingState.jobListings.data;
  const error = jobListingState.jobListings.error;

  // Use activeTab prop if provided, otherwise fall back to route tab
  const currentTab = activeTab || routeTab;

  const formatJobSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const transformJobListingData = (apiJobListing) => {
    return {
      id: apiJobListing.id,
      title: apiJobListing.title.trim(), // Remove any trailing whitespace
      description: apiJobListing.description,
      postedAt: formatDate(apiJobListing.postedAt),
      userId: apiJobListing.userId,
      userFullName: apiJobListing.userFullName || 'Unknown User',
      artisanSubcategoryId: apiJobListing.artisanSubcategoryId,
      subcategoryName: apiJobListing.subcategoryName || 'General',
      proposals: apiJobListing.proposals || [],
      proposalCount: apiJobListing.proposals?.length || 0,
      // Add tab classification based on your business logic
      tab: determineJobListingTab(apiJobListing),
      // Add artisan field if needed by your table
      artisan: apiJobListing.userFullName || 'N/A'
    };
  };

  const determineJobListingTab = (jobListing) => {
    // Determine job listing tab based on status and proposals
    if (jobListing.status === 'completed' || jobListing.status === 'Completed') {
      return 'completed';
    }
    if (jobListing.status === 'in-progress' || jobListing.status === 'In Progress' || jobListing.status === 'ongoing') {
      return 'ongoing';
    }
    if (jobListing.proposals && jobListing.proposals.length > 0) {
      // Has proposals but not completed/ongoing, consider it ongoing
      return 'ongoing';
    }
    return 'posted'; // Default to posted if no proposals
  };

  // Debug logging to understand data structure
  console.log('📊 RecentServices Debug:', {
    hasJobListingData: !!jobListingData,
    jobListingDataKeys: jobListingData ? Object.keys(jobListingData) : 'no data',
    dataType: jobListingData?.data ? typeof jobListingData.data : 'no data property',
    isDataArray: Array.isArray(jobListingData?.data),
    dataLength: Array.isArray(jobListingData?.data) ? jobListingData.data.length : 'not array',
    fullJobListingData: jobListingData
  });

  // Handle different possible API response structures with proper error handling
  let jobListingsArray = [];

  if (jobListingData) {
    // Try different possible paths for the job listings array
    if (Array.isArray(jobListingData.data)) {
      jobListingsArray = jobListingData.data;
    } else if (Array.isArray(jobListingData.data?.items)) {
      jobListingsArray = jobListingData.data.items;
    } else if (Array.isArray(jobListingData.data?.data)) {
      jobListingsArray = jobListingData.data.data;
    } else if (Array.isArray(jobListingData)) {
      jobListingsArray = jobListingData;
    } else {
      console.warn('⚠️ RecentServices: Unable to find job listings array in API response:', jobListingData);
      jobListingsArray = []; // Ensure it's always an array
    }
  }

  const allJobListings = jobListingsArray.length > 0 ? jobListingsArray.map(transformJobListingData) : [];

  // Filter job listings by current tab and limit to 5 for dashboard display
  const filteredJobListings = allJobListings
    ? allJobListings.filter((jobListing) => jobListing.tab === currentTab).slice(0, 5)
    : [];

  useEffect(() => {
    // Add guards to prevent unnecessary API calls
    const authData = localStorage.getItem('auth');
    if (!authData) {
      console.log('🚫 RecentServices: No auth token found, skipping fetchJobListings');
      return;
    }

    // Check if we already have data or are currently loading
    if (loading) {
      console.log('⏳ RecentServices: Already loading, skipping fetchJobListings');
      return;
    }

    // Check if we have recent valid data (avoid fetching if we just got data)
    if (jobListingData?.data && Array.isArray(jobListingData.data) && jobListingData.data.length >= 0) {
      console.log('✅ RecentServices: Using existing job listings data');
      return;
    }

    console.log('🚀 RecentServices: Fetching job listings for current tab:', currentTab);
    fetchJobListings().catch((error) => {
      console.error('RecentServices: Failed to fetch job listings:', error);
    });
  }, [currentTab]); // Only re-fetch when tab changes

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Recent Job Listing</h2>
        <Link to="/customer/jobs/posted">
          <Button variant="secondary" to="/services" rightIcon={<ChevronRight size={20} />} className="">
            View All
          </Button>
        </Link>
      </div>
      {filteredJobListings?.length > 0 ? (
        <ServiceTable
          items={filteredJobListings}
          onRowClick={(jobListing) => navigate(`/customer/jobs/${currentTab}/${jobListing.id}`)}
          activeTab={currentTab}
          formatItemSlug={formatJobSlug}
        />
      ) : (
        <div className="p-6 text-center">
          <div className="text-gray-500">
            {loading ? (
              <>
                <p>Loading job listings...</p>
              </>
            ) : error ? (
              <>
                <p>Error loading job listings</p>
                <p className="text-sm mt-1">Please try again later</p>
              </>
            ) : (
              <>
                <p>No {currentTab} job listings found</p>
                <p className="text-sm mt-1">Job listings will appear here when available</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentServices;
