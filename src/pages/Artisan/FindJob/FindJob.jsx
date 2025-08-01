import React, { useState, useEffect, use } from 'react';
import PageHeader from '../../../components/PageHeader/PageHeader';
import SearchFilters from './searchFilters';
import TabNav from '../../../components/Navigation/TabNav';
import { useParams } from 'react-router-dom';
import { artisanJobAction } from '../../../redux/Jobs/JobsAction';
import { connect } from 'react-redux';
// import JobCard from './jobCard';
// import JobCard from './jobCard';

const FindJob = ({
  getJob,
  jobLoading,
  jobsData,
  jobError,
  id
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [datePostedFilter, setDatePostedFilter] = useState('');
  const [dateNeededFilter, setDateNeededFilter] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { tab: activeTab = 'listings' } = useParams();
  
  const tabs = [
    { id: 'listings', label: 'Job Listings' },
    { id: 'requests', label: 'Direct Job Requests' },
  ];
   // Fetch jobs data
  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch('/jobScenarios.json');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch jobs');
  //       }
  //       const data = await response.json();
  //       setJobs(data);
  //       setFilteredJobs(data); // Initially show all jobs
  //     } catch (err) {
  //       setError(err.message);
  //       console.error('Error fetching jobs:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchJobs();
  // }, []);
  useEffect(() => {
    if (jobsData && jobsData.length > 0) {
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      setLoading(false);
    }
  }, [jobsData]);
  useEffect(()=>{
    if (id) {
      getJob(id);
    }
  }, [id, getJob]);
  // Filter jobs based on search and filters
  useEffect(() => {
    let result = [...jobs];

    // Filter by tab (listings or requests)
    result = result.filter(job => 
      activeTab === 'requests' 
        ? job.status === 'direct' 
        : job.status === 'posted' || job.status === 'urgent'
    );

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
        job.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply location filter
    if (locationFilter) {
      result = result.filter(job => 
        job.customer.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, [jobs, activeTab, searchQuery, categoryFilter, locationFilter]);

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
              {jobLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Loading jobs...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p>Error loading jobs: {error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id} 
                      job={job} 
                      activeTab={activeTab} 
                    />
                  ))} */}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
                  <p className="text-gray-500">
                    {searchQuery || categoryFilter || locationFilter 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'There are currently no jobs available. Please check back later.'}
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
    jobLoading: state?.jobs?.loading,
    jobsData: state?.jobs?.data,
    error: state?.jobs?.error,
    id:state?.userEmail?.data?.data?.id
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getJob: (id) => dispatch(artisanJobAction(id)),
  };
};
export default connect(mapStoreToProps, mapDispatchToProps)(FindJob);