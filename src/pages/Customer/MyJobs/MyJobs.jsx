import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, Calendar, Plus, ChevronDown, AlertCircle } from 'lucide-react';
import { Select, TextInput } from '../../../components/Form';
import Button from '../../../components/Button/Button';
import Pagination from '../../../components/Pagination';
import TabNav from '../../../components/Navigation/TabNav';
import ServiceTable from '../../../components/Tables/ServiceTable';
import PageHeader from '../../../components/PageHeader/PageHeader';
import { jobAction } from '../../../redux/Jobs/JobsAction';
import { connect } from 'react-redux';

const MyJobs = ({
  getJob,
  loading,
  jobsData,
  error
}) => {
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
  const updateUrlParams = useCallback((newFilters) => {
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
  }, [setSearchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
      // Reset to page 1 when filters change (except pagination)
      ...(filterName !== 'pageNumber' && filterName !== 'pageSize' ? { pageNumber: 1 } : {})
    };

    setFilters(newFilters);
    updateUrlParams(newFilters);
  }, [filters, updateUrlParams]);

  // Build filters for API call based on current tab and filters
  const buildApiFilters = useCallback(() => {
    const apiFilters = {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
    };

    // Add search term if present
    if (filters.searchTerm && filters.searchTerm.trim()) {
      apiFilters.searchTerm = filters.searchTerm.trim();
    }

    // Map UI status to API status
    if (filters.status && filters.status !== 'status') {
      apiFilters.status = mapStatusToApi(filters.status);
    }

    // Handle date range
    if (filters.dateRange && filters.dateRange !== 'date-range') {
      const dateFilters = getDateRangeFilters(filters.dateRange);
      Object.assign(apiFilters, dateFilters);
    }

    // Add tab-specific filters if needed
    const tabFilters = getTabSpecificFilters(activeTab);
    Object.assign(apiFilters, tabFilters);

    return apiFilters;
  }, [filters, activeTab]);

  // Map UI status values to API status values
  const mapStatusToApi = (uiStatus) => {
    const statusMap = {
      'in-progress': 'InProgress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'pending': 'Pending',
      'posted': 'Posted'
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

  // Get tab-specific filters (customize based on your API)
  const getTabSpecificFilters = (tab) => {
    const tabFilters = {
      posted: { status: 'Posted' },
      ongoing: { status: 'InProgress' },
      scheduled: { status: 'Scheduled' },
      pending: { status: 'Pending' },
      completed: { status: 'Completed' },
      cancelled: { status: 'Cancelled' }
    };
    
    return tabFilters[tab] || {};
  };

  // Fetch jobs when filters change
  useEffect(() => {
    const apiFilters = buildApiFilters();
    console.log('Fetching jobs with filters:', apiFilters);
    getJob(apiFilters);
  }, [buildApiFilters, getJob]);

  // Reset filters when tab changes
  useEffect(() => {
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
  }, [activeTab]);

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

  // Transform API data to match your table format
  const transformJobData = (apiJob) => {
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
      tab: activeTab, // Use current active tab
      artisan: apiJob.userFullName || 'N/A',
      status: apiJob.status
    };
  };

  // Get transformed jobs data
  const transformedJobs = jobsData?.data?.map(transformJobData) || [];
  const totalPages = jobsData?.totalPages || 0;
  const totalRecords = jobsData?.totalRecords || 0;

  console.log("Transformed Jobs:", transformedJobs);
  console.log("Jobs Data:", jobsData);

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
    { id: 'ongoing', label: 'Ongoing Jobs' },
    { id: 'scheduled', label: 'Scheduled Jobs' },
    { id: 'pending', label: 'Pending Jobs' },
    { id: 'completed', label: 'Completed Jobs' },
    { id: 'cancelled', label: 'Cancelled Jobs' }
  ];

  // Loading state
  if (loading) {
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
   const hasError = error && (
    error.message || 
    error.error || 
    (typeof error === 'string' && error.length > 0)
  );
  if (hasError) {
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
              <Button 
                onClick={() => getJob(buildApiFilters())} 
                variant="primary"
                className="inline-flex items-center"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Tabs */}
      <TabNav 
        tabs={tabs} 
        activeTab={activeTab} 
        basePath="/customer/jobs" 
        navClassName="flex flex-wrap items-center justify-between"
      />

      {/* Jobs Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="font-manrope text-xl leading-6 font-semibold text-gray-900">
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </h3>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-[333px]">
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

            <div className="flex gap-4">
              <div className="">
                <Select
                  value={filters.status || 'status'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  options={[
                    { value: 'status', label: 'All Status' },
                    { value: 'posted', label: 'Posted' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                    { value: 'pending', label: 'Pending' }
                  ]}
                  trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
                  className="text-sm rounded-full"
                />
              </div>

              <div className="">
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
                  className="text-sm rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        

        {/* Table or Empty State */}
        {transformedJobs.length > 0 ? (
          <ServiceTable 
            items={transformedJobs} 
            onRowClick={(job) => navigate(`/customer/jobs/${activeTab}/${formatJobSlug(job.id)}`)}
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
      {!loading && transformedJobs.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-600">
          Showing {((filters.pageNumber - 1) * filters.pageSize) + 1} to {Math.min(filters.pageNumber * filters.pageSize, totalRecords)} of {totalRecords} jobs
        </div>
      )}
      {/* Pagination - only show if there are jobs */}
      {transformedJobs.length > 0 && totalPages > 1 && (
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

const mapStoreToProps = (state) => {
  console.log(state);
  return {
    loading: state?.jobs?.loading,
    jobsData: state?.jobs?.data,
    error: state?.jobs?.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getJob: (filters) => dispatch(jobAction(filters)),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(MyJobs);