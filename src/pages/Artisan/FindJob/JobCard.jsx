import React from 'react';
import { Calendar, MapPin, Zap, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';

const JobCard = ({ job, activeTab, userAppliedJobs = [] }) => {
  const {
    subcategoryName,
    title,
    description,
    customer,
    postedAt,
    id,
    // Negotiation-related props
    canAccept,
    hasNegotiation,
    senderId,
    currentUserId,
    negotiations = []
  } = job;

  const isRequest = activeTab === 'requests';
  
  // Check if user has already applied to this job
  const hasUserApplied = userAppliedJobs.includes(id);
  
  // Check if the current user is the sender (artisan) of the proposal
  const isCurrentUserSender = senderId === currentUserId;

  // Render negotiation buttons based on conditions
  const renderNegotiationButtons = () => {
    if (!isRequest) return null;

    console.log(job);

    // If user is the sender (artisan), they cannot accept their own proposal
    if (isCurrentUserSender) {
      if (hasNegotiation) {
        return (
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-4 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600">
              Renegotiate
            </button>
            <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:border-gray-400">
              View Details
            </button>
          </div>
        );
      } else {
        return (
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:border-gray-400">
              View Status
            </button>
          </div>
        );
      }
    }

    // If user is not the sender (they can accept/reject)
    if (hasNegotiation) {
      return (
        <div className="flex gap-2">
          <button className="flex-1 py-2 px-4 bg-success-norm-1 text-white text-sm font-medium rounded-full hover:bg-success-norm-2">
            Accept
          </button>
          <button className="flex-1 py-2 px-4 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600">
            Renegotiate
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-2">
          <button className="flex-1 py-2 px-4 bg-success-norm-1 text-white text-sm font-medium rounded-full hover:bg-success-norm-2">
            Accept
          </button>
          <button className="flex-1 py-2 px-4 border border-err-dark-1 text-err-dark-1 text-sm font-medium rounded-full hover:border-err-norm-1 hover:text-err-norm-1">
            Reject
          </button>
        </div>
      );
    }
  };

  // Render the card content
  const cardContent = (
    <div className={`block bg-white rounded-lg p-4 border border-gray-200 overflow-hidden transition-all duration-200 ${
      hasUserApplied && !isRequest
        ? 'opacity-60 cursor-not-allowed border-gray-300 bg-gray-50'
        : 'hover:shadow-md hover:border-blue-200'
    }`}>
      {/* Main content */}
      <div className="">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-gray-100 px-3.5 py-2 rounded-full flex items-center gap-2">
            <Zap size={16} />
            <span className="text-gray-600 font-medium text-sm">{subcategoryName}</span>
          </div>
          {/* Show applied indicator for job listings */}
          {!isRequest && hasUserApplied && (
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Check size={12} />
              Applied
            </div>
          )}
          {/* Show negotiation indicator for requests */}
          {isRequest && hasNegotiation && (
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Negotiating</div>
          )}
        </div>
        <h2 className={`text-lg font-semibold mb-2 line-clamp-2 ${
          hasUserApplied && !isRequest ? 'text-gray-500' : 'text-gray-900'
        }`} title={title}>
          {title}
        </h2>
        <p className={`text-sm leading-relaxed line-clamp-2 h-[50px] ${
          hasUserApplied && !isRequest ? 'text-gray-400' : 'text-gray-700'
        }`} title={description}>
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
          <p className={`text-sm font-medium ${
            hasUserApplied && !isRequest ? 'text-gray-400' : 'text-gray-900'
          }`}>
            {customer?.name ? customer?.name : 'Customer Details Unavailable'}
          </p>
          {isRequest && (
            <p className="text-gray-600 text-xs">{isCurrentUserSender ? 'Your proposal' : 'Proposal received'}</p>
          )}
        </div>
      </div>

      {/* Location and date info */}
      <div className={`text-sm space-y-4 ${
        hasUserApplied && !isRequest ? 'text-gray-400' : 'text-gray-700'
      }`}>
        <div className="flex items-center gap-2">
          <MapPin className={hasUserApplied && !isRequest ? 'text-gray-400' : 'text-blue-500'} size={16} />
          <span>{customer?.location ? customer?.location : 'Location Unavailable'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className={hasUserApplied && !isRequest ? 'text-gray-400' : 'text-blue-500'} size={16} />
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

      {/* Show negotiation count and latest price */}
      {isRequest && negotiations.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Latest offer:</span>
            <span className="font-semibold text-gray-900">₦{negotiations[0]?.proposedPrice?.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {negotiations.length} negotiation{negotiations.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6.5">
        <div className="flex gap-2">
          {isRequest ? (
            renderNegotiationButtons()
          ) : (
            <div className="">
              {hasUserApplied ? (
                <Button 
                  variant="grey-sec" 
                  className="px-4.25 py-2 cursor-not-allowed opacity-50"
                  disabled
                >
                  <Check size={16} className="mr-2" />
                  Applied
                </Button>
              ) : (
                <Button variant="primary" className="px-4.25 py-2">
                  Apply
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // For job listings, conditionally wrap with Link only if user hasn't applied
  if (!isRequest) {
    if (hasUserApplied) {
      // Return non-clickable card
      return cardContent;
    } else {
      // Return clickable card
      return (
        <Link to={`/artisan/find-jobs/${activeTab}/${job.id}`}>
          {cardContent}
        </Link>
      );
    }
  }

  // For requests, always wrap with Link (existing behavior)
  return (
    <Link to={`/artisan/find-jobs/${activeTab}/${job.id}`}>
      {cardContent}
    </Link>
  );
};

export default JobCard;