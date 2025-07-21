import React from 'react';
import { Outlet, Link, useParams, Navigate } from 'react-router-dom';
import { MessageSquareText, Phone } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { StepIndicator } from '../../../../components/FormWorkflow';

const steps = [
  { label: 'Describe the Job', path: 'describe' },
  { label: 'Time & Location', path: 'time-location' },
  { label: 'Review & Submit', path: 'review' }
];

// Custom function to get base path for step navigation
const getBasePath = () => {
  const pathParts = window.location.pathname.split('/');
  const basePathArray = pathParts.slice(0, pathParts.indexOf('hire-artisan') + 1);
  return basePathArray.join('/');
};

const ArtisanDetailsPanel = ({ artisan }) => {
  if (!artisan) {
    return <div>Loading artisan details...</div>;
  }

  // Helper function to safely access nested properties
  const getSafeValue = (value, defaultValue = 'Not specified') => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm font-inter">
      <div className="flex items-center justify-between">
        <h3 className="font-manrope text-xl font-semibold">Artisan Details</h3>
        <div className="flex items-center gap-4 text-pri-norm-1">
          <MessageSquareText size={24} />
          <Phone size={24} />
        </div>
      </div>

      <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

      <div className="">
        <img
          src={typeof artisan.image === 'string' ? artisan.image : '/default-avatar.png'}
          alt={getSafeValue(artisan.name, 'Artisan')}
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      <hr className="border-t border-gray-100 mb-6" />

      <div className="space-y-8">
        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400">Artisan Name:</span>
          <span className="text-base font-medium text-gray-900">{getSafeValue(artisan.name)}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400">Specialty</span>
          <span className="text-base font-medium text-gray-900">{getSafeValue(artisan.specialty)}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400">Rating</span>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="text-base font-semibold">{getSafeValue(artisan.rating, '0')}</span>
            <span className="text-gray-400 ml-1">
              ({Array.isArray(artisan.reviews) ? artisan.reviews.length : artisan.reviewCount || 0} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400">Location</span>
          <span className="text-base font-medium text-gray-900">{getSafeValue(artisan.location)}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400">Availability</span>
          <div
            className={`py-2 px-4 rounded-full flex items-center ${
              artisan.available === true || artisan.isAvailable === true ? 'bg-success-light-1' : 'bg-warning-light-1'
            }`}
          >
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                artisan.available === true || artisan.isAvailable === true ? 'bg-success-norm-1' : 'bg-warning-norm-1'
              }`}
            ></span>
            <span
              className={`text-base font-medium ${
                artisan.available === true || artisan.isAvailable === true
                  ? 'text-success-norm-3'
                  : 'text-warning-norm-3'
              }`}
            >
              {artisan.available === true || artisan.isAvailable === true ? 'Available Now' : 'Not Available'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400">Languages</span>
          <span className="text-base font-medium text-gray-900">
            {Array.isArray(artisan.languages) ? artisan.languages.join(', ') : artisan.languages || 'Not specified'}
          </span>
        </div>
      </div>
    </div>
  );
};

const HireArtisanLayout = () => {
  const { artisanId } = useParams();
  const dispatch = useDispatch();
  const [artisan, setArtisan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch artisan data from artisans.json file
  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        const response = await fetch('/artisans.json');
        if (!response.ok) {
          throw new Error('Failed to fetch artisan data');
        }
        const artisansData = await response.json();
        const selectedArtisan = artisansData.find((artisan) => artisan.id.toString() === artisanId);

        setArtisan(selectedArtisan);
      } catch (error) {
        console.error('Error fetching artisan data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtisanData();
  }, [artisanId, dispatch]);

  // If no artisanId, redirect to FindArtisans
  if (!artisanId) {
    return <Navigate to="/find-artisans" />;
  }

  return (
    <div className="font-medium">
      {/* Breadcrumbs */}
      <div className="capitalize text-sm text-pri-norm-1">
        <Link to="/browse-artisans" className="text-pri-norm-1 hover:underline">
          Browse Artisans
        </Link>
        {' / '}
        <Link to="/all-artisans" className="text-pri-norm-1 hover:underline">
          All artisans
        </Link>
        {' / '}
        <Link to={`/artisan-details/${artisanId}`} className="text-pri-norm-1 hover:underline">
          Artisan Details
        </Link>
        {' / '}
        <span className="text-black">Hire Artisan</span>
      </div>

      <div className="flex items-center justify-between my-8">
        <h1 className="font-manrope text-2xl font-semibold text-gray-900">Hire Artisan</h1>

        {/* Step indicator */}
        <StepIndicator steps={steps} basePath={getBasePath()} />
      </div>

      <div className="flex flex-col md:flex-row gap-5.5">
        {/* Main content */}
        <div className="flex-1">
          {/* Content */}
          <Outlet />
        </div>

        {/* Artisan details sidebar */}
        <div className="w-full md:max-w-[375px]">
          {isLoading ? (
            <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
              <p>Loading artisan details...</p>
            </div>
          ) : (
            <ArtisanDetailsPanel artisan={artisan} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HireArtisanLayout;
