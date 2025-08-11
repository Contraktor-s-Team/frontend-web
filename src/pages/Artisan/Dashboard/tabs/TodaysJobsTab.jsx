import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

const TodaysJobsTab = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/artisan/jobs/today');
  };

  // Get today's date for display
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Today's Jobs</h2>
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs scheduled for today</h3>
        <p className="text-gray-500 mb-2">You don't have any jobs scheduled for {today}.</p>
        <p className="text-sm text-gray-400">Jobs with confirmed start dates will appear here.</p>
      </div>
    </div>
  );
};

export default TodaysJobsTab;
