import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Search, Calendar, Plus, ChevronDown } from 'lucide-react';
import { Select } from '../../components/Form';
import { TextInput } from '../../components/Form';
import Button from '../../components/Button/Button';
import Pagination from '../../components/Pagination';
import TabNav from '../../components/Navigation/TabNav';
import ServiceTable from '../../components/Tables/ServiceTable';

const MyJobs = () => {
  const { tab: activeTab = 'ongoing' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('status');
  const [dateRange, setDateRange] = useState('date-range');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5); // Number of jobs per page
  const [jobs, setJobs] = useState([]);

  // Update current page when URL changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/jobs.json');
        const json = await res.json();
        setJobs(json);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchData();
  }, []);

  // Format job title to URL-friendly slug
  const formatJobSlug = (title) => {
    return title
      .toLowerCase()
      .replaceAll(/\s+/g, '-')
      .replaceAll(/[^\w-]/g, '');
  };

  // Filter jobs based on active tab and search query
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = job.tab.toLowerCase() === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get current jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Update URL with page number in state to maintain tab
    navigate(`/jobs/${activeTab}`, {
      state: { ...location.state, page: pageNumber },
      replace: true
    });
  };

  const tabs = [
    { id: 'ongoing', label: 'Ongoing Jobs' },
    { id: 'scheduled', label: 'Scheduled Jobs' },
    { id: 'pending', label: 'Pending Jobs' },
    { id: 'posted', label: 'Posted Jobs' },
    { id: 'completed', label: 'Completed Jobs' },
    { id: 'cancelled', label: 'Cancelled Jobs' }
  ];

  return (
    <div className="font-inter font-medium">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-manrope text-2xl font-semibold text-gray-900">My Jobs</h1>
          <p className="text-neu-dark-1">View and manage your posted jobs</p>
        </div>
        <Button
          variant="secondary"
          leftIcon={<Plus size={20} />}
          onClick={() => navigate('/post-job/describe')}
        >
          Post a Job
        </Button>
      </div>

      {/* Tabs */}
      <TabNav 
        tabs={tabs} 
        activeTab={activeTab} 
        basePath="/jobs" 
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
                leadingIcon={<Search className="h-5 w-5 text-gray-40" />}
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

        {/* Table */}
        <ServiceTable 
          items={currentJobs} 
          onRowClick={(job) => navigate(`/jobs/${activeTab}/${formatJobSlug(job.title)}`)} 
          activeTab={activeTab} 
          formatItemSlug={formatJobSlug}
        />
      </div>

      <div className="">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredJobs.length / jobsPerPage)}
          totalResults={filteredJobs.length}
          onPageChange={paginate}
          resultsPerPage={jobsPerPage}
        />
      </div>
    </div>
  );
};

export default MyJobs;
