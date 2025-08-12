import React, { useState, useEffect, useMemo, useRef } from 'react';
import JobRequestCard from './JobRequestCard';
import Pagination from '../../../components/Pagination';
import { useJobListings } from '../../../contexts/JobListingContext.jsx';
import { useArtisan } from '../../../contexts/ArtisanContext.jsx';
import { useUser } from '../../../contexts/UserContext.jsx';

const ITEMS_PER_PAGE = 10;

const JobRequestsTab = ({
  searchQuery,
  categoryFilter,
  locationFilter,
  datePostedFilter,
  dateNeededFilter,
  sortBy
}) => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Context hooks
  const { state: jobListingState, fetchArtisanJobListings } = useJobListings();
  const { state: artisanState } = useArtisan();
  const { state: userState } = useUser();

  // Extract user data
  const userData = userState?.user?.data;
  const user = userData?.data || userData;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, locationFilter, datePostedFilter, dateNeededFilter, sortBy]);

  // Fetch job listings
  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        // Get artisan subcategories for filtering
        const artisanData = artisanState?.artisan?.data?.data || artisanState?.artisan?.data;
        const subcategories = artisanData?.subcategories || [];

        // Ensure subcategories is an array before calling map
        const allSubcategoryIds = Array.isArray(subcategories)
          ? subcategories.map((sub) => sub.id).filter(Boolean)
          : [];

        console.log('🔍 JobRequestsTab: Fetching jobs with subcategories:', allSubcategoryIds);
        console.log('🔍 JobRequestsTab: Current page:', currentPage);

        if (fetchArtisanJobListings) {
          // Try to fetch jobs (remove page parameter for now to test)
          if (allSubcategoryIds.length > 0) {
            await fetchArtisanJobListings(allSubcategoryIds);
          } else {
            // Fetch all job listings if artisan has no specific subcategories
            console.log('⚠️ JobRequestsTab: No subcategories found, fetching all jobs');
            await fetchArtisanJobListings([]);
          }
        }
      } catch (err) {
        console.error('❌ JobRequestsTab: Error fetching jobs:', err);
        setError('Failed to load job requests');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user?.id, artisanState?.artisan, fetchArtisanJobListings]);

  // Process API response
  useEffect(() => {
    const apiResponse = jobListingState?.artisanJobListings;
    const jobListings = apiResponse?.data?.data?.items || apiResponse?.data?.items || [];
    const apiError = apiResponse?.error;

    console.log('📋 JobRequestsTab: Processing job listings:', jobListings);

    // Check if there's a real error (not just an empty object)
    const hasRealError =
      apiError && (typeof apiError === 'string' || (typeof apiError === 'object' && Object.keys(apiError).length > 0));

    if (Array.isArray(jobListings) && jobListings.length > 0) {
      const transformedJobs = jobListings.map((job) => ({
        ...job,
        id: job.id || Math.random().toString(36),
        title: job.title || 'Untitled Job',
        description: job.description || 'No description available',
        customer: {
          name: job.customer?.name || job.userFullName || 'Unknown Customer',
          location: job.location || job.customer?.location || 'Location not specified'
        },
        location: job.location || job.customer?.location || 'Location not specified',
        category: 'job-request'
      }));

      console.log('✅ JobRequestsTab: Transformed jobs:', transformedJobs);
      setJobs(transformedJobs);
      setError(null);
    } else {
      setJobs([]);
      // Only set error if there's actually a real API error
      if (hasRealError) {
        console.error('🚨 JobRequestsTab: Real API Error:', apiError);
        setError('Failed to load job requests');
      } else {
        console.log('ℹ️ JobRequestsTab: No jobs found, but no API error');
        setError(null);
      }
    }

    // Handle real API errors specifically
    if (hasRealError) {
      console.error('🚨 JobRequestsTab: API Error detected:', apiError);
      setError('Failed to load job requests');
    }
  }, [jobListingState?.artisanJobListings]);

  // Memoized filtered and sorted data for job requests (from fetchArtisanJobListings)
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) => job.title.toLowerCase().includes(query) || job.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(
        (job) =>
          job.category?.toLowerCase() === categoryFilter.toLowerCase() ||
          job.subcategoryName?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter((job) => job?.customer?.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    // Apply date posted filter
    if (datePostedFilter) {
      const filterDate = new Date(datePostedFilter);
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.postedAt);
        return jobDate >= filterDate;
      });
    }

    // Apply date needed filter
    if (dateNeededFilter) {
      const filterDate = new Date(dateNeededFilter);
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.dateNeeded);
        return jobDate >= filterDate;
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
  }, [jobs, searchQuery, categoryFilter, locationFilter, datePostedFilter, dateNeededFilter, sortBy]);

  // Pagination calculations
  const totalItems = filteredAndSortedJobs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = filteredAndSortedJobs.slice(startIndex, endIndex);

  // Debug pagination
  console.log('📄 JobRequestsTab Pagination Debug:', {
    totalJobs: jobs.length,
    filteredJobs: filteredAndSortedJobs.length,
    totalItems,
    totalPages,
    currentPage,
    ITEMS_PER_PAGE,
    startIndex,
    endIndex,
    currentPageDataLength: currentPageData.length,
    shouldShowPagination: totalPages > 1
  });

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading job requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Error loading job requests: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 hover:underline">
          Refresh page
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600">No Job Requests Available</h3>
          <p className="text-gray-500 max-w-md">
            It looks like there are no job requests at the moment. Check back later for new opportunities!
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
            Try adjusting your search criteria or filters to find more job requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPageData.map((job) => (
          <JobRequestCard key={`job-${job.id}`} job={job} activeTab="requests" />
        ))}
      </div>

      {/* Pagination Component - Temporarily always show for debugging */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalResults={totalItems}
          resultsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </>
  );
};

export default JobRequestsTab;
