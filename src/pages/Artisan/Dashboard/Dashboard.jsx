import React, { useEffect, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import RecentServices from './components/NewJobRequests';
import { useLocation, useParams } from 'react-router-dom';
import TabNav from '../../../components/Navigation/TabNav';
import { connect, useSelector } from 'react-redux';
import { userAction } from '../../../redux/User/UserAction';
import { artisanProposalAction, negotiateAction } from '../../../redux/Proposals/ProposalAction';
import { jobIdAction } from '../../../redux/Jobs/JobsAction';

const Dashboard = ({
  loading,
  error,
  data,
  getuser,
  getProposal,
  proposalData,
  proposalLoading,
  getProposedJob,
  proposedJobsData,
  getNegotiations,
  negotiations,
  negotiationsLoading
}) => {
  const location = useLocation();
  const { tab: activeTab = 'new' } = useParams();
  const [services, setServices] = useState([]);
  const [proposedJobs, setProposedJobs] = useState([]);
  const [fetchedJobDetails, setFetchedJobDetails] = useState({});
  const [proposalNegotiations, setProposalNegotiations] = useState({});
  
  const email = location?.state?.email;
  const userEmail = useSelector((state) => state.login.data?.email || state.user?.data?.email);
  const currentUserId = data?.data?.id;

  useEffect(() => {
    getuser();
  }, []);

  // Fetch proposals when switching to proposals tab
  useEffect(() => {
    if (activeTab === 'proposals') {
      getProposal();
    }
  }, [activeTab, getProposal]);

  // Fetch negotiations for each proposal when proposal data is available
  useEffect(() => {
    if (proposalData && proposalData.length > 0 && activeTab === 'proposals') {
      proposalData.forEach(proposal => {
        if (proposal.id && !proposalNegotiations[proposal.id]) {
          getNegotiations(proposal.id);
        }
      });
    }
  }, [proposalData, activeTab, getNegotiations, proposalNegotiations]);

  // Store negotiations data when it's received
  useEffect(() => {
    if (negotiations && negotiations.data) {
      const proposalId = negotiations.proposalId || negotiations.data.proposalId;
      if (proposalId) {
        setProposalNegotiations(prev => ({
          ...prev,
          [proposalId]: negotiations.data
        }));
      }
    }
  }, [negotiations]);

  // Handle proposal data and fetch corresponding job details
  useEffect(() => {
    if (proposalData && proposalData.length > 0 && activeTab === 'proposals') {
      const jobListingIds = [...new Set(proposalData.map(proposal => proposal.jobListingId))];

      jobListingIds.forEach(jobId => {
        if (!fetchedJobDetails[jobId]) {
          getProposedJob(jobId);
        }
      });
    }
  }, [proposalData, getProposedJob, fetchedJobDetails, activeTab]);

  // Store fetched job details when proposedJobsData changes
  useEffect(() => {
    if (proposedJobsData && proposedJobsData.id) {
      setFetchedJobDetails(prev => ({
        ...prev,
        [proposedJobsData.id]: proposedJobsData
      }));
    }
  }, [proposedJobsData]);

  // Helper functions
  const canAcceptNegotiation = (proposal) => {
    if (proposal.senderId === currentUserId) {
      return false;
    }
    return true;
  };

  const hasOngoingNegotiation = (proposalId) => {
    const negotiationData = proposalNegotiations[proposalId];
    return negotiationData && negotiationData.length > 0;
  };

  // Merge proposal data with job details and negotiation info
  useEffect(() => {
    if (proposalData && proposalData.length > 0 && activeTab === 'proposals') {
      const mergedData = proposalData.map(proposal => {
        const jobDetails = fetchedJobDetails[proposal.jobListingId];
        const negotiations = proposalNegotiations[proposal.id] || [];
        
        return {
          ...proposal,
          jobDetails: jobDetails || null,
          negotiations: negotiations,
          id: proposal.id,
          title: jobDetails?.title || 'Job details unavailable',
          description: jobDetails?.description || 'Description unavailable',
          subcategoryName: jobDetails?.subcategoryName || 'Category unavailable',
          customer: jobDetails?.customer || { name: 'Customer unavailable', location: 'Location unavailable' },
          postedAt: jobDetails?.postedAt || proposal.submittedAt,
          proposalStatus: proposal.status,
          proposedPrice: proposal.proposedPrice,
          proposalMessage: proposal.message,
          imageUrls: jobDetails?.imageUrls || [],
          canAccept: canAcceptNegotiation(proposal),
          hasNegotiation: hasOngoingNegotiation(proposal.id),
          senderId: proposal.senderId,
          currentUserId: currentUserId,
          // Additional fields for compatibility
          category: 'proposals'
        };
      });

      setProposedJobs(mergedData);
      setServices(mergedData); // Set services to proposed jobs for the proposals tab
    } else if (activeTab !== 'proposals') {
      // For other tabs, set empty services to show "no jobs available"
      setServices([]);
    }
  }, [proposalData, fetchedJobDetails, proposalNegotiations, currentUserId, activeTab]);

  // Fetch data for other tabs
  useEffect(() => {
    if (activeTab !== 'proposals') {
      const fetchData = async () => {
        try {
          const response = await fetch('/artisan-jobs.json');
          const data = await response.json();
          
          let filteredData = [];
          
          // Filter data based on active tab
          if (activeTab === 'new') {
            filteredData = data.filter(job => job.tab === 'newRequests');
          } else if (activeTab === 'in-progress') {
            filteredData = data.filter(job => job.tab === 'ongoing' || job.status === 'In Progress');
          } else if (activeTab === 'today') {
            // Filter jobs for today's date
            const today = new Date();
            const todayString = today.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            
            filteredData = data.filter(job => {
              // Check if job date matches today or if it's a scheduled/ongoing job for today
              const jobDate = job.date;
              const isToday = jobDate === todayString;
              const isScheduledToday = job.tab === 'scheduled' && jobDate === todayString;
              const isOngoingToday = job.tab === 'ongoing';
              
              return isToday || isScheduledToday || isOngoingToday;
            });
          }
          
          // Transform the data to match the expected format
          const transformedData = filteredData.map(job => ({
            ...job,
            id: job.title + '_' + job.date, // Create unique ID
            subcategoryName: job.category,
            description: job.jobDetails?.jobDescription || 'Description unavailable',
            customer: {
              name: job.customer,
              location: job.jobDetails?.customerDetails?.location || 'Location unavailable',
              image: job.jobDetails?.customerDetails?.image
            },
            postedAt: job.date,
            imageUrls: job.jobDetails?.attachedPhotos || [],
            customerImage: job.jobDetails?.customerDetails?.image
          }));
          
          setServices(transformedData);
        } catch (err) {
          console.error('Error fetching jobs:', err);
          setServices([]);
        }
      };

      fetchData();
    }
  }, [activeTab]);

  const tabs = [
     { id: 'proposals', label: 'Proposal Sent' },
    { id: 'new', label: 'New Job Requests' },
    { id: 'in-progress', label: 'Jobs In Progress' },
    { id: 'today', label: "Today's Jobs" }
   
  ];

  // Determine current loading state
  const getCurrentLoading = () => {
    if (activeTab === 'proposals') {
      return proposalLoading;
    }
    return loading;
  };

  const currentLoading = getCurrentLoading();
  
  return (
    <>
      <DashboardHeader data={data}/>
      <TabNav 
        tabs={tabs} 
        activeTab={activeTab} 
        basePath="/artisan/dashboard" 
        navClassName="flex flex-wrap items-center gap-8 font-inter font-medium"
      />
      <div className="mt-8">
        {currentLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">
              {activeTab === 'proposals' ? 'Loading proposals...' : 'Loading...'}
            </p>
          </div>
        ) : (
          <RecentServices 
            services={services} 
            activeTab={activeTab}
            isProposalsTab={activeTab === 'proposals'}
            proposalLoading={proposalLoading}
          />
        )}
      </div>
    </>
  );
};

const mapStoreToProps = (state) => {
  console.log(state);
  return {
    loading: state?.user?.loading,
    error: state?.user?.error,
    data: state?.user?.data,
    proposalData: state?.artisanProposal?.data?.data,
    proposalLoading: state?.artisanProposal?.loading,
    proposedJobsData: state?.singleJob?.data?.data,
    negotiations: state?.negotiate?.data?.data,
    negotiationsLoading: state?.negotiate?.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getuser: () => dispatch(userAction()),
    getProposal: () => dispatch(artisanProposalAction()),
    getProposedJob: (id) => dispatch(jobIdAction(id)),
    getNegotiations: (proposalId) => dispatch(negotiateAction(proposalId)),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(Dashboard);