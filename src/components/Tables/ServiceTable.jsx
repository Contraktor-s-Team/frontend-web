import { MoreVertical } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const StatusBadge = ({ isArtisanRoute, proposal, activeTab }) => {
  if (activeTab === 'posted') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-neu-light-1 text-neu-dark-1">
        {isArtisanRoute ? 'New Request' : `${proposal.proposalCount || 0} Proposals Received`}
      </div>
    );
  } else if (activeTab === 'in-progress') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-blue-100 text-blue-800">
        In Progress
      </div>
    );
  } else if (activeTab === 'completed') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-green-100 text-green-800">
        Completed
      </div>
    );
  } else if (activeTab === 'canceled') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-red-100 text-red-800">
        Cancelled
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-gray-100 text-gray-800">
      Unknown Status
    </div>
  );
};

const ServiceTable = ({
  items = [],
  onRowClick,
  actionButton,
  containerClassName = '',
  showLocation = false,
  activeTab = 'posted'
}) => {
  // Use React Router's useLocation hook properly
  const location = useLocation();

  // Determine if this is for new job requests
  const isArtisanRoute = location.pathname.startsWith('/artisan');
  const isMyJobs = location.pathname.includes('/my-jobs') || location.pathname.includes('/jobs');

  // Determine column header based on tab
  const getStatusColumnHeader = () => {
    if (activeTab === 'posted') {
      return 'Proposals Received';
    } else {
      return 'Status';
    }
  };

  // Get artisan name for ongoing/completed/cancelled jobs
  const getArtisanName = (item) => {
    if (activeTab === 'posted') {
      return null; // Posted jobs don't have assigned artisans
    }
    return item.artisanFullName || item.artisan || 'Unknown Artisan';
  };

  return (
    <div className={`w-full overflow-x-auto font-inter font-medium ${containerClassName}`}>
      <table className="min-w-[600px] sm:min-w-full divide-y divide-neu-light-1 text-xs sm:text-sm">
        <thead>
          <tr className="h-10 sm:h-12">
            <th
              scope="col"
              className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
            >
              {isMyJobs ? 'Job Title' : 'Service'}
            </th>

            {['in-progress', 'completed', 'canceled'].includes(activeTab) && (
              <th
                scope="col"
                className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
              >
                Artisan
              </th>
            )}

            {!showLocation && (
              <th
                scope="col"
                className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
              >
                {getStatusColumnHeader()}
              </th>
            )}
            {showLocation && (
              <th
                scope="col"
                className="px-2 sm:px-4 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider whitespace-nowrap"
              >
                Location
              </th>
            )}
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
          {items.map((item, index) => {
            const hasProposals = Array.isArray(item.proposals) && item.proposals.length > 0;
            const budget = item.jobDetails?.agreedPrice || item.budget;

            return (
              <tr key={item.id || index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick?.(item)}>
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-900">{item.title}</div>
                  {budget && <div className="text-xs text-gray-500 mt-1">Budget: ₦{budget.toLocaleString()}</div>}
                </td>

                {['in-progress', 'completed', 'cancelled'].includes(activeTab) && (
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900">{getArtisanName(item)}</div>
                  </td>
                )}

                {!showLocation && (
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                    <StatusBadge proposal={item} isArtisanRoute={isArtisanRoute} activeTab={activeTab} />
                  </td>
                )}
                {showLocation && (
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900 truncate max-w-[200px]">
                      {item.jobDetails?.jobLocation?.address || 'Location not specified'}
                    </div>
                  </td>
                )}
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <div className="text-gray-900">
                    {item.postedAt
                      ? new Date(item.postedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : item.date || 'N/A'}
                  </div>
                  <div className="text-xs text-neu-dark-1">
                    {item.postedAt
                      ? new Date(item.postedAt).toLocaleTimeString('en-US', {
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
