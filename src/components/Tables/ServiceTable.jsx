import React from 'react';
import { MoreVertical, Clock } from 'lucide-react';
import { getColorFromString } from '../../utils/colors';
import { FaHourglassHalf } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';
import { BsCircleFill } from 'react-icons/bs';

// Status Badge component that can be reused
export const StatusBadge = ({ status }) => {
  if (status === 'Completed') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-success-light-1 text-success-dark-1">
        {status}
      </div>
    );
  } 
  
  if (status === 'Cancelled') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-err-light-1 text-err-dark-1">
        {status}
      </div>
    );
  } 
  
  if (status === 'Pending') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-warning-light-1 text-warning-dark-1">
        <FaHourglassHalf className="text-warning-dark-1" size={16} />
        {status}
      </div>
    );
  } 
  
  if (status === 'Quotes Received') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-pri-light-1 text-pri-dark-1">
        <BsCircleFill className="text-pri-norm-1" size={16} />
        {status}
      </div>
    );
  } 
  
  if (status === 'Awaiting Quotes') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-warning-light-1 text-warning-dark-1">
        <BsCircleFill className="text-warning-norm-1" size={16} />
        {status}
      </div>
    );
  } 
  
  if (status === 'Scheduled') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-pri-light-1 text-pri-dark-1">
        <HiOutlineCalendar className="text-pri-norm-1" size={16} />
        {status}
      </div>
    );
  } 
  
  if (status === 'In Progress') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-warning-light-1 text-warning-dark-1">
        {/* <Clock className="text-warning-norm-1" size={16} /> */}
        {status}
      </div>
    );
  }
  
  // Default case
  return (
    <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full font-medium bg-neu-light-1 text-neu-dark-1">
      {status}
    </div>
  );
};

const ServiceTable = ({ 
  items = [], 
  onRowClick, 
  activeTab, 
  formatItemSlug = (title) => title,
  actionButton,
  containerClassName = "" 
}) => {
  return (
    <div className={`overflow-x-auto ${containerClassName}`}>
      <table className="min-w-full divide-y divide-neu-light-1">
        <thead className="bg-neu-light-1">
          <tr className="h-12">
            <th
              scope="col"
              className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider"
            >
              Service
            </th>
            <th
              scope="col"
              className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider"
            >
              Artisan
            </th>
            <th
              scope="col"
              className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th scope="col" className="relative px-6 py-0">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick ? onRowClick(item, activeTab, formatItemSlug) : null}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <>
                        <img
                          className="h-full w-full object-cover"
                          src={item.image}
                          alt={item.artisan}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      </>
                    ) : (
                      <div
                        className={`h-full w-full flex items-center justify-center font-medium text-white ${getColorFromString(item.artisan)}`}
                      >
                        {item.artisan.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <div className="font-medium text-gray-900">{item.artisan}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900">{item.date}</div>
                <div className="text-xs text-neu-dark-1">{item.time}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-3">
                  {actionButton ? (
                    actionButton(item)
                  ) : (
                    <button
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full border border-gray-200 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Default action button
                      }}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
