import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';

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



const RecentServices = () => {
  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">Recent Services</h2>
        <Button
          variant="secondary"
          to="/services"
          rightIcon={<ChevronRight size={20} />}
          className=""
        >
          View All
        </Button>
      </div>
      
      <ServiceTable items={services} />
    </div>
  );
};

export default RecentServices;