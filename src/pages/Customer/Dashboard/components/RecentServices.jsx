import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';
import { connect } from 'react-redux';
import { jobAction } from '../../../../redux/Jobs/JobsAction';
import { Link, useParams, useNavigate } from 'react-router-dom';

const RecentServices = ({ getJob, loading, jobsData, error }) => {
  const navigate = useNavigate();

  // DEBUGGING - Let's see what we're getting
  console.log('=== RECENT SERVICES DEBUG ===');
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('jobsData:', jobsData);
  console.log('jobsData type:', typeof jobsData);

  useEffect(() => {
    // Only fetch if we don't have data yet
    if (!jobsData || !jobsData.data || jobsData.data.length === 0) {
      console.log('Fetching jobs...');
      getJob({ pageNumber: 1, pageSize: 5 });
    }
  }, []);

  // Fix the data checking logic
  const isSuccessful = jobsData && jobsData.isSuccess;
  const hasJobsArray = jobsData && jobsData.data && Array.isArray(jobsData.data);
  const jobCount = hasJobsArray ? jobsData.data.length : 0;
  const hasData = isSuccessful && hasJobsArray && jobCount > 0;

  console.log('isSuccessful:', isSuccessful);
  console.log('hasJobsArray:', hasJobsArray);
  console.log('hasData:', hasData);
  console.log('jobCount:', jobCount);

  // Check if there's an actual error (not just empty object)
  const hasError = error && Object.keys(error).length > 0;

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Recent Job Listing</h2>
        <Link to="/customer/jobs/posted">
          <Button variant="secondary" rightIcon={<ChevronRight size={20} />}>
            View All
          </Button>
        </Link>
      </div>

      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        )}

        {hasError && (
          <div className="text-center text-red-500 py-8">
            <p>Error loading jobs: {JSON.stringify(error)}</p>
            <Button onClick={() => getJob({ pageNumber: 1, pageSize: 5 })} variant="secondary" className="mt-2">
              Retry
            </Button>
          </div>
        )}

        {!loading && !hasError && !hasData && isSuccessful && (
          <div className="text-center text-gray-500 py-8">
            <p>No recent jobs found</p>
            <p className="text-sm mt-1">Jobs you post will appear here</p>
          </div>
        )}

        {!loading && !hasError && hasData && (
          <div>
            {/* Use ServiceTable to display the jobs */}
            <ServiceTable
              items={jobsData.data}
              onRowClick={(job) => {
                console.log('Job clicked:', job);
                navigate(`/customer/jobs/${job.id}/${job.id}`);
              }}
              showLocation={false}
              containerClassName=""
            />
          </div>
        )}

        {!loading && !hasError && !isSuccessful && (
          <div className="text-center text-orange-500 py-8">
            <p>Unexpected response format</p>
            <details className="mt-2">
              <summary className="cursor-pointer">Show details</summary>
              <pre className="text-xs mt-2 bg-gray-50 p-2 rounded">{JSON.stringify(jobsData, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStoreToProps = (state) => {


  return {
    loading: state?.jobs?.loading || false,
    jobsData: state?.jobs?.data || null,
    error: state?.jobs?.error || {}
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getJob: (filters = {}) => {
      console.log('Dispatching jobAction with filters:', filters);
      return dispatch(jobAction(filters));
    }
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(RecentServices);
