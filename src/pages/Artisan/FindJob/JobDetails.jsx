import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Map, MessageSquareText, Phone } from 'lucide-react';
import Button from '../../../components/Button/Button';
import Avatar from '/img/avatar1.jpg';

const JobDetails = () => {
  const { tab, jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch('/jobScenarios.json');
        const jobs = await response.json();
        const foundJob = jobs.find((j) => j.id === Number(jobId));
        console.log(foundJob);
        setJob(foundJob || null);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, tab]);

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
      {/* Breadcrumb */}
      <div className="">
        <p className="capitalize font-medium text-sm text-pri-norm-1">
          <Link to="/artisan/find-jobs">Find Jobs</Link> / <Link to={`/artisan/jobs/${tab}`}>{tab}</Link>{' '}
          / <span className="text-black">Job Details</span>
        </p>
      </div>

      {/* Title and Action Buttons */}
      <div className="flex items-center justify-between my-6.25">
        <h3 className="font-manrope text-2xl font-semibold">Job Details</h3>
        {tab === 'listings' && (
          <div className="flex items-center gap-5">
            <Button variant="secondary" className="px-4 py-3.75">
              Send Quote
            </Button>
            <Button variant="destructive-sec" className="px-4 py-3.75">
              Report Issue
            </Button>
          </div>
        )}
        {tab === 'requests' && (
          <div className="flex items-center gap-5">
            <button className="py-4 px-3.75 bg-success-norm-1 text-white text-sm font-medium rounded-full hover:bg-success-norm-2">
              Accept Job
            </button>
            <Button variant="destructive-sec" className="px-4 py-3.75">
              Reject Job
            </Button>
            <Button variant="grey-sec" className="px-4 py-3.75">
              Report Issue
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-5.5">
        {/* Job Summary */}
        <div className="bg-white w-full max-w-[584px] rounded-xl p-7">
          <h3 className="font-manrope text-xl font-semibold">Job Summary</h3>
          <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

          <div className="space-y-6.5">
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Job Title:</span>
              <span className="text-black">{job.title}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Category:</span>
              <span className="text-black">{job.category}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Date & Time:</span>
              <span className="text-black">{job.dateTime}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Job Location:</span>
              <span className="text-black">{job.customer.location}</span>
            </p>
            <Button
              variant="secondary"
              rightIcon={<Map size={20} />}
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.customer.location)}`,
                  '_blank'
                )
              }
              className="py-4.5 px-5.25"
            >
              View Location on Map
            </Button>
          </div>

          <div className="mt-10.25 space-y-10.5">
            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Job Description</p>
              <p className="font-medium">{job.description}</p>
            </div>
            <div className="space-y-4.25">
              <p className="font-medium text-neu-norm-2">Attached Photos</p>
              <div className="flex flex-wrap gap-2">
                {job.images.map((photo, index) => (
                  <img key={index} src={photo} alt={`photo-${index}`} className="w-36 h-26 object-cover rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-xl p-7 h-fit w-full max-w-[482px]">
          <div className="flex items-center justify-between">
            <h3 className="font-manrope text-xl font-semibold">Customer Details</h3>
            <div className="flex items-center gap-4 text-pri-norm-1">
              <MessageSquareText size={24} />
              <Phone size={24} />
            </div>
          </div>
          <div className="h-0.25 bg-neu-light-3 my-5.5"></div>
          <div className="space-y-6.5">
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Name:</span>
              <div className="flex items-center gap-2.5">
                <img src={job.customer.avatar || Avatar} alt="customer" className="w-10 h-10 rounded-full" />
                <div className="">{job.customer.name}</div>
              </div>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Phone Number:</span>
              <span className="text-black">{job.customer.phone}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Email:</span>
              <span className="text-black">{job.customer.email}</span>
            </p>
            <p className="capitalize flex items-center gap-6 font-medium text-neu-norm-2">
              <span>Location:</span>
              <span className="text-black">{job.customer.location}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
