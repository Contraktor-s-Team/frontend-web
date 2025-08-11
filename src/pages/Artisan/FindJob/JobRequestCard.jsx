import React from 'react';
import { Calendar, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';

const JobRequestCard = ({ job, activeTab }) => {
  const { subcategoryName, title, description, customer, postedAt } = job;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 hover:border-blue-200">
      {/* Clickable area for navigation */}
      <Link
        to={`/artisan/find-jobs/${activeTab}/${job.id}`}
        className="block"
        onClick={() => {
          console.log('🔗 JobRequestCard: Navigating to job with ID:', job.id);
          console.log('🔗 JobRequestCard: Job object:', job);
          console.log('🔗 JobRequestCard: Generated URL:', `/artisan/find-jobs/${activeTab}/${job.id}`);
        }}
      >
        {/* Main content */}
        <div className="">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gray-100 px-3.5 py-2 rounded-full flex items-center gap-2">
              <Zap size={16} />
              <span className="text-gray-600 font-medium text-sm">{subcategoryName}</span>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" title={title}>
            {title}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 h-[50px]" title={description}>
            {description}
          </p>
        </div>

        {/* Profile section */}
        <div className="px-4 py-4 border-y-2 border-gray-200 flex items-center gap-3 my-5.25">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
            {customer?.name && customer.name.split(' ').length >= 2
              ? customer.name.split(' ')[0][0] + customer.name.split(' ')[1][0]
              : customer?.name
              ? customer.name[0]
              : 'C'}
          </div>
          <div>
            <p className="text-gray-900 text-sm font-medium">
              {customer?.name ? customer?.name : 'Customer Details Unavailable'}
            </p>
          </div>
        </div>

        {/* Location and date info */}
        <div className="text-sm text-gray-700 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-500" size={16} />
            <span>{customer?.location ? customer?.location : 'Location Unavailable'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className=" text-blue-500" size={16} />
            <span>
              {new Date(postedAt).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </span>
          </div>
        </div>
      </Link>

      {/* Action buttons - outside the Link to prevent navigation conflicts */}
      <div className="mt-6.5">
        <div className="flex gap-2">
          <Button variant="primary" className="px-4.25 py-2">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobRequestCard;
