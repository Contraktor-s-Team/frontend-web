// import React from 'react';
// import { ChevronRight } from 'lucide-react';
// import Button from '../../../../components/Button/Button';
// import ServiceTable from '../../../../components/Tables/ServiceTable';

// const NewJobRequests = ({services, activeTab, formatJobSlug}) => {
//   return (
//     <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
//       <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
//         <h2 className="font-manrope text-xl font-semibold text-gray-900">New Job Requests</h2>
//         <Button
//           variant="secondary"
//           to="/services"
//           rightIcon={<ChevronRight size={20} />}
//           className=""
//         >
//           View All
//         </Button>
//       </div>
      
//       <ServiceTable 
//           items={services} 
//           activeTab={activeTab} 
//           formatItemSlug={formatJobSlug}
//         />
//     </div>
//   );
// };

// export default NewJobRequests;
import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';
import { useNavigate } from 'react-router-dom';

const NewJobRequests = ({ services, activeTab, formatJobSlug, isProposalsTab, proposalLoading }) => {
  
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'new':
        return 'New Job Requests';
      case 'in-progress':
        return 'Jobs In Progress';
      case 'today':
        return "Today's Jobs";
      case 'proposals':
        return 'Proposal Sent';
      default:
        return 'Job Requests';
    }
  };
  const navigate = useNavigate()
  const handlenav = ()=>{
    navigate("/artisan/find-jobs/listings")
  }
  const getViewAllPath = () => {
    switch (activeTab) {
      case 'proposals':
        return '/artisan/find-jobs/requests';
      default:
        return '/services';
    }
  };

  const renderContent = () => {
    // Show loading state for proposals tab
    if (isProposalsTab && proposalLoading) {
      return (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading proposals...</p>
        </div>
      );
    }

    // Show data in table format for all tabs
    if (services.length > 0) {
      return (
        <ServiceTable 
          items={services} 
          activeTab={activeTab} 
          formatItemSlug={formatJobSlug}
          isProposalsTab={isProposalsTab}
          handlenav={handlenav}
        />
      );
    }

    // Empty state
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No {isProposalsTab ? 'proposals' : 'jobs'} available
        </h3>
        <p className="text-gray-500">
          {isProposalsTab 
            ? 'You haven\'t sent any proposals yet. Browse available jobs to get started.' 
            : 'There are currently no jobs available in this category. Please check back later.'}
        </p>
        {isProposalsTab && (
          <Button
            variant="primary"
            to="/artisan/find-jobs"
            className="mt-4"
          >
            Browse Jobs
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">
          {getHeaderTitle()}
        </h2>
        <Button
          variant="secondary"
          to={getViewAllPath()}
          rightIcon={<ChevronRight size={20} />}
          className=""
          onClick={handlenav}
        >
          View All
        </Button>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default NewJobRequests;