import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('status');
  const [dateRange, setDateRange] = useState('date-range');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);

  // Update current page when URL changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    getJob();
  }, []);

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
      title: apiJob.title.trim(), // Remove any trailing whitespace
      description: apiJob.description,
      postedAt: formatDate(apiJob.postedAt),
      userId: apiJob.userId,
      userFullName: apiJob.userFullName || 'Unknown User',
      artisanSubcategoryId: apiJob.artisanSubcategoryId,
      subcategoryName: apiJob.subcategoryName || 'General',
      proposals: apiJob.proposals || [],
      proposalCount: apiJob.proposals?.length || 0,
      // Add tab classification based on your business logic
      tab: determineJobTab(apiJob),
      // Add artisan field if needed by your table
      artisan: apiJob.userFullName || 'N/A'
    };
  };

  // Determine which tab a job belongs to based on its properties
  const determineJobTab = (job) => {
    // This is where you'd implement your business logic
    // For now, we'll categorize based on proposals or other criteria
    if (job.proposals && job.proposals.length > 0) {
      return 'ongoing';
    }
    return 'posted'; // Default to posted if no proposals
  };

  // Get jobs from Redux store or fallback to empty array
  const allJobs = jobsData
    ? jobsData?.data?.map(transformJobData)
    : [];

  console.log("All Jobs:", allJobs);
  // Filter jobs based on active tab and search query
  const filteredJobs = allJobs?.filter((job) => {
    const matchesCategory = job.tab.toLowerCase() === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs?.slice(indexOfFirstJob, indexOfLastJob);

  console.log("Current Jobs:", currentJobs);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  // // Error state
  // if (error) {
  //   return (
  //     <div className="space-y-6">
  //       <PageHeader
  //         title="My Jobs"
  //         subtitle="Manage your posted jobs and track their progress"
  //         buttonText="Post a Job"
  //         buttonVariant="secondary"
  //         buttonHref="/customer/post-job/describe"
  //         buttonIcon={<Plus size={18} />}
  //       />

  //       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
  //         <div className="p-6 text-center">
  //           <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
  //           <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Jobs</h3>
  //           <p className="mt-1 text-sm text-gray-500">
  //             {error.message || 'There was an error loading your jobs. Please try again.'}
  //           </p>
  //           <div className="mt-6">
  //             <Button 
  //               onClick={() => getJob()} 
  //               variant="primary"
  //               className="inline-flex items-center"
  //             >
  //               Try Again
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'status', label: 'Status' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ]}
                  trailingIcon={<ChevronDown className="h-5 w-5 text-gray-400" />}
                  className="text-sm rounded-full"
                />
              </div>

              <div className="">
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  options={[
                    { value: 'date-range', label: 'Date Range' },
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
        {allJobs?.length > 0 ? (
          <ServiceTable 
            items={allJobs} 
            onRowClick={(job) => navigate(`/customer/jobs/${activeTab}/${formatJobSlug(job.id)}`)}
            activeTab={activeTab} 
            formatItemSlug={formatJobSlug}
          />
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-500">
              {searchQuery ? (
                <>
                  <p>No jobs found matching "{searchQuery}"</p>
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

      {/* Pagination - only show if there are jobs */}
      {filteredJobs?.length > 0 && (
        <div className="">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredJobs.length / jobsPerPage)}
            totalResults={filteredJobs.length}
            onPageChange={paginate}
            resultsPerPage={jobsPerPage}
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
    getJob: () => dispatch(jobAction()),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(MyJobs);