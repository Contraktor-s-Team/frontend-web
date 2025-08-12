import React, { useState, useEffect } from 'react';
import PageHeader from '../../../../components/PageHeader/PageHeader';
import { Briefcase, Calendar, Banknote } from 'lucide-react';
import { useArtisan } from '../../../../contexts/ArtisanContext';

const stats = [
  {
    title: 'New Job Requests',
    value: '3 New Requests',
    description: 'New jobs awaiting your response.',
    icon: Briefcase,
    iconBg: 'bg-pri-light-1',
    iconColor: 'text-pri-dark-1'
  },
  {
    title: 'Scheduled Jobs',
    value: '2 Upcoming',
    description: "Jobs you've accepted and scheduled.",
    icon: Calendar,
    iconBg: 'bg-sec-light-1',
    iconColor: 'text-warning-dark-1'
  },
  {
    title: 'Pending Payments',
    value: '₦24,000',
    description: 'Total amount awaiting release.',
    icon: Banknote,
    iconBg: 'bg-success-light-1',
    iconColor: 'text-success-dark-1'
  }
];

const DashboardHeader = ({ data }) => {
  const { state, toggleArtisanAvailability, availabilityLoading, availabilityError } = useArtisan();

  // Safely extract user data
  const userData = data?.data || data || {};
  const userName = userData?.firstName || userData?.name || 'Artisan';

  // Initialize availability state from artisan data or default to true
  const [isAvailable, setIsAvailable] = useState(() => {
    return (
      state.artisan.data?.user?.isAvailable ??
      state.artisan.data?.isAvailable ??
      userData?.isAvailable ??
      userData?.available ??
      true
    );
  });

  // Update local state when artisan data changes
  useEffect(() => {
    if (state.artisan.data?.user?.isAvailable !== undefined) {
      setIsAvailable(state.artisan.data.user.isAvailable);
    } else if (state.artisan.data?.isAvailable !== undefined) {
      setIsAvailable(state.artisan.data.isAvailable);
    }
  }, [state.artisan.data?.user?.isAvailable, state.artisan.data?.isAvailable]);

  const handleAvailabilityChange = async (newAvailability) => {
    console.log('🎯 DashboardHeader: Starting availability change...', {
      from: isAvailable,
      to: newAvailability
    });

    try {
      // Optimistically update UI
      setIsAvailable(newAvailability);
      console.log('🎯 DashboardHeader: UI updated optimistically');

      // Call the API
      await toggleArtisanAvailability(
        newAvailability,
        (response) => {
          // Success callback
          console.log('🎯 DashboardHeader: API Success!', response);
          console.log('🎯 DashboardHeader: Final availability state:', newAvailability);
        },
        (error) => {
          // Error callback - revert the optimistic update
          console.error('🎯 DashboardHeader: API Error!', error);
          setIsAvailable(!newAvailability);
          console.log('🎯 DashboardHeader: Reverted availability to:', !newAvailability);

          // You might want to show a toast notification here
          alert(`Failed to update availability: ${error}`);
        }
      );
    } catch (error) {
      // Revert optimistic update on error
      setIsAvailable(!newAvailability);
      console.error('🎯 DashboardHeader: Catch block error:', error);
      console.log('🎯 DashboardHeader: Reverted availability in catch to:', !newAvailability);
    }
  };

  return (
    <div className="font-inter font-medium">
      <PageHeader
        title={`Good morning, ${userName}👋`}
        subtitle="Ready to get things done today?"
        showAvailability={true}
        initialAvailability={isAvailable}
        onAvailabilityChange={handleAvailabilityChange}
        availabilityLoading={availabilityLoading}
      />

      {/* Show error message if availability update fails */}
      {/* {availabilityError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">Error updating availability: {availabilityError}</p>
        </div>
      )} */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-11">
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
                  <h3 className="font-manrope mt-1 text-xl font-semibold text-gray-900">{stat.value}</h3>
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
