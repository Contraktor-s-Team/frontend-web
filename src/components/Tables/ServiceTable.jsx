import React from 'react';
import { MoreVertical, Clock } from 'lucide-react';
import { getColorFromString } from '../../utils/colors';
import { FaHourglassHalf } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';
import { BsCircleFill } from 'react-icons/bs';

export const StatusBadge = ({ status, isArtisanRoute }) => {
  let statusText = status;

  if (typeof status === 'number') {
    const statusMap = {
      0: 'Pending',
      1: 'Accepted',
      2: 'Rejected',
      3: 'In Progress',
      4: 'Completed',
      5: 'Cancelled'
    };
    statusText = statusMap[status] || 'Unknown';
  }

  if (statusText === 'Completed' || statusText === 'Accepted') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-success-light-1 text-success-dark-1">
        {statusText}
      </div>
    );
  }

  if (statusText === 'Cancelled' || statusText === 'Rejected') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-err-light-1 text-err-dark-1">
        {statusText}
      </div>
    );
  }

  if (statusText === 'Pending') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-warning-light-1 text-warning-dark-1">
        <FaHourglassHalf className="text-warning-dark-1" size={16} />
        {statusText}
      </div>
    );
  }

  if (statusText === 'Quotes Received') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-pri-light-1 text-pri-dark-1">
        <BsCircleFill className="text-pri-norm-1" size={16} />
        {statusText}
      </div>
    );
  }

  if (statusText === 'Awaiting Quotes') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-warning-light-1 text-warning-dark-1">
        <BsCircleFill className="text-warning-norm-1" size={16} />
        {statusText}
      </div>
    );
  }

  if (statusText === 'Scheduled') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-pri-light-1 text-pri-dark-1">
        <HiOutlineCalendar className="text-pri-norm-1" size={16} />
        {statusText}
      </div>
    );
  }

  if (statusText === 'In Progress') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-warning-light-1 text-warning-dark-1">
        {statusText}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-neu-light-1 text-neu-dark-1">
      {isArtisanRoute ? 'New Request' : 'New Listing'}
    </div>
  );
};

const ServiceTable = ({
  items = [],
  onRowClick,
  activeTab,
  formatItemSlug = (title) => title,
  actionButton,
  containerClassName = '',
  showLocation = false,
  handlenav
}) => {
  const isArtisanRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/artisan');
  const isMyJobs = typeof window !== 'undefined' && window.location.pathname.includes('/my-jobs');

  return (
    <div className={`w-full overflow-x-auto font-inter font-medium ${containerClassName}`}>
      <table
        className="min-w-[600px] sm:min-w-full divide-y divide-neu-light-1 text-xs sm:text-sm"
        style={{ tableLayout: 'auto' }}
      >
        <thead className="bg-neu-light-1">
          <tr className="h-10 sm:h-12">
            <th
              scope="col"
              className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
            >
              {isMyJobs ? 'Job Title' : 'Service'}
            </th>
            <th
              scope="col"
              className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
            >
              {isArtisanRoute ? 'Customer' : 'Artisan'}
            </th>
            <th
              scope="col"
              className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
            >
              Status
            </th>
            {/* {!showLocation && (
              <th
                scope="col"
                className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
              >
                Status
              </th>
            )} */}
            {/* {showLocation && (
              <th
                scope="col"
                className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
              >
                Location
              </th>
            )} */}
            {/* {isArtisanRoute && (
              <th
                scope="col"
                className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
              >
                Proposed Price
              </th>
            )} */}
            <th
              scope="col"
              className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
            >
              Date & Time
            </th>
            <th scope="col" className="relative px-2 sm:px-4 py-0">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item) => {
            const title = item.title || item.service || item.subcategoryName || 'Service unavailable';
            const customerName = typeof item.customer === 'string' 
              ? item.customer 
              : item.customer?.name || item.customer?.firstName || 'Customer unavailable';
            const artisanName = item.artisan
              ? `${item.artisan.firstName || ''} ${item.artisan.lastName || ''}`.trim() ||
                item.artisan.email ||
                'Artisan unavailable'
              : 'Artisan unavailable';
            const status = item.status !== undefined ? item.status : item.proposalStatus;
            const imageUrl = item.imageUrls?.[0] || item.image || item.customerImage;
            const location =
              item.customer?.location ||
              item.jobDetails?.jobLocation?.address ||
              item.address ||
              'Location unavailable';

            return (
              <tr
                key={item.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => (onRowClick ? onRowClick(item) : null)}
              >
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-900">{title}</div>
                  {item.description && item.description !== 'Description unavailable' && (
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</div>
                  )}
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          className="h-full w-full object-cover"
                          src={imageUrl}
                          alt={isArtisanRoute ? customerName : artisanName}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div
                          className={`h-full w-full flex items-center justify-center font-medium text-white text-xs ${getColorFromString(
                            isArtisanRoute ? customerName : artisanName
                          )}`}
                        >
                          {/* {isArtisanRoute
                            ? customerName?.charAt(0)?.toUpperCase() || 'C'
                            : artisanName?.charAt(0)?.toUpperCase() || 'A'} */}
                        </div>
                      )}
                    </div>
                    <div className="">
                      <div className="font-medium text-gray-900 text-xs sm:text-sm">
                        {isArtisanRoute ? customerName : artisanName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={status} isArtisanRoute={isArtisanRoute} />
                </td>

                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <div className="text-gray-900">
                    {item.postedAt || item.submittedAt
                      ? new Date(item.postedAt || item.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : item.date || 'N/A'}
                  </div>
                  <div className="text-xs text-neu-dark-1">
                    {item.postedAt || item.submittedAt
                      ? new Date(item.postedAt || item.submittedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })
                      : item.time || 'N/A'}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    {actionButton ? (
                      actionButton(item)
                    ) : (
                      <button
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full border border-gray-200 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
