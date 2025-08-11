import React from 'react';
import { Calendar, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';

const JobCard = ({ job, activeTab }) => {
  const {
    subcategoryName,
    title,
    description,
    customer,
    postedAt,
    // Negotiation-related props
    canAccept,
    hasNegotiation,
    senderId,
    currentUserId,
    negotiations = []
  } = job;

  const isRequest = activeTab === 'proposal-sent';

  // Check if the current user is the sender (artisan) of the proposal
  const isCurrentUserSender = senderId === currentUserId;

  // Render negotiation buttons based on conditions
  const renderNegotiationButtons = () => {
    if (!isRequest) return null;

    // If user is the sender (artisan), they can only view status (no actions)
    if (isCurrentUserSender) {
      // Determine the status based on negotiations
      let statusText = 'Proposal Sent';
      let statusClass = 'bg-blue-100 text-blue-700';

      if (hasNegotiation && negotiations.length > 0) {
        const latestNegotiation = negotiations[0];
        if (latestNegotiation.status === 'accepted') {
          statusText = 'Proposal Accepted';
          statusClass = 'bg-green-100 text-green-700';
        } else if (latestNegotiation.status === 'rejected') {
          statusText = 'Proposal Rejected';
          statusClass = 'bg-red-100 text-red-700';
        } else {
          statusText = 'Awaiting Response';
          statusClass = 'bg-yellow-100 text-yellow-700';
        }
      }

      return (
        <div className="flex justify-center">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusClass}`}>{statusText}</div>
        </div>
      );
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

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 hover:border-blue-200">
      {/* Clickable area for navigation - FIXED URL */}
      <Link
        to={`/artisan/find-jobs/${activeTab}/${job.id}`}
        className="block"
        onClick={() => {
          console.log('🔗 JobCard: Navigating to job with ID:', job.id);
          console.log('🔗 JobCard: Job object:', job);
          console.log('🔗 JobCard: Generated URL:', `/artisan/find-jobs/${activeTab}/${job.id}`);
        }}
      >
        {/* Main content */}
        <div className="">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-gray-100 px-3.5 py-2 rounded-full flex items-center gap-2">
              <Zap size={16} />
              <span className="text-gray-600 font-medium text-sm">{subcategoryName}</span>
            </div>
            {/* Show negotiation indicator */}
            {isRequest && hasNegotiation && (
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Negotiating</div>
            )}
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
            {isRequest && (
              <p className="text-gray-600 text-xs">{isCurrentUserSender ? 'Your proposal' : 'Proposal received'}</p>
            )}
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
      </Link>

      {/* Action buttons - outside the Link to prevent navigation conflicts */}
      <div className="mt-6.5">
        <div className="flex gap-2">
          {isRequest ? (
            renderNegotiationButtons()
          ) : (
            <div className="">
              <Button variant="primary" className="px-4.25 py-2">
                Apply
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
