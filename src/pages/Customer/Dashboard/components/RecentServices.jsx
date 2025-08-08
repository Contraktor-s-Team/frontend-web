import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';
import { connect } from 'react-redux';
import { jobAction } from '../../../../redux/Jobs/JobsAction';

import {  Link, useNavigate, useParams } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'AC Installation',
    artisan: 'Musa Ibrahim',
    status: 'Completed',
    date: '6 Jul, 2023',
    time: '1:00 PM',
    image: '/img/avatar1.jpg'
  },
  {
    id: 2,
    title: 'Plumbing Leak Repair',
    artisan: 'Fatima Bello',
    status: 'In Progress',
    date: '12 June 2023',
    time: '1:00 PM',
    image: '/img/avatar2.jpg'
  },
  {
    id: 3,
    title: 'House Cleaning',
    artisan: 'Chinedu Okafor',
    status: 'Completed',
    date: '13 June 2023',
    time: '1:00 PM',
    image: '/img/avatar3.jpg'
  },
  {
    id: 4,
    title: 'Generator Service',
    artisan: 'Ayodele Akinwumi',
    status: 'In Progress',
    date: '14 June 2023',
    time: '1:00 PM',
    image: ''
  }
];



const RecentServices = ({
  services,
  activeTab,
  formatJobSlug,
  // getJob,
  // loading,
  // jobsData,
  // error,
}) => {
  const navigate = useNavigate();
  // const { tab: activeTab = 'posted' } = useParams();
  // const formatJobSlug = (title) => {
  //   return title
  //     .toLowerCase()
  //     .replace(/\s+/g, '-')
  //     .replace(/[^\w-]/g, '');
  // };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric'
  //   });
  // };


  // const transformJobData = (apiJob) => {
  //   return {
  //     id: apiJob.id,
  //     title: apiJob.title.trim(), // Remove any trailing whitespace
  //     description: apiJob.description,
  //     postedAt: formatDate(apiJob.postedAt),
  //     userId: apiJob.userId,
  //     userFullName: apiJob.userFullName || 'Unknown User',
  //     artisanSubcategoryId: apiJob.artisanSubcategoryId,
  //     subcategoryName: apiJob.subcategoryName || 'General',
  //     proposals: apiJob.proposals || [],
  //     proposalCount: apiJob.proposals?.length || 0,
  //     // Add tab classification based on your business logic
  //     tab: determineJobTab(apiJob),
  //     // Add artisan field if needed by your table
  //     artisan: apiJob.userFullName || 'N/A'
  //   };
  // };

  //  const determineJobTab = (job) => {
  //   // This is where you'd implement your business logic
  //   // For now, we'll categorize based on proposals or other criteria
  //   if (job.proposals && job.proposals.length > 0) {
  //     return 'ongoing';
  //   }
  //   return 'posted'; // Default to posted if no proposals
  // };


  // const allJobs = jobsData
  // ? jobsData?.data?.map(transformJobData)
  // : [];

  // useEffect(() => {
  //   getJob();
  // }, []);
  
  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Recent Job Listing</h2>
        <Link to="/customer/jobs/ongoing">
        <Button
          variant="secondary"
          onClick={() => navigate(`/customer/jobs/${activeTab}`)}
          rightIcon={<ChevronRight size={20} />}
          className=""
        >
          View All
        </Button>
        </Link>
      </div>
      {/* {allJobs?.length > 0 ? (
          <ServiceTable 
            items={allJobs} 
            // onRowClick={(job) => navigate(`/customer/jobs/${activeTab}/${formatJobSlug(job.id)}`)}
            activeTab={activeTab}
            formatItemSlug={formatJobSlug}
          />
        ) : (
          <div className="p-6 text-center">
            <div className="text-gray-500">
              <>
                <p>No job found</p>
                <p className="text-sm mt-1">Jobs will appear here when available</p>
              </>
            </div>
          </div>
        )} */}
          <ServiceTable 
            items={services} 
            // onRowClick={(job) => navigate(`/customer/jobs/${activeTab}/${formatJobSlug(job.id)}`)}
            activeTab={activeTab}
            formatItemSlug={formatJobSlug}
          />
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

export default connect(mapStoreToProps, mapDispatchToProps)(RecentServices);