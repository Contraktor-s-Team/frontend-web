import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';
import { useJobListings } from '../../../../contexts/JobListingContext';
import { Link, useParams, useNavigate } from 'react-router-dom';

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

const RecentServices = ({ activeTab }) => {
  const { tab: routeTab = 'posted' } = useParams();
  const navigate = useNavigate();
  const { fetchJobListings, state: jobListingState } = useJobListings();
  const loading = jobListingState.jobListings.loading;
  const jobListingData = jobListingState.jobListings.data;
  const error = jobListingState.jobListings.error;

  // Use activeTab prop if provided, otherwise fall back to route tab
  const currentTab = activeTab || routeTab;
  const formatJobSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const transformJobListingData = (apiJobListing) => {
    return {
      id: apiJobListing.id,
      title: apiJobListing.title.trim(), // Remove any trailing whitespace
      description: apiJobListing.description,
      postedAt: formatDate(apiJobListing.postedAt),
      userId: apiJobListing.userId,
      userFullName: apiJobListing.userFullName || 'Unknown User',
      artisanSubcategoryId: apiJobListing.artisanSubcategoryId,
      subcategoryName: apiJobListing.subcategoryName || 'General',
      proposals: apiJobListing.proposals || [],
      proposalCount: apiJobListing.proposals?.length || 0,
      // Add tab classification based on your business logic
      tab: determineJobListingTab(apiJobListing),
      // Add artisan field if needed by your table
      artisan: apiJobListing.userFullName || 'N/A'
    };
  };

  const determineJobListingTab = (jobListing) => {
    // Determine job listing tab based on status and proposals
    if (jobListing.status === 'completed' || jobListing.status === 'Completed') {
      return 'completed';
    }
    if (jobListing.status === 'in-progress' || jobListing.status === 'In Progress' || jobListing.status === 'ongoing') {
      return 'ongoing';
    }
    if (jobListing.proposals && jobListing.proposals.length > 0) {
      // Has proposals but not completed/ongoing, consider it ongoing
      return 'ongoing';
    }
    return 'posted'; // Default to posted if no proposals
  };

  const allJobListings = jobListingData?.data ? jobListingData.data.map(transformJobListingData) : [];

  // Filter job listings by current tab and limit to 5 for dashboard display
  const filteredJobListings = allJobListings
    ? allJobListings.filter((jobListing) => jobListing.tab === currentTab).slice(0, 5)
    : [];

  useEffect(() => {
    fetchJobListings();
  }, [fetchJobListings]);

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Recent Job Listing</h2>
        <Link to="/customer/jobs/posted">
          <Button variant="secondary" to="/services" rightIcon={<ChevronRight size={20} />} className="">
            View All
          </Button>
        </Link>
      </div>
      {filteredJobListings?.length > 0 ? (
        <ServiceTable
          items={filteredJobListings}
          onRowClick={(jobListing) => navigate(`/customer/jobs/${currentTab}/${jobListing.id}`)}
          activeTab={currentTab}
          formatItemSlug={formatJobSlug}
        />
      ) : (
        <div className="p-6 text-center">
          <div className="text-gray-500">
            {loading ? (
              <>
                <p>Loading job listings...</p>
              </>
            ) : (
              <>
                <p>No {currentTab} job listings found</p>
                <p className="text-sm mt-1">Job listings will appear here when available</p>
              </>
            )}
          </div>
        </div>
      )}
      {/* <ServiceTable items={services} /> */}
    </div>
  );
};

export default RecentServices;
