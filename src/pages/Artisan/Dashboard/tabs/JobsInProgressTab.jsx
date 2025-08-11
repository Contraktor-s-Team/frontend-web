import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

const JobsInProgressTab = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/artisan/jobs/in-progress');
  };

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Jobs In Progress</h2>
        <Button variant="secondary" onClick={handleViewAll} rightIcon={<ChevronRight size={20} />} className="">
          View All
        </Button>
      </div>

      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6l4 2m6-6a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs in progress</h3>
        <p className="text-gray-500">
          You don't have any jobs currently in progress. Start working on accepted proposals to see them here.
        </p>
      </div>
    </div>
  );
};

export default JobsInProgressTab;
