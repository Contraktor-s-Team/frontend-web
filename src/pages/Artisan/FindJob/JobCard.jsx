import React from 'react';
import { Calendar, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';

function JobCard({ job, activeTab }) {
  if (!job) return null;

  const { 
    category, 
    title, 
    description, 
    customer, 
    dateTime,  
  } = job;

  const isRequest = activeTab === 'requests';

  return (
    <Link 
      to={`/artisan/find-jobs/${activeTab}/${job.id}`}
      className="block bg-white rounded-lg p-4 shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 hover:border-blue-200"
    >
      {/* Main content */}
      <div className="">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-gray-100 px-3.5 py-2 rounded-full flex items-center gap-2">
            <Zap size={16} />
            <span className="text-gray-600 font-medium text-sm">{category}</span>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" title={title}>
          {title}
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2" title={description}>
          {description}
        </p>
      </div>

      {/* Profile section */}
      <div className="px-4 py-4 border-y-2 border-gray-200 flex items-center gap-3 my-5.25">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
          {customer.name.split(' ')[0][0] + customer.name.split(' ')[1][0]}
        </div>
        <div>
          <p className="text-gray-900 text-sm font-medium">{customer.name}</p>
        </div>
      </div>

      {/* Location and date info */}
      <div className="text-sm text-gray-700 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-500" size={16}/>
          <span>{customer.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className=" text-blue-500" size={16}/>
          <span>{dateTime}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6.5">
        <div className="flex gap-2">
          {isRequest ? (
            <>
              <button className="flex-1 py-2 px-4 bg-success-norm-1 text-white text-sm font-medium rounded-full hover:bg-success-norm-2">
                Accept
              </button>
              <button className="flex-1 py-2 px-4 border border-err-dark-1 text-err-dark-1 text-sm font-medium rounded-full hover:border-err-norm-1 hover:text-err-norm-1">
                Reject
              </button>
            </>
          ) : (
            <div className="">
              <Button variant="primary" className="px-4.25 py-2">Apply</Button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default JobCard;