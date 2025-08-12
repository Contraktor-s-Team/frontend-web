import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, Calendar, Plus, ChevronDown, AlertCircle } from 'lucide-react';
import { Select, TextInput } from '../../../components/Form';
import Button from '../../../components/Button/Button';
import Pagination from '../../../components/Pagination';
import TabNav from '../../../components/Navigation/TabNav';
import ServiceTable from '../../../components/Tables/ServiceTable';
import PageHeader from '../../../components/PageHeader/PageHeader';
import { useJobListings } from '../../../contexts/JobListingContext.jsx';

const MyJobs = () => {
  const { state, fetchJobListings, fetchUserJobs } = useJobListings();
  const { tab: activeTab = 'posted' } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters - initialize from URL params
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    dateRange: searchParams.get('dateRange') || '',
    pageNumber: parseInt(searchParams.get('page')) || 1,
    pageSize: parseInt(searchParams.get('pageSize')) || 10
  });

  // Debounced search to avoid too many API calls
  const [searchQuery, setSearchQuery] = useState(filters.searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.searchTerm);

  // Add loading state for tab transitions
  const [isTabChanging, setIsTabChanging] = useState(false);

  // FIXED: Consistent tab to status mapping
  const TAB_STATUS_MAP = {
    posted: 'Posted', // For posted jobs API
    'in-progress': 0, // Status 1 = In Progress
    completed: 1, // Status 2 = Completed
    cancelled: 3
  };

  // FIXED: Reverse mapping for debugging
  const STATUS_TO_TAB_MAP = {
    0: 'in-progress',
    1: 'completed',
    2: 'cancelled'
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.searchTerm) {
      handleFilterChange('searchTerm', debouncedSearch);
    }
  }, [debouncedSearch]);

  // Sync URL params with filters
  const updateUrlParams = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== '' && value !== 'all' && value !== 'date-range') {
          if (key === 'pageNumber') {
            params.set('page', value.toString());
          } else if (key === 'pageSize') {
            params.set('pageSize', value.toString());
          } else if (key === 'searchTerm') {
            params.set('search', value);
          } else {
            params.set(key, value);
          }
        }
      });

      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filterName, value) => {
      const newFilters = {
        ...filters,
        [filterName]: value,
        // Reset to page 1 when filters change (except pagination)
        ...(filterName !== 'pageNumber' && filterName !== 'pageSize' ? { pageNumber: 1 } : {})
      };

      setFilters(newFilters);
      updateUrlParams(newFilters);
    },
    [filters, updateUrlParams]
  );

  // Build filters for API call based on current tab and filters
  const buildApiFilters = useCallback(() => {
    const apiFilters = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize
    };

    // Add search term if present
    if (filters.searchTerm && filters.searchTerm.trim()) {
      apiFilters.searchTerm = filters.searchTerm.trim();
    }

    // Map UI status to API status for posted jobs only
    if (activeTab === 'posted' && filters.status && filters.status !== 'status') {
      apiFilters.status = mapStatusToApi(filters.status);
    }

    // Handle date range
    if (filters.dateRange && filters.dateRange !== 'date-range') {
      const dateFilters = getDateRangeFilters(filters.dateRange);
      Object.assign(apiFilters, dateFilters);
    }

    // Add tab-specific filters for posted jobs
    if (activeTab === 'posted') {
      apiFilters.status = 'Posted';
    }

    return apiFilters;
  }, [filters, activeTab]);

  // FIXED: Build filters for UserJobs API with strict status filtering
  const buildUserJobsFilters = useCallback(() => {
    const apiFilters = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize
    };

    // Add search term if present
    if (filters.searchTerm && filters.searchTerm.trim()) {
      apiFilters.searchTerm = filters.searchTerm.trim();
    }

    // CRITICAL: Always send the exact status parameter to filter on the backend
    const expectedStatus = TAB_STATUS_MAP[activeTab];
    if (expectedStatus !== undefined && typeof expectedStatus === 'number') {
      apiFilters.status = expectedStatus;
    }

    // Handle date range
    if (filters.dateRange && filters.dateRange !== 'date-range') {
      const dateFilters = getDateRangeFilters(filters.dateRange);
      Object.assign(apiFilters, dateFilters);
    }

    console.log('🔧 UserJobs API Filters:', apiFilters, 'for tab:', activeTab);
    return apiFilters;
  }, [filters, activeTab]);

  // Map UI status values to API status values (for posted jobs)
  const mapStatusToApi = (uiStatus) => {
    const statusMap = {
      posted: 'Posted',
      pending: 'Pending'
    };
    return statusMap[uiStatus] || uiStatus;
  };

  // Get date range filters
  const getDateRangeFilters = (dateRange) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case 'today':
        return {
          fromDate: today.toISOString(),
          toDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
        };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return {
          fromDate: weekStart.toISOString(),
          toDate: now.toISOString()
        };
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          fromDate: monthStart.toISOString(),
          toDate: now.toISOString()
        };
      default:
        return {};
    }
  };

  // FIXED: Reset filters when tab changes - moved to separate effect with proper timing
  useEffect(() => {
    console.log('🔄 Tab changed to:', activeTab);
    setIsTabChanging(true);

    // Reset filters immediately for new tab
    const resetFilters = {
      searchTerm: '',
      status: '',
      dateRange: '',
      pageNumber: 1,
      pageSize: filters.pageSize
    };

    setFilters(resetFilters);
    setSearchQuery('');
    setDebouncedSearch('');
    updateUrlParams(resetFilters);

    // Small delay to allow state to settle
    setTimeout(() => {
      setIsTabChanging(false);
    }, 100);
  }, [activeTab, updateUrlParams]);

  // FIXED: Fetch appropriate data based on active tab - separate effect with better dependencies
  useEffect(() => {
    // Don't fetch during tab transition
    if (isTabChanging) {
      console.log('⏳ Skipping fetch during tab transition');
      return;
    }

    console.log('🚀 Fetching data for tab:', activeTab);

    const fetchData = async () => {
      try {
        if (activeTab === 'posted') {
          console.log('📋 Fetching posted jobs...');
          const apiFilters = buildApiFilters();
          console.log('Posted job filters:', apiFilters);
          await fetchJobListings(apiFilters);
        } else if (['ongoing', 'in-progress', 'completed'].includes(activeTab)) {
          console.log('👤 Fetching user jobs for tab:', activeTab);
          const userJobsFilters = buildUserJobsFilters();
          console.log('User job filters:', userJobsFilters);
          await fetchUserJobs(userJobsFilters);
        }
      } catch (error) {
        console.error('❌ Error fetching data for tab:', activeTab, error);
      }
    };

    fetchData();
  }, [activeTab, filters, isTabChanging]); // Include isTabChanging in dependencies

  // Format job title to URL-friendly slug
  const formatJobSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Transform API data for posted jobs
  const transformPostedJobData = (apiJob) => {
    return {
      id: apiJob.id,
      title: apiJob.title.trim(),
      description: apiJob.description,
      postedAt: formatDate(apiJob.postedAt),
      userId: apiJob.userId,
      userFullName: apiJob.userFullName || 'Unknown User',
      artisanSubcategoryId: apiJob.artisanSubcategoryId,
      subcategoryName: apiJob.subcategoryName || 'General',
      proposals: apiJob.proposals || [],
      proposalCount: apiJob.proposals?.length || 0,
      tab: activeTab,
      artisan: apiJob.userFullName || 'N/A',
      status: apiJob.status
    };
  };

  // FIXED: Transform API data for user jobs with enhanced debugging
  const transformUserJobData = (apiJob) => {
    // The structure from the API shows nested jobListing data
    const jobListing = apiJob.jobListing || {};
    const user = jobListing.user || {};
    const artisan = apiJob.artisan || {};

    // CRITICAL: Validate that the item belongs to the current tab
    const expectedStatus = TAB_STATUS_MAP[activeTab];
    const actualStatus = apiJob.status;

    console.log('🔍 Transforming user job:', {
      jobId: apiJob.id,
      expectedStatus,
      actualStatus,
      tabShouldBe: STATUS_TO_TAB_MAP[actualStatus],
      currentTab: activeTab,
      matches: actualStatus === expectedStatus
    });

    return {
      id: apiJob.id,
      jobListingId: apiJob.jobListingId,
      title: jobListing.title?.trim() || 'Untitled Job',
      description: jobListing.description || '',
      postedAt: formatDate(jobListing.postedAt || apiJob.createdAt),
      userId: apiJob.userId,
      userFullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
      artisanId: apiJob.artisanId,
      artisanFullName: `${artisan.firstName || ''} ${artisan.lastName || ''}`.trim() || 'Unknown Artisan',
      artisanSubcategoryId: jobListing.artisanSubcategoryId,
      subcategoryName: jobListing.subcategoryName || 'General',
      proposals: [],
      proposalCount: 0,
      tab: activeTab,
      artisan: `${artisan.firstName || ''} ${artisan.lastName || ''}`.trim() || 'N/A',
      status: apiJob.status, // This is the enum (0, 1, 2)
      createdAt: apiJob.createdAt,
      // Add debug info
      _debugInfo: {
        expectedStatus,
        actualStatus,
        shouldBeInTab: STATUS_TO_TAB_MAP[actualStatus] || 'unknown'
      }
    };
  };

  // Get the appropriate data based on active tab
  const getCurrentTabData = () => {
    if (activeTab === 'posted') {
      return {
        loading: state.jobListings.loading,
        error: state.jobListings.error,
        data: state.jobListings.data,
        transformFunction: transformPostedJobData
      };
    } else {
      return {
        loading: state.userJobs.loading,
        error: state.userJobs.error,
        data: state.userJobs.data,
        transformFunction: transformUserJobData
      };
    }
  };

  const { loading, error, data: currentData, transformFunction } = getCurrentTabData();

  // FIXED: Enhanced data transformation with better debugging
  const transformedJobListings = (() => {
    if (!currentData?.data) {
      console.log('⚠️ No data available for tab:', activeTab);
      return [];
    }

    if (activeTab === 'posted') {
      const transformed = currentData.data.map(transformFunction) || [];
      console.log('📋 Posted jobs transformed:', transformed.length);
      return transformed;
    } else {
      // For user jobs, transform and then filter by status as a safety net
      const transformed = currentData.data.map(transformFunction) || [];
      const expectedStatus = TAB_STATUS_MAP[activeTab];

      console.log('👤 User jobs before filtering:', {
        total: transformed.length,
        expectedStatus,
        activeTab,
        statusCounts: transformed.reduce((acc, job) => {
          acc[job.status] = (acc[job.status] || 0) + 1;
          return acc;
        }, {})
      });

      // Client-side filtering as backup (API should handle this, but this prevents leaks)
      const filtered = transformed.filter((job) => {
        const matches = job.status === expectedStatus;
        if (!matches) {
          console.log('🚫 Filtering out job with wrong status:', {
            jobId: job.id,
            actualStatus: job.status,
            expectedStatus,
            shouldBeInTab: STATUS_TO_TAB_MAP[job.status]
          });
        }
        return matches;
      });

      console.log('👤 User jobs after filtering:', {
        filtered: filtered.length,
        total: transformed.length,
        activeTab
      });

      return filtered;
    }
  })();

  const totalPages = currentData?.totalPages || 0;
  const totalRecords = currentData?.totalRecords || 0;

  // Handle page change
  const handlePageChange = (pageNumber) => {
    handleFilterChange('pageNumber', pageNumber);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    handleFilterChange('pageSize', newPageSize);
    handleFilterChange('pageNumber', 1); // Reset to first page
  };

  const tabs = [
    { id: 'posted', label: 'Posted Jobs' },
    { id: 'in-progress', label: 'In Progress Jobs' }, // Status 0
    { id: 'completed', label: 'Completed Jobs' }, // Status 1
    { id: 'cancelled', label: 'Cancelled Jobs' } // Status 2
  ];

  // Loading state - enhanced to show tab transition state
  if (loading || isTabChanging) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Jobs"
          subtitle="Manage your posted jobs and track their progress"
          buttonText="Post a Job"
          buttonVariant="secondary"
          buttonHref="/customer/post-job/describe"
          buttonIcon={<Plus size={18} />}
        />

        <TabNav
          tabs={tabs}
          activeTab={activeTab}
          basePath="/customer/jobs"
          navClassName="flex flex-wrap items-center justify-between"
        />

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="font-manrope text-xl leading-6 font-semibold text-gray-900">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h3>
          </div>

          {/* Loading skeleton */}
          <div className="p-6">
            <div className="animate-pulse">
              <div className="flex space-x-4 mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  const hasError = error && (error.message || error.error || (typeof error === 'string' && error.length > 0));
  if (hasError) {
    const retryFunction =
      activeTab === 'posted' ? () => fetchJobListings(buildApiFilters()) : () => fetchUserJobs(buildUserJobsFilters());

    return (
      <div className="space-y-6">
        <PageHeader
          title="My Jobs"
          subtitle="Manage your posted jobs and track their progress"
          buttonText="Post a Job"
          buttonVariant="secondary"
          buttonHref="/customer/post-job/describe"
          buttonIcon={<Plus size={18} />}
        />

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Jobs</h3>
            <p className="mt-1 text-sm text-gray-500">
              {typeof error === 'string' ? error : 'There was an error loading your jobs. Please try again.'}
            </p>
            <div className="mt-6">
              <Button onClick={retryFunction} variant="primary" className="inline-flex items-center">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎯 Final render state:', {
    activeTab,
    loading,
    error,
    transformedJobListingsCount: transformedJobListings.length,
    hasCurrentData: !!currentData,
    totalRecords,
    isTabChanging
  });

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8">
      <PageHeader
        title="My Jobs"
        subtitle="Manage your posted jobs and track their progress"
        buttonText="Post a Job"
        buttonVariant="secondary"
        buttonHref="/customer/post-job/describe"
        buttonIcon={<Plus size={18} />}
      />

      {/* Tabs */}
      <TabNav
        tabs={tabs}
        activeTab={activeTab}
        basePath="/customer/jobs"
        navClassName="flex flex-wrap items-center justify-between"
      />

      {/* Jobs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2 sm:px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="font-manrope text-xl leading-6 font-semibold text-gray-900 mb-2 md:mb-0">
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </h3>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-4">
            <div className="w-full sm:w-[220px] md:w-[333px]">
              <TextInput
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leadingIcon={<Search className="h-5 w-5 text-gray-400" />}
                className="w-full"
                inputClassName="pr-6 rounded-full"
              />
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Status filter - only show for posted jobs */}
              {activeTab === 'posted' && (
                <Select
                  value={filters.status || 'status'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  options={[
                    { value: 'status', label: 'All Status' },
                    { value: 'posted', label: 'Posted' },
                    { value: 'pending', label: 'Pending' }
                  ]}
                  trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
                  className="text-sm rounded-full w-full sm:w-auto"
                />
              )}
              <Select
                value={filters.dateRange || 'date-range'}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                options={[
                  { value: 'date-range', label: 'All Dates' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' }
                ]}
                trailingIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                className="text-sm rounded-full w-full sm:w-auto"
              />
            </div>
          </div>
        </div>

        {/* Table or Empty State */}
        {transformedJobListings.length > 0 ? (
          <ServiceTable
            items={transformedJobListings}
            onRowClick={(job) =>
              navigate(`/customer/jobs/${activeTab}/${activeTab === 'posted' ? job.id : job.jobListingId}`)
            }
            activeTab={activeTab}
            formatItemSlug={formatJobSlug}
          />
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-500">
              {filters.searchTerm ? (
                <>
                  <p>No jobs found matching "{filters.searchTerm}"</p>
                  <p className="text-sm mt-1">Try adjusting your search criteria</p>
                </>
              ) : (
                <>
                  <p>No {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} found</p>
                  <p className="text-sm mt-1">Jobs will appear here when available</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results summary */}
      {!loading && transformedJobListings.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-600">
          Showing {(filters.pageNumber - 1) * filters.pageSize + 1} to{' '}
          {Math.min(filters.pageNumber * filters.pageSize, totalRecords)} of {totalRecords} jobs
        </div>
      )}

      {/* Pagination - only show if there are jobs */}
      {transformedJobListings.length > 0 && totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Items per page:</span>
            <Select
              value={filters.pageSize.toString()}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              options={[
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '50', label: '50' }
              ]}
              className="text-sm w-20"
            />
          </div>

          <Pagination
            currentPage={filters.pageNumber}
            totalPages={totalPages}
            totalResults={totalRecords}
            onPageChange={handlePageChange}
            resultsPerPage={filters.pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default MyJobs;
