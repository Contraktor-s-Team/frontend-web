import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import Button from '../../../components/Button/Button';
import { getColorFromString } from '../../../utils/colors';

const services = [
  {
    id: 1,
    title: 'AC Installation',
    artisan: 'Musa Ibrahim',
    status: 'Completed',
    date: '6 Jul, 2023',
    time: '1:00 PM',
    image: '/img/avatar1.jpg'
  },
  {
    id: 2,
    title: 'Plumbing Leak Repair',
    artisan: 'Fatima Bello',
    status: 'In Progress',
    date: '12 June 2023',
    time: '1:00 PM',
    image: '/img/avatar2.jpg'
  },
  {
    id: 3,
    title: 'House Cleaning',
    artisan: 'Chinedu Okafor',
    status: 'Completed',
    date: '13 June 2023',
    time: '1:00 PM',
    image: '/img/avatar3.jpg'
  },
  {
    id: 4,
    title: 'Generator Service',
    artisan: 'Ayodele Akinwumi',
    status: 'In Progress',
    date: '14 June 2023',
    time: '1:00 PM',
    image: ''
  }
];

const StatusBadge = ({ status }) => {
  if (status === 'Completed') {
    return (
      <div className="inline-flex items-center px-4 py-[10px] rounded-full font-medium bg-green-50 text-green-700">
        {status}
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center px-4 py-[10px] rounded-full font-medium bg-warning-light-1 text-warning-dark-1">
      {status}
    </div>
  );
};

const RecentServices = () => {
  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Recent Services</h2>
        <Button
          variant="primary-trans"
          to="/services"
          rightIcon={<ChevronRight size={20} />}
          className=""
        >
          View All
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neu-light-1">
          <thead className="bg-neu-light-1">
            <tr className="h-12">
              <th scope="col" className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider ">
                Service
              </th>
              <th scope="col" className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider ">
                Artisan
              </th>
              <th scope="col" className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider ">
                Status
              </th>
              <th scope="col" className="px-6 py-0 text-left text-xs font-medium text-neu-dark-1 uppercase tracking-wider ">
                Date & Time
              </th>
              <th scope="col" className="relative px-6 py-0">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors h-[72px]">
                <td className="px-6 py-0 whitespace-nowrap">
                  <div className=" font-medium text-gray-900">{service.title}</div>
                </td>
                <td className="px-6 py-0 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {service.image ? (
                        <>
                          <img 
                            className="h-full w-full object-cover" 
                            src={service.image} 
                            alt={service.artisan}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden h-full w-full items-center justify-center  font-medium text-gray-700" style={{ backgroundColor: getColorFromString(service.artisan) }}>
                            {service.artisan.charAt(0).toUpperCase()}
                          </div>
                        </>
                      ) : (
                        <div 
                          className="h-full w-full flex items-center justify-center  font-medium text-gray-700"
                          style={{ backgroundColor: getColorFromString(service.artisan) }}
                        >
                          {service.artisan.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="">
                      <div className=" font-medium text-gray-900">{service.artisan}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-0 whitespace-nowrap">
                  <StatusBadge status={service.status} />
                </td>
                <td className="px-6 py-0 whitespace-nowrap">
                  <div className=" text-gray-900">{service.date}</div>
                  <div className="text-xs text-neu-dark-1">{service.time}</div>
                </td>
                <td className="px-6 py-0 whitespace-nowrap text-right  font-medium">
                  <button className="text-gray-400 hover:text-neu-dark-1 p-2 rounded-full border border-gray-200 hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentServices;