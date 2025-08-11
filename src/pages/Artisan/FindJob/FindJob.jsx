import React, { useState } from 'react';
import PageHeader from '../../../components/PageHeader/PageHeader';
import SearchFilters from './searchFilters';
import TabNav from '../../../components/Navigation/TabNav';
import { useParams } from 'react-router-dom';
import JobRequestsTab from './JobRequestsTab';
import ProposalsSentTab from './ProposalsSentTab';

const ArtisanFindJob = () => {
  console.log('🚀 FindJob component is mounting/rendering');

  // Get activeTab from URL params
  const allParams = useParams();
  const { tab: tabFromParams } = allParams;

  // Fallback to manual parsing if useParams doesn't work
  const pathSegments = window.location.pathname.split('/');
  const manualTab = pathSegments[pathSegments.length - 1];

  const activeTab = tabFromParams || manualTab || 'requests';

  console.log('🔍 FindJob: All URL params:', allParams);
  console.log('🔍 FindJob: Tab from params:', tabFromParams);
  console.log('🔍 FindJob: Manual tab parsing:', manualTab);
  console.log('🔍 FindJob: Final active tab:', activeTab);
  console.log('🔍 FindJob: Current window location:', window.location.href);
  console.log('🔍 FindJob: Current pathname:', window.location.pathname);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [datePostedFilter, setDatePostedFilter] = useState('');
  const [dateNeededFilter, setDateNeededFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setLocationFilter('');
    setDatePostedFilter('');
    setDateNeededFilter('');
    setSortBy('newest');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || categoryFilter || locationFilter || datePostedFilter || dateNeededFilter;

  // Tab configuration
  const tabs = [
    { id: 'requests', label: 'Job Listings', path: '/artisan/find-jobs/requests' },
    { id: 'proposal-sent', label: 'Proposal Sent', path: '/artisan/find-jobs/proposal-sent' }
  ];

  return (
    <div className="font-inter font-medium">
      <PageHeader
        title="Find New Jobs Near You"
        subtitle="Browse available job opportunities and track your submitted proposals"
      />

      {/* Search Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        datePostedFilter={datePostedFilter}
        setDatePostedFilter={setDatePostedFilter}
        dateNeededFilter={dateNeededFilter}
        setDateNeededFilter={setDateNeededFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        activeTab={activeTab}
      />

      <div className="">
        <TabNav tabs={tabs} activeTab={activeTab} basePath="/artisan/find-jobs" />
      </div>

      <div className="mt-6">
        {activeTab === 'requests' ? (
          <>
            {console.log('🟢 Rendering JobRequestsTab')}
            <JobRequestsTab
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              locationFilter={locationFilter}
              datePostedFilter={datePostedFilter}
              dateNeededFilter={dateNeededFilter}
              sortBy={sortBy}
            />
          </>
        ) : (
          <>
            {console.log('🟡 Rendering ProposalsSentTab')}
            <ProposalsSentTab
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              locationFilter={locationFilter}
              datePostedFilter={datePostedFilter}
              dateNeededFilter={dateNeededFilter}
              sortBy={sortBy}
              activeTab={activeTab}
            />
          </>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-6 text-center">
            <button onClick={clearAllFilters} className="text-blue-600 hover:text-blue-800 font-medium">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanFindJob;
