import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../../../../components/Button/Button';
import ServiceTable from '../../../../components/Tables/ServiceTable';

const NewJobRequests = ({services, activeTab, formatJobSlug}) => {
  return (
    <div className="font-inter bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-neu-light-1 flex items-center justify-between">
        <h2 className="font-manrope text-xl font-semibold text-gray-900">New Job Requests</h2>
        <Button
          variant="secondary"
          to="/services"
          rightIcon={<ChevronRight size={20} />}
          className=""
        >
          View All
        </Button>
      </div>
      
      <ServiceTable 
          items={services} 
          activeTab={activeTab} 
          formatItemSlug={formatJobSlug}
        />
    </div>
  );
};

export default NewJobRequests;