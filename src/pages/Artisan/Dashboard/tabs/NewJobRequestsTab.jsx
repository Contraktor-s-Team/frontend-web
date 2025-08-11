import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../contexts/UserContext';
import { useArtisan } from '../../../../contexts/ArtisanContext';
import { useJobListings } from '../../../../contexts/JobListingContext';

const NewJobRequestsTab = () => {
  const navigate = useNavigate();
  const loadingStateRef = useRef({
    userLoaded: false,
    artisanLoaded: false,
    jobListingsLoaded: false
  });

  // Context hooks
  const { state: userState, fetchCurrentUser } = useUser();
  const { state: artisanState, fetchArtisanById } = useArtisan();
  const { fetchArtisanJobListings, state: jobListingState } = useJobListings();

  // Derived state
  const userData = userState.user.data;
  const user = userData?.data || userData;
  const userLoading = userState.user.loading;
  const artisan = artisanState.artisan.data;
  const userId = userData?.data?.id || user?.id;

  // Sequential data loading effect
  useEffect(() => {
    // Step 1: Load user data if needed
    if (!user && !userLoading && fetchCurrentUser && !loadingStateRef.current.userLoaded) {
      console.log('NewJobRequestsTab: Fetching user data...');
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
      console.log('NewJobRequestsTab: Fetching artisan profile...');
      loadingStateRef.current.artisanLoaded = true;
      fetchArtisanById(userId);
      return;
    }

    // Step 3: Load job listings when both user and artisan are ready
    if (
      user &&
      artisan &&
      !artisanState.artisan.loading &&
      fetchArtisanJobListings &&
      !loadingStateRef.current.jobListingsLoaded
    ) {
      const subcategoryId = artisan?.subcategories?.result?.[0]?.subcategory?.id;
      const hasJobListings = jobListingState.artisanJobListings.data?.data?.items?.length > 0;

      if (subcategoryId && !hasJobListings && !jobListingState.artisanJobListings.loading) {
        console.log('NewJobRequestsTab: Loading job listings...');
        loadingStateRef.current.jobListingsLoaded = true;
        fetchArtisanJobListings([subcategoryId]);
      }
    }
  }, [
    user,
    userLoading,
    userId,
    artisan,
    artisanState.artisan.loading,
    fetchCurrentUser,
    fetchArtisanById,
    fetchArtisanJobListings,
    jobListingState.artisanJobListings.loading,
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
  }, [user, userLoading, artisan, jobListingState.artisanJobListings.data]);

  // Process job listings for display
  const processedJobListings = React.useMemo(() => {
    const jobListings = jobListingState.artisanJobListings.data?.data?.items;
    if (Array.isArray(jobListings)) {
      return jobListings
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
    }
    return [];
  }, [jobListingState.artisanJobListings.data]);

  const handleViewAll = () => {
    navigate('/artisan/find-jobs/listings');
  };

  // Handle clicking on a job item to view details
  const handleJobClick = (job) => {
    if (job.id) {
      console.log('Navigating to job details for ID:', job.id);
      navigate(`/artisan/find-jobs/job-details/${job.id}`);
    } else {
      console.warn('Job ID not found for navigation:', job);
    }
  };

  // Loading and error state calculations
  const isLoading = () => {
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
  };

  const getErrorMessage = () => {
    if (isLoading()) return null;

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

    return null;
  };

  const getLoadingMessage = () => {
    if (userLoading) return 'Loading user profile...';
    if (artisanState.artisan.loading) return 'Loading artisan profile...';
    if (jobListingState.artisanJobListings.loading) return 'Loading job requests...';
    if (user && (!artisan || Object.keys(artisan).length === 0)) return 'Setting up artisan profile...';
    if (artisan && Object.keys(artisan).length > 0 && !jobListingState.artisanJobListings.data)
      return 'Fetching available job requests...';
    return 'Loading job requests...';
  };

  const handleRetry = () => {
    const subcategoryId = artisan?.subcategories?.result?.[0]?.subcategory?.id;
    if (subcategoryId) {
      fetchArtisanJobListings([subcategoryId]);
    } else if (user?.id) {
      fetchArtisanById(user.id);
    } else if (!user && !userLoading) {
      fetchCurrentUser();
    }
  };

  const renderContent = () => {
    const errorMessage = getErrorMessage();
    const currentLoading = isLoading();

    // Show error state
    if (errorMessage) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error loading job requests: {errorMessage}</p>
          <button onClick={handleRetry} className="mt-2 text-blue-600 hover:underline">
            Try again
          </button>
        </div>
      );
    }

    // Show loading state
    if (currentLoading) {
      return (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">{getLoadingMessage()}</p>
          <p className="mt-1 text-sm text-gray-500">
            {userLoading
              ? 'Please wait while we verify your account...'
              : artisanState.artisan.loading
              ? 'Retrieving your artisan profile and specializations...'
              : jobListingState.artisanJobListings.loading
              ? 'Finding job requests that match your skills...'
              : 'Preparing your dashboard...'}
          </p>
        </div>
      );
    }

    // Show data in table format
    if (processedJobListings.length > 0) {
      return (
        <ServiceTable
          items={processedJobListings}
          activeTab="new"
          isProposalsTab={false}
          handlenav={handleViewAll}
          onRowClick={handleJobClick}
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
        <h3 className="text-lg font-medium text-gray-900 mb-1">No job requests available</h3>
        <p className="text-gray-500">
          There are currently no jobs available in this category. Please check back later.
        </p>
      </div>
    );
  };

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">New Job Requests</h2>
        <Button variant="secondary" onClick={handleViewAll} rightIcon={<ChevronRight size={20} />} className="">
          View All
        </Button>
      </div>

      {renderContent()}
    </div>
  );
};

export default NewJobRequestsTab;
