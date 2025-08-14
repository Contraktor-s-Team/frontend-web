import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../../components/Tables/ServiceTable.jsx';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Map, Check, MessageSquareText, Banknote, RotateCw, Download, Pencil, Phone } from 'lucide-react';
import { GoStarFill } from 'react-icons/go';
import Button from '../../../components/Button/Button.jsx';
import Avatar from '/img/avatar1.jpg';
import { useJobListings } from '../../../contexts/JobListingContext.jsx';
import { useProposal } from '../../../contexts/ProposalContext.jsx';
import NegotiationModal from '../../../components/Modal/NegotiateModal.jsx';
import ConfirmationModal from '../../../components/Modal/ComfirmationModal.jsx';
import SuccessPopup from '../../../components/Modal/SuccessPopup.jsx';

const CustomerJobDetails = () => {
  const { state: jobListingState, fetchJobListingById, deleteJobListing } = useJobListings();
  const { state: proposalState, fetchJobProposal, fetchNegotiation, negotiateProposal, selectProposal } = useProposal();
  const { tab, jobId } = useParams();
  const navigate = useNavigate();

  const jobLoading = jobListingState.jobListingById.loading;
  const data = jobListingState.jobListingById.data;
  const proposalData = proposalState.jobProposal.data;

  const [job, setJob] = useState(data?.data || null);
  const [isOpen, setIsOpen] = useState(false);
  // Star rating state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [modalError, setModalError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showAcceptSuccessPopup, setShowAcceptSuccessPopup] = useState(false);

  // Extract data from contexts
  const loading = jobListingState.jobListingById.loading;
  const error = jobListingState.jobListingById.error;

  // FIXED: Get proposals from the job object directly since they're nested in the job data
  const proposals = job?.proposals || [];

  const negotiations = proposalState.negotiate.data;
  const negotiationsLoading = proposalState.negotiate.loading;
  const negotiationsError = proposalState.negotiateProposal.error;
  const selectLoading = proposalState.selectProposal.loading;
  const selectError = proposalState.selectProposal.error;
  const deleteLoading = jobListingState.jobListingDelete.loading;
  const deleteSuccess = jobListingState.jobListingDelete.data?.isSuccess;
  const deleteError = jobListingState.jobListingDelete.error;
  const userData = {}; // TODO: get user data from context if needed

  // Handle star click
  const handleStarClick = (star) => {
    if (star === rating) {
      // If clicking the same star that's already selected, unselect it
      setRating(0);
    } else {
      // Otherwise, set the new rating
      setRating(star);
    }
  };

  useEffect(() => {
    console.log('JobDetails: Starting fetch for jobId:', jobId);
    fetchJobListingById(jobId);
    // REMOVED: fetchJobProposal(jobId) since proposals come with the job data
    // Clear any previous error states when navigating to a new job
    setModalError('');
  }, [jobId]);

  // Clear error states when component mounts
  useEffect(() => {
    setModalError('');
  }, []);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (modalError) {
      const timer = setTimeout(() => {
        setModalError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [modalError]);

  useEffect(() => {
    if (jobListingState.jobListingById.data?.data) {
      const jobData = jobListingState.jobListingById.data.data;
      console.log('JobDetails - Job data structure:', jobData);
      console.log('JobDetails - Proposals:', jobData.proposals); // Updated log
      console.log('JobDetails - Image URLs:', jobData.imageUrls);
      setJob(jobData);
    }
  }, [jobListingState.jobListingById.data]);

  // Handle back navigation while preserving tab state
  const handleBack = () => {
    navigate(-1);
  };

  const openModal = (proposal) => {
    setSelectedProposal(proposal);
    fetchNegotiation(proposal.id);
    setIsOpen(true);
  };

  const handleAcceptProposal = (proposal) => {
    // Clear any previous errors
    setModalError('');

    selectProposal(
      proposal.id,
      (response) => {
        // Success callback
        console.log('Proposal accepted successfully:', response);
        setShowAcceptSuccessPopup(true);
        // Refresh the job data to reflect the accepted proposal
        fetchJobListingById(jobId);
      },
      (error) => {
        // Error callback
        console.error('Failed to accept proposal:', error);
        setModalError(typeof error === 'string' ? error : error?.message || 'Failed to accept proposal');
      }
    );
  };

  const handleDeleteJob = () => {
    // Clear any previous errors
    setModalError('');
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = () => {
    // Clear any previous errors
    setModalError('');

    deleteJobListing(jobId, () => {
      setShowDeleteModal(false);
      setShowSuccessPopup(true);
      navigate('/customer/jobs/posted');
    });
  };

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      // setShowDeleteModal(false);
      // setShowSuccessPopup(true);
      // // Navigate after showing success message
      // setTimeout(() => {
      //   navigate('/customer/jobs/posted');
      // }, 2000);
    }
  }, [deleteSuccess]);

  // Handle delete error
  useEffect(() => {
    if (deleteError) {
      setShowDeleteModal(false);
      // You can show an error toast here if you have one
      console.error('Failed to delete job:', deleteError);
    }
  }, [deleteError]);

  if (loading) {
    return <div className="p-6">Loading job details...</div>;
  }

  if (!job) {
    console.log('Job not found for ID:', jobId); // Fixed log
    return (
      <div className="p-6">
        <Button variant="destructive-sec" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
          Back to {tab}
        </Button>
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">Job not found</div>
      </div>
    );
  }

  return (
    <div className="font-inter font-medium">
      <div className="">
        <p className="capitalize font-medium text-sm text-pri-norm-1">
          <Link to="/customer/jobs/ongoing">my jobs</Link> / <Link to={`/customer/jobs/${tab}`}>{tab}</Link> /{' '}
          <span className="text-black">job details</span>
        </p>
      </div>

      <div className="flex items-center justify-between my-6.25">
        <h3 className="font-manrope text-2xl font-semibold">Job Details</h3>

        {['ongoing', 'scheduled', 'pending'].includes(tab?.toLowerCase()) && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" rightIcon={<Check size={20} />}>
              Mark as complete
            </Button>
            <Button variant="grey-sec">Cancel</Button>
            <Button variant="destructive-sec">Report Issue</Button>
          </div>
        )}

        {['posted'].includes(tab?.toLowerCase()) && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" rightIcon={<Pencil size={20} />}>
              Edit Job
            </Button>
            <Button variant="grey-sec" onClick={handleDeleteJob} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete Job'}
            </Button>
          </div>
        )}

        {['cancelled'].includes(tab?.toLowerCase()) && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" rightIcon={<RotateCw size={20} />}>
              Repost Job
            </Button>
            <Button variant="grey-sec" rightIcon={<Download size={20} />}>
              Edit Job
            </Button>
            <Button variant="destructive-sec">Report Issue</Button>
          </div>
        )}

        {['completed'].includes(tab?.toLowerCase()) && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" rightIcon={<RotateCw size={20} />}>
              Rehire Artisan
            </Button>
            <Button variant="grey-sec" rightIcon={<Download size={20} />}>
              Download Receipt
            </Button>
            <Button variant="destructive-sec">Report Issue</Button>
          </div>
        )}
      </div>
      <div className="flex gap-5.5">
        <div className="bg-white w-full max-w-[584px] rounded-xl p-7">
          <h3 className="font-manrope text-xl font-semibold">Job Summary</h3>

          <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

          <div className="space-y-6.5">
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span className="">job title:</span>
              <span className="text-black">{job.title}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span className="">catergory:</span>
              <span className="text-black">{job.subcategoryName}</span>
            </p>
            <div className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span className="">status badge:</span>
              <StatusBadge status={job?.status} />
            </div>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span className="">scheduled date & time:</span>
              <span className="text-black">
                {job?.postedAt
                  ? new Date(job.postedAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })
                  : 'N/A'}
              </span>
            </p>

            {/* {job?.jobDetails?.location && (
              <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                <span className="">agreed price:</span>
                <span className="text-black">{job?.jobDetails?.agreedPrice}</span>
              </p>
            )} */}
          </div>

          <div className="mt-6 space-y-10.5">
            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Job Description</p>
              <p className="font-medium">{job?.description}</p>
            </div>

            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Attached Photos</p>
              <div className="flex flex-wrap gap-2">
                {job?.imageUrls?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job?.imageUrls?.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`photo-${index}`}
                        className="w-36 h-26 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No photos attached</p>
                )}
              </div>
            </div>

            <div className="space-y-4.25">
              {job?.jobDetails?.jobLocation?.address ? (
                <>
                  <p className="font-medium">{job.jobDetails.jobLocation.address}</p>
                  <Button
                    variant="secondary"
                    rightIcon={<Map size={20} />}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${job.jobDetails.jobLocation.address}`,
                        '_blank'
                      )
                    }
                  >
                    View on Map
                  </Button>
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No address provided</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5.25 w-full max-w-[482px]">
          {job?.jobDetails?.cancelledNotes && (
            <div className="bg-white rounded-xl p-7 h-fit">
              <h3 className="font-manrope text-xl font-semibold">Cancellation Reason</h3>
              <ul className="mt-12.25 space-y-3 pl-4">
                {job?.jobDetails?.cancelledNotes.map((update, index) => (
                  <li key={index} className="capitalize font-medium list-disc">
                    {update}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job?.artisan && (
            <div className="bg-white rounded-xl p-7 h-fit">
              <div className="flex items-center justify-between">
                <h3 className="font-manrope text-xl font-semibold">Assigned Artisan Details</h3>
                <div className="flex items-center gap-4 text-pri-norm-1">
                  <MessageSquareText size={24} />
                  <Phone size={24} />
                </div>
              </div>

              <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

              <div className=" space-y-6.5">
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">artisan name:</span>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={job?.jobDetails?.artisanDetails?.image}
                      alt="artisan"
                      className="w-10 h-10 rounded-full"
                    />

                    <div className="text-pri-dark-1">{job?.jobDetails?.artisanDetails?.name}</div>
                  </div>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">rating:</span>
                  <div className="bg-neu-light-1 px-2.5 py-3 rounded-full flex items-center gap-2.5">
                    <GoStarFill size={20} className="text-warning-norm-1" />
                    <span className="text-black">
                      {job?.proposals?.rating?.split(' ')[0]}{' '}
                      <span className="text-neu-norm-2">{job?.proposals?.rating?.split(' ').slice(1).join(' ')}</span>
                    </span>
                  </div>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">specialty:</span>
                  <span className="text-black">{job?.proposals?.specialty}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">phone number:</span>
                  <span className="text-black">{job?.proposals?.phoneNumber}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">email:</span>
                  <span className="text-black">{job?.proposals?.email}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">location:</span>
                  <span className="text-black">{job?.proposals?.location}</span>
                </p>
              </div>
            </div>
          )}

          {job?.jobDetails?.updates && (
            <div className="bg-white rounded-xl p-7 h-fit">
              <h3 className="font-manrope text-xl font-semibold">Job Updates</h3>
              <ul className="mt-12.25 space-y-3 pl-4">
                {job?.jobDetails?.updates?.map((update, index) => (
                  <li key={index} className="capitalize font-medium list-disc">
                    {update}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FIXED: Updated proposals section to use job.proposals directly */}
          {proposals && proposals.length > 0 && (
            <div className="bg-white rounded-xl p-7 h-fit">
              {/* Header */}
              <div className="mb-6">
                <h1 className="font-manrope text-xl font-semibold mb-2.5">Proposal(s)</h1>
                <p className="text-neu-dark-1">You've received {proposals.length} proposals for this job</p>
              </div>

              <div className="space-y-4">
                {proposals.map((quote, index) => (
                  <div
                    key={quote?.id || `quote-${index}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                  >
                    {/* Artisan Info Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1 space-y-4.25">
                        <div>
                          <h3 className="font-semibold mb-1">
                            {quote?.artisan?.firstName || 'Unknown'} {quote?.artisan?.lastName || 'Artisan'}
                          </h3>
                          <p className="text-neu-dark-1 text-sm mb-2">{quote?.category || 'N/A'}</p>
                          <p className="text-neu-dark-1 text-xs">
                            Submitted: {quote?.submittedAt ? new Date(quote.submittedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-neu-light-1 px-4.25 py-2 w-fit rounded-full">
                          <Banknote size={20} className="text-pri-norm-1" />
                          <p className="font-semibold">
                            ₦
                            {typeof quote?.proposedPrice === 'number'
                              ? quote.proposedPrice.toLocaleString()
                              : quote?.proposedPrice || 'N/A'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-success-light-1 px-4.25 py-2 w-fit rounded-full">
                          <div className="w-3.5 h-3.5 bg-success-norm-1 rounded-full"></div>
                          <span className="text-sm text-success-norm-3 font-medium">
                            Available {/* Since availability field might not be in your data structure */}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <p className="text-sm text-neu-dark-1 mb-2">Message From Artisan</p>
                      <p className="leading-relaxed">{quote?.message || 'No message provided'}</p>
                    </div>

                    {/* Proposal Status */}
                    <div className="mb-4">
                      <p className="text-sm text-neu-dark-1 mb-2">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quote?.status === 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : quote?.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {quote?.status === 0 ? 'Pending' : quote?.status === 1 ? 'Accepted' : 'Rejected'}
                      </span>
                    </div>

                    {/* Action Buttons - Only show if proposal is pending */}
                    {quote?.status === 0 && (
                      <div className="flex gap-4">
                        <Button
                          variant="secondary"
                          rightIcon={<Check size={20} />}
                          onClick={() => handleAcceptProposal(quote)}
                          disabled={selectLoading}
                        >
                          {selectLoading ? 'Accepting...' : 'Accept Proposal'}
                        </Button>
                        <Button
                          variant="grey-sec"
                          rightIcon={<MessageSquareText size={20} />}
                          onClick={() => openModal(quote)}
                        >
                          Negotiate Proposal
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show message when no proposals */}
          {(!proposals || proposals.length === 0) && (
            <div className="bg-white rounded-xl p-7 h-fit">
              <div className="mb-6">
                <h1 className="font-manrope text-xl font-semibold mb-2.5">Proposal(s)</h1>
                <p className="text-neu-dark-1">You haven't received any proposals for this job yet</p>
              </div>
              <h3 className="font-manrope font-semibold text-center text-neu-dark-2">No Proposals yet</h3>
            </div>
          )}

          {tab === 'completed' && (
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-4.5">
              <h3 className="font-manrope text-xl font-semibold text-gray-900">
                Rate your experience with this artisan
              </h3>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="">
                <p className="text-sm text-gray-500 mb-2.25">Your feedback helps us improve our service</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <GoStarFill
                        size={40}
                        className={`transition-colors ${
                          star <= (hoverRating || rating) ? 'text-warning-norm-1' : 'text-neu-light-3'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-medium text-gray-800">{rating ? `${rating}.0` : '0.0'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2.5">
                    Write a review (optional)
                  </label>
                  <textarea
                    id="review"
                    rows="2"
                    className="w-full px-3 py-2 border border-neu-light-3 rounded-lg focus:border-pri-norm-1 focus:outline-none"
                    placeholder="Tell us about your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals - positioned at the end for proper overlay */}
      {isOpen && (
        <NegotiationModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={() => {
            setIsOpen(false);
            setSelectedProposal(null);
          }}
          selectedProposal={selectedProposal}
          proposals={proposals}
          negotiateProposal={negotiateProposal}
          negotiations={negotiations?.data || []} // Pass negotiations from Redux state
          negotiationsLoading={negotiationsLoading} // Pass loading state
          negotiateSuccess={negotiations?.isSuccess}
          errors={negotiationsError}
          currentUserId={userData?.id} // Replace with actual current user ID from Redux
          currentUserRole="User" // Replace with actual current user role from Redux
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteJob}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone and will remove all associated proposals."
        confirmText="Delete Job"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />

      {showSuccessPopup && (
        <SuccessPopup
          message="Job deleted successfully!"
          isVisible={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}

      {showAcceptSuccessPopup && (
        <SuccessPopup
          message="Proposal accepted successfully!"
          isVisible={showAcceptSuccessPopup}
          onClose={() => setShowAcceptSuccessPopup(false)}
        />
      )}

      {/* Error display for operations - only show local errors */}
      {modalError && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm text-red-700">
                <p>{modalError}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={() => setModalError('')} className="text-red-400 hover:text-red-600">
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerJobDetails;
