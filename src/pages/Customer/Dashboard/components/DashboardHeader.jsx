import React from 'react';
import PageHeader from '../../../../components/PageHeader/PageHeader';
import { Plus, Briefcase, File, Banknote } from 'lucide-react';

const stats = [
  {
    title: 'Ongoing Jobs',
    value: '2 Active',
    description: 'Plumber arriving today by 2:00 PM',
    icon: Briefcase,
    iconBg: 'bg-pri-light-1',
    iconColor: 'text-pri-dark-1',
  },
  {
    title: 'New Quotes Received',
    value: '3 Quotes Waiting',
    description: 'Electrician, Painter, AC Technician',
    icon: File,
    iconBg: 'bg-sec-light-1',
    iconColor: 'text-warning-dark-1',
  },
  {
    title: 'Pending Payments',
    value: '₦12,500',
    description: '1 job completed — waiting for your approval',
    icon: Banknote,
    iconBg: 'bg-success-light-1',
    iconColor: 'text-success-dark-1',
  },
];

const DashboardHeader = ({data}) => {
  return (
    <div className='font-inter font-medium'>
      <PageHeader
        title={`Good morning,${data?.data?.firstName || "Customer"}👋`}
        subtitle="Ready to get things done today?"
        buttonText="Post a Job"
        buttonVariant="secondary"
        buttonHref="/customer/post-job/describe"
        buttonIcon={<Plus size={20} />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <p className="font-medium text-neu-dark-1">{stat.title}</p>
                </div>
                <div>
                  <h3 className="font-manrope mt-1 text-xl font-semibold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="mt-1 text-sm text-neu-dark-1">{stat.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHeader;
