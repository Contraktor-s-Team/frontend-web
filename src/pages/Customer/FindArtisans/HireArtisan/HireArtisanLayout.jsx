import React from 'react';
import { Outlet, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { MessageSquareText, Phone } from 'lucide-react';
import { useArtisan } from '../../../../contexts/ArtisanContext';
import { useEffect } from 'react';
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
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm font-inter flex justify-center items-center min-h-[400px]">
        <div>Loading artisan details...</div>
      </div>
    );
  }

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

      <div className="mb-6">
        <img
          src={artisan.image || '/img/avatar1.jpg'}
          alt={artisan.name || 'Artisan'}
          className="w-24 h-24 rounded-full object-cover"
          onError={(e) => {
            e.target.src = '/img/avatar1.jpg';
          }}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400 min-w-[120px]">Artisan Name:</span>
          <span className="text-base font-medium text-gray-900">{artisan.name || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400 min-w-[120px]">Specialty</span>
          <span className="text-base font-medium text-gray-900">{artisan.specialty || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400 min-w-[120px]">Rating</span>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="text-base font-semibold">{artisan.rating || '0.0'}</span>
            <span className="text-gray-400 ml-1">({artisan.reviewCount || 0} reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400 min-w-[120px]">Location</span>
          <span className="text-base font-medium text-gray-900">{artisan.location || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400 min-w-[120px]">Availability</span>
          <div
            className={`py-2 px-4 rounded-full flex items-center ${
              artisan.available ? 'bg-success-light-1' : 'bg-warning-light-1'
            }`}
          >
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                artisan.available ? 'bg-success-norm-1' : 'bg-warning-norm-1'
              }`}
            ></span>
            <span
              className={`text-base font-medium ${artisan.available ? 'text-success-norm-3' : 'text-warning-norm-3'}`}
            >
              {artisan.available ? 'Available Now' : 'Not Available'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-base text-gray-400 min-w-[120px]">Languages</span>
          <span className="text-base font-medium text-gray-900">
            {Array.isArray(artisan.languages) ? artisan.languages.join(', ') : artisan.languages || 'English'}
          </span>
        </div>

        {artisan.phoneNumber && (
          <div className="flex items-center gap-6">
            <span className="text-base text-gray-400 min-w-[120px]">Phone</span>
            <span className="text-base font-medium text-gray-900">{artisan.phoneNumber}</span>
          </div>
        )}

        {artisan.email && (
          <div className="flex items-center gap-6">
            <span className="text-base text-gray-400 min-w-[120px]">Email</span>
            <span className="text-base font-medium text-gray-900">{artisan.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const HireArtisanLayout = () => {
  const { artisanId } = useParams();
  const { state: artisanState, fetchArtisanById } = useArtisan();
  const loading = artisanState.artisan.loading;
  const data = artisanState.artisan.data;
  const error = artisanState.artisan.error;

  useEffect(() => {
    if (artisanId) {
      fetchArtisanById(artisanId);
    }
  }, [artisanId, fetchArtisanById]);

  // Transform API data to match UI expectations
  const transformArtisanData = (apiData) => {
    if (!apiData || !apiData.user) return null;

    const user = apiData.user;
    const subcategories = apiData.subcategories?.result || [];

    // Get primary specialty from first subcategory
    const primarySpecialty = subcategories.length > 0 ? subcategories[0].subcategory.name : 'General Services';

    // Get all service names
    const services = subcategories.map((sub) => sub.subcategory.name);

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      specialty: primarySpecialty,
      rating: 4.5, // Default rating - you might want to fetch this from another endpoint
      reviewCount: 0, // Default - you might want to fetch this from another endpoint
      location: user.address || 'Location not specified',
      available: user.isActive,
      phoneNumber: user.phoneNumber,
      email: user.email,
      languages: ['English'], // Default - you might want to add this to your API
      image: user.imageUrl,
      services: services
    };
  };

  // Get transformed artisan data
  const artisan = data ? transformArtisanData(data) : null;

  // If no artisanId, redirect to FindArtisans
  if (!artisanId) {
    return <Navigate to="/find-artisans" />;
  }

  // If at base hire-artisan route, redirect to describe step
  const { tab } = useParams();
  const location = useLocation();
  const isAtBaseRoute =
    location.pathname.endsWith(`/hire-artisan/${tab}/${artisanId}`) ||
    location.pathname.endsWith(`/hire-artisan/${tab}/${artisanId}/`);

  if (isAtBaseRoute) {
    return <Navigate to={`/customer/hire-artisan/${tab}/${artisanId}/describe`} replace />;
  }

  const hasError = error && (error.message || error.error || (typeof error === 'string' && error.length > 0));
  // Error state
  if (hasError) {
    return (
      <div className="font-medium">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Artisan</h2>
          <p className="text-red-600">{error.message || 'Failed to load artisan details'}</p>
          <Link
            to="/customer/artisans/all"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Artisans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-medium">
      {/* Breadcrumbs */}
      <div className="capitalize text-sm text-pri-norm-1">
        <Link to="/customer/artisans/all" className="text-pri-norm-1 hover:underline">
          Browse Artisans
        </Link>
        {' / '}
        <Link to="/customer/artisans/all" className="text-pri-norm-1 hover:underline">
          All artisans
        </Link>
        {' / '}
        <Link to={`/customer/artisans/all/${artisanId}`} className="text-pri-norm-1 hover:underline">
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
        <div className="w-full md:max-w-[475px]">
          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pri-norm-1 mx-auto mb-4"></div>
                <p>Loading artisan details...</p>
              </div>
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
