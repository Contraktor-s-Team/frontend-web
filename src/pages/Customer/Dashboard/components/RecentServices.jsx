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
      title: apiJobListing.title.trim(),
      description: apiJobListing.description,
      postedAt: formatDate(apiJobListing.postedAt),
      userId: apiJobListing.userId,
      userFullName: apiJobListing.userFullName || 'Unknown User',
      artisanSubcategoryId: apiJobListing.artisanSubcategoryId,
      subcategoryName: apiJobListing.subcategoryName || 'General',
      proposals: apiJobListing.proposals || [],
      proposalCount: apiJobListing.proposals?.length || 0,
      tab: determineJobListingTab(apiJobListing),
      artisan: apiJobListing.userFullName || 'N/A'
    };
  };

  const determineJobListingTab = (jobListing) => {
    if (jobListing.status === 'completed' || jobListing.status === 'Completed') {
      return 'completed';
    }
    if (jobListing.status === 'in-progress' || jobListing.status === 'In Progress') {
      return 'ongoing';
    }

    return 'posted';
  };

  // Handle different possible API response structures with proper error handling
  let jobListingsArray = [];

  if (jobListingData) {
    if (Array.isArray(jobListingData.data)) {
      jobListingsArray = jobListingData.data;
    } else if (Array.isArray(jobListingData.data?.items)) {
      jobListingsArray = jobListingData.data.items;
    } else if (Array.isArray(jobListingData.data?.data)) {
      jobListingsArray = jobListingData.data.data;
    } else if (Array.isArray(jobListingData)) {
      jobListingsArray = jobListingData;
    } else {
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
              <p>Loading job listings...</p>
            ) : (
              <>
                {currentTab === 'completed' ? (
                  <p className="text-lg font-medium text-gray-700">No completed jobs yet</p>
                ) : currentTab === 'ongoing' ? (
                  <p className="text-lg font-medium text-gray-700">No ongoing jobs</p>
                ) : (
                  <p className="text-lg font-medium text-gray-700">No posted jobs yet</p>
                )}
                <p className="text-sm mt-2 text-gray-500">
                  {currentTab === 'completed'
                    ? 'Your completed jobs will appear here'
                    : currentTab === 'ongoing'
                    ? 'Jobs in progress will appear here'
                    : 'Ready to get started? Post a job and connect with skilled artisans.'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentServices;
