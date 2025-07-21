import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../../components/Tables/ServiceTable';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Map, Check, MessageSquareText, Banknote, RotateCw, Download, Pencil, Phone } from 'lucide-react';
import { GoStarFill } from 'react-icons/go';
import Button from '../../../components/Button/Button';
import Avatar from '/img/avatar1.jpg';

const JobDetails = () => {
  const { tab, jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  // Star rating state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch('/jobs.json');
        const jobs = await response.json();
        // Find the job with matching ID
        const foundJob = jobs
          .filter((job) => job.tab.toLowerCase() === tab)
          .find((j) => j.title.toLowerCase().replaceAll(' ', '-') === jobId);

        console.log(foundJob, jobId, tab);
        setJob(foundJob || null);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, tab]);

  // Handle back navigation while preserving tab state
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="p-6">Loading job details...</div>;
  }

  if (!job) {
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

        {['ongoing', 'scheduled', 'pending'].includes(job.tab.toLowerCase()) && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" rightIcon={<Check size={20} />}>
              Mark as complete
            </Button>
            <Button variant="grey-sec">Cancel</Button>
            <Button variant="destructive-sec">Report Issue</Button>
          </div>
        )}

        {['posted'].includes(job.tab.toLowerCase()) && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" rightIcon={<Pencil size={20} />}>
              Edit Job
            </Button>
            <Button variant="grey-sec">Cancel Job</Button>
          </div>
        )}

        {['cancelled'].includes(job.tab.toLowerCase()) && (
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

        {['completed'].includes(job.tab.toLowerCase()) && (
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
              <span className="text-black">{job.category}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span className="">status badge:</span>
              <StatusBadge status={job.status} />
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span className="">scheduled date & time:</span>
              <span className="text-black">{job.jobDetails.dateTime}</span>
            </p>

            {job.jobDetails.location && (
              <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                <span className="">agreed price:</span>
                <span className="text-black">{job.jobDetails.agreedPrice}</span>
              </p>
            )}
          </div>

          <div className="mt-16.25 space-y-10.5">
            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Job Description</p>
              <p className="font-medium">{job.jobDetails.jobDescription}</p>
            </div>

            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Attached Photos</p>
              <div className="flex flex-wrap gap-2">
                {job.jobDetails.attachedPhotos.map((photo, index) => (
                  <img key={index} src={photo} alt={`photo-${index}`} className="w-36 h-26 object-cover rounded-xl" />
                ))}
              </div>
            </div>

            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Job Location</p>
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
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5.25 w-full max-w-[482px]">
          {job.jobDetails.cancelledNotes && (
            <div className="bg-white rounded-xl p-7 h-fit">
              <h3 className="font-manrope text-xl font-semibold">Cancellation Reason</h3>
              <ul className="mt-12.25 space-y-3 pl-4">
                {job.jobDetails.cancelledNotes.map((update, index) => (
                  <li key={index} className="capitalize font-medium list-disc">
                    {update}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.jobDetails.artisanDetails && (
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
                    <img src={job.jobDetails.artisanDetails.image} alt="artisan" className="w-10 h-10 rounded-full" />

                    <div className="text-pri-dark-1">{job.jobDetails.artisanDetails.name}</div>
                    </div>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">rating:</span>
                  <div className="bg-neu-light-1 px-2.5 py-3 rounded-full flex items-center gap-2.5">
                    <GoStarFill size={20} className='text-warning-norm-1' />
                    <span className="text-black">{job.jobDetails.artisanDetails.rating.split(' ')[0]} <span className="text-neu-norm-2">{job.jobDetails.artisanDetails.rating.split(' ').slice(1).join(' ')}</span>
                      
                    </span>
                    </div>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">specialty:</span>
                  <span className="text-black">{job.jobDetails.artisanDetails.specialty}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">phone number:</span>
                  <span className="text-black">{job.jobDetails.artisanDetails.phoneNumber}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">email:</span>
                  <span className="text-black">{job.jobDetails.artisanDetails.email}</span>
                </p>
                <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
                  <span className="">location:</span>
                  <span className="text-black">{job.jobDetails.artisanDetails.location}</span>
                </p>
              </div>
            </div>
          )}

          {job.jobDetails.updates && (
            <div className="bg-white rounded-xl p-7 h-fit">
              <h3 className="font-manrope text-xl font-semibold">Job Updates</h3>
              <ul className="mt-12.25 space-y-3 pl-4">
                {job.jobDetails.updates.map((update, index) => (
                  <li key={index} className="capitalize font-medium list-disc">
                    {update}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.jobDetails.quotes && (
            <div className="bg-white rounded-xl p-7 h-fit">
              {/* Header */}
              <div className="mb-6">
                <h1 className="font-manrope text-xl font-semibold mb-2.5">Quotes</h1>
                <p className="text-neu-dark-1">You've received {job.jobDetails.quotes.length} quotes for this job</p>
              </div>

              {/* Quotes List */}
              <div className="space-y-4">
                {job.jobDetails.quotes.map((quote) => (
                  <div key={quote.artisan} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    {/* Artisan Info Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={quote.avatar || Avatar}
                          alt={quote.artisan}
                          className="w-42.5 h-42.5 rounded-lg object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 shadow-sm flex items-center gap-2">
                          <GoStarFill size={12} className="text-warning-norm-1" />
                          <span className="text-xs font-medium text-gray-900">{quote.rating}</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-4.25">
                        <div className="">
                          <h3 className="font-semibold mb-1">{quote.artisan}</h3>
                          <p className="text-neu-dark-1 text-sm mb-2">{quote.category}</p>
                        </div>

                        <div className="flex items-center gap-2 bg-neu-light-1 px-4.25 py-2 w-fit rounded-full">
                          <Banknote size={20} className="text-pri-norm-1" />
                          <p className="font-semibold">{quote.price}</p>
                        </div>

                        <div className="flex items-center gap-2 bg-success-light-1 px-4.25 py-2 w-fit rounded-full">
                          <div className="w-3.5 h-3.5 bg-success-norm-1 rounded-full"></div>
                          <span className="text-sm text-success-norm-3 font-medium">{quote.availability}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <p className="text-sm text-neu-dark-1 mb-2">Message From artisan</p>
                      <p className="leading-relaxed">{quote.message}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button variant="secondary" rightIcon={<Check size={20} />}>
                        Accept Quote
                      </Button>
                      <Button variant="grey-sec" rightIcon={<MessageSquareText size={20} />}>
                        Chat with artisan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
};

export default JobDetails;
