import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Calendar, Plus, ChevronDown, AlertCircle } from 'lucide-react';
import { Select, TextInput } from '../../../components/Form';
import Button from '../../../components/Button/Button';
import Pagination from '../../../components/Pagination';
import TabNav from '../../../components/Navigation/TabNav';
import ServiceTable from '../../../components/Tables/ServiceTable';
import PageHeader from '../../../components/PageHeader/PageHeader';

const MyJobs = () => {
  const { tab: activeTab = 'newRequests' } = useParams();
  const navigate = useNavigate();

  const [allJobs, setAllJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('status');
  const [dateRange, setDateRange] = useState('date-range');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);

  // Update current page when URL changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // // Format job title to URL-friendly slug
  const formatJobSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/artisan-jobs.json');
        const data = await response.json();
        setAllJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on active tab, search query, status, and date
  const filteredJobs = allJobs?.filter((job) => {
    const matchesCategory = job.tab === activeTab;
    
    const matchesSearch =
      searchQuery === '' ||
      (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.customer && job.customer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'status' || 
      (job.status && job.status.toLowerCase() === statusFilter.toLowerCase());
    
    const matchesDate = dateRange === 'date-range' || filterByDateRange(job.postedAt, dateRange);
    
    return matchesCategory && matchesSearch && matchesStatus && matchesDate;
  });

  // Helper function for date filtering
  const filterByDateRange = (dateString, range) => {
    if (!dateString) return true;
    
    const jobDate = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return jobDate >= today;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return jobDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return jobDate >= monthAgo;
      default:
        return true;
    }
  };

  // console.log('Active Tab:', activeTab);
  // console.log('All Jobs:', allJobs);
  // console.log('Filtered Jobs:', filteredJobs);
  // console.log('Current Jobs:', currentJobs);

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs?.slice(indexOfFirstJob, indexOfLastJob) || [];
  const totalFilteredJobs = filteredJobs?.length || 0;


  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const tabs = [
    { id: 'newRequests', label: 'New Requests' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  // Loading state
  // if (loading) {
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

  //       <TabNav
  //         tabs={tabs}
  //         activeTab={activeTab}
  //         basePath="/customer/jobs"
  //         navClassName="flex flex-wrap items-center justify-between"
  //       />

  //       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
  //         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
  //           <h3 className="font-manrope text-xl leading-6 font-semibold text-gray-900">
  //             {tabs.find((tab) => tab.id === activeTab)?.label}
  //           </h3>
  //         </div>

  //         {/* Loading skeleton */}
  //         <div className="p-6">
  //           <div className="animate-pulse">
  //             <div className="flex space-x-4 mb-4">
  //               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //             </div>
  //             {[...Array(5)].map((_, i) => (
  //               <div key={i} className="flex space-x-4 mb-3">
  //                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <PageHeader title="My Jobs" subtitle="Manage your posted jobs and track their progress" />

      {/* Tabs */}
      <TabNav
        tabs={tabs}
        activeTab={activeTab}
        basePath="/artisan/my-jobs"
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
          <>

            <ServiceTable
              items={currentJobs}
              onRowClick={(job) => navigate(`/artisan/my-jobs/${activeTab}/${formatJobSlug(job.title)}`)}
              activeTab={activeTab}
              formatItemSlug={formatJobSlug}
              showLocation={activeTab === 'newRequests'}
            />
          </>
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
      {filteredJobs?.length > jobsPerPage && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalFilteredJobs / jobsPerPage) || 1}
            totalResults={totalFilteredJobs}
            resultsPerPage={jobsPerPage}
            onPageChange={paginate}
          />
        </div>
      )}
    </div>
  );
};

export default MyJobs;
