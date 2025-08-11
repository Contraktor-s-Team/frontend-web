import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  MessageSquareText,
  Heart,
  Phone,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  Shield,
  ChevronRight,
  Map
} from 'lucide-react';
import Button from '../../../components/Button/Button';
import { GoStarFill } from 'react-icons/go';
import PageHeader from '../../../components/PageHeader/PageHeader';
import { useUser } from '../../../contexts/UserContext';
import { useArtisan } from '../../../contexts/ArtisanContext';
import { useHireArtisan } from '../../../contexts/HireArtisanContext';
import FallbackImage from '../../../components/FallbackImage';
import Avatar from '/img/avatar1.jpg';
import { FaRegBookmark } from 'react-icons/fa6';

const CustomerArtisanDetails = () => {
  const { artisanId, tab } = useParams();
  const navigate = useNavigate();
  const { state: artisanState, fetchArtisanById } = useArtisan();
  const { dispatch } = useHireArtisan();

  // Extract data from the correct state structure
  const artisanData = artisanState.artisan.data;
  const loading = artisanState.artisan.loading;
  const error = artisanState.artisan.error;

  // Transform API response to match component expectations
  const artisan = artisanData
    ? {
        id: artisanData.user?.id,
        name: `${artisanData.user?.firstName || ''} ${artisanData.user?.lastName || ''}`.trim(),
        firstName: artisanData.user?.firstName,
        lastName: artisanData.user?.lastName,
        email: artisanData.user?.email,
        phone: artisanData.user?.phoneNumber,
        imageUrl: artisanData.user?.imageUrl,
        available: artisanData.user?.isAvailable,
        specialty: artisanData.subcategories?.result?.[0]?.subcategory?.name || 'General Services',
        services: artisanData.subcategories?.result?.map((item) => item.subcategory) || [],
        location: artisanData.user?.address || 'Location not specified',
        rating: 4.5, // Default rating since not in API response
        reviewCount: 0, // Default review count since not in API response
        languages: ['English'], // Default languages since not in API response
        workPhotos: [], // Default empty array since not in API response
        reviews: [], // Default empty array since not in API response
        description:
          artisanData.subcategories?.result?.[0]?.subcategory?.description ||
          'Professional artisan ready to help with your needs.'
      }
    : null;

  useEffect(() => {
    if (artisanId && fetchArtisanById) {
      fetchArtisanById(artisanId);
    }
  }, [artisanId, fetchArtisanById]);

  console.log('Artisan State:', artisanState);
  console.log('Artisan Data:', artisan);
  console.log('Loading:', loading);
  console.log('Error:', error);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle hiring the artisan
  const handleHireArtisan = () => {
    if (artisan && dispatch) {
      dispatch({
        type: 'SET_ARTISAN_DETAILS',
        payload: {
          id: artisan.id,
          name: artisan.name,
          specialty: artisan.specialty,
          rating: artisan.rating,
          image: artisan.imageUrl,
          location: artisan.location,
          availability: artisan.available ? 'Available' : 'Not Available',
          languages: Array.isArray(artisan.languages) ? artisan.languages.join(', ') : artisan.languages || 'English'
        }
      });
    }
    navigate(`/customer/hire-artisan/${tab}/${artisanId}/describe`);
  };

  if (loading) {
    return <div className="p-6">Loading artisan details...</div>;
  }
  const hasError = error && (error.message || error.error || (typeof error === 'string' && error.length > 0));

  if (hasError) {
    return (
      <div className="p-6">
        <Button variant="destructive-sec" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
          Back to Artisans
        </Button>
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          Error loading artisan: {error.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="p-6">
        <Button variant="destructive-sec" onClick={handleBack} leftIcon={<ArrowLeft size={20} />}>
          Back to Artisans
        </Button>
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">Artisan not found</div>
      </div>
    );
  }

  return (
    <div className="font-inter font-medium">
      <div className="">
        <p className="capitalize text-sm text-pri-norm-1">
          <Link to="/customer/artisans/all">browse artisans</Link> /{' '}
          <Link to={`/customer/artisans/${tab || 'all'}`}>{tab === 'saved' ? 'saved artisans' : 'all artisans'}</Link> /{' '}
          <span className="text-black">artisan details</span>
        </p>
      </div>

      <div className="flex items-center justify-between my-6.25 ">
        <h3 className="font-manrope text-2xl font-semibold">Artisan Details</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="capitalize" onClick={handleHireArtisan}>
            hire this artisan
          </Button>
          <Button variant="grey-sec" rightIcon={<FaRegBookmark size={20} />} className="capitalize">
            save for later
          </Button>
          <Button variant="destructive-sec" className="capitalize">
            report artisan
          </Button>
        </div>
      </div>

      <div className="flex gap-5.5">
        {/* Left Column - Main Artisan Information */}
        <div className=" flex flex-col gap-5.5 w-full max-w-[482px] ">
          <div className="h-fit bg-white rounded-xl p-7">
            {/* Profile Overview Section */}
            <div className="flex items-center justify-between">
              <h3 className="font-manrope text-xl font-semibold">Profile Overview</h3>
              <div className="flex items-center gap-4 text-pri-norm-1">
                <MessageSquareText size={24} />
                <Phone size={24} />
              </div>
            </div>

            <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

            {/* Artisan Profile Content */}
            <div className="flex justify-between gap-5">
              {/* Left side - Information */}
              <div className="flex flex-col gap-5 flex-1">
                {/* Dynamic profile items */}
                {[
                  { label: 'Artisan Name:', value: artisan.name },
                  { label: 'Specialty', value: artisan.specialty },
                  {
                    label: 'Rating',
                    custom: true,
                    render: () => (
                      <div className="flex items-center gap-2">
                        <GoStarFill size={19} className="text-warning-norm-1" />
                        <span>{artisan.rating}</span>
                        <span className="text-gray-400">({artisan.reviewCount || '0'} reviews)</span>
                      </div>
                    )
                  },
                  { label: 'Location', value: artisan.location },
                  {
                    label: 'Availability',
                    custom: true,
                    render: () => (
                      <div
                        className={`inline-flex items-center gap-2 ${
                          artisan.available ? 'bg-success-light-1' : 'bg-warning-light-1'
                        } px-3 py-1.5 rounded-full`}
                      >
                        <div
                          className={`w-3 h-3 ${
                            artisan.available ? 'bg-success-norm-1' : 'bg-warning-norm-1'
                          } rounded-full`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            artisan.available ? 'text-success-norm-3' : 'text-warning-norm-3'
                          }`}
                        >
                          {artisan.available ? 'Available Now' : 'Not Available'}
                        </span>
                      </div>
                    )
                  },
                  { label: 'Phone Number', value: artisan.phone || 'Not provided' },
                  { label: 'Email', value: artisan.email },
                  { label: 'Languages', value: artisan.languages?.join(', ') || 'English' },
                  { label: 'Description', value: artisan.description }
                ]
                  .filter((item) => item.value || item.custom)
                  .map((item, index) => (
                    <div key={index} className="flex items-center gap-6">
                      <span className="text-neu-norm-2">{item.label}</span>
                      {item.custom ? item.render() : <span>{item.value}</span>}
                    </div>
                  ))}
              </div>

              {/* Right side - Image */}
              <div className="relative">
                <FallbackImage
                  src={artisan.imageUrl}
                  alt={artisan.name}
                  className="w-26.25 h-26.25 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Biography Section */}
            <div className="mt-8 space-y-4">
              <div className="flex items-baseline">
                <span className="text-neu-norm-2">Biography</span>
              </div>
              <p className="font-medium">
                {artisan.description || 'Professional artisan ready to help with your needs.'}
              </p>
            </div>
          </div>

          <div className="h-fit bg-white rounded-xl p-7">
            {/* Pricing and Schedule Section */}
            <h3 className="font-manrope text-xl font-semibold">Pricing and Schedule</h3>

            <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

            <div className="">
              <div className="flex items-center gap-6">
                <span className="text-neu-norm-2">Estimated Pricing Range</span>
                <span className="">{artisan.priceRange}</span>
              </div>

              <p className="text-neu-norm-2 mt-4 mb-8">
                Pricing varies by job complexity and location.
                <br />
                Final quote provided after reviewing job
              </p>

              <div className="flex items-center gap-6">
                <span className="text-neu-norm-2">Availability:</span>
                <span className="">{artisan.availabilitySchedule}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Additional Information */}
        <div className="flex flex-col gap-5.25 w-full max-w-[584px]">
          {/* Services Offered Section */}
          <div className="bg-white rounded-xl p-7 h-fit">
            <h3 className="font-manrope text-xl font-semibold">Services Offered</h3>

            <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

            <div className="">
              <div className="flex items-baseline gap-8 mb-6">
                <span className="text-neu-norm-2">Major Specialty</span>
                <span className="">{artisan.specialty}</span>
              </div>

              <div className="mb-6">
                <span className="text-neu-norm-2 block mb-4">Subcategories</span>
                <div className="flex flex-wrap gap-3">
                  {artisan.services && artisan.services.length > 0 ? (
                    artisan.services.map((service, index) => (
                      <div key={index} className="bg-neu-light-1 text-neu-dark-1 px-4 py-3 rounded-lg">
                        <div className="font-medium text-sm">{service.name}</div>
                        {service.description && (
                          <div className="text-xs text-neu-norm-2 mt-1">{service.description}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-neu-norm-2">No specific services listed</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-neu-norm-2 block mb-4">Service Areas</span>
                <p className="">{artisan.location || 'Service areas not specified'}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-8">
                  <span className="text-neu-norm-2">Base Location</span>
                  <span className="">{artisan.location || 'Location not specified'}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-8">
                  <span className="text-neu-norm-2">Email Verified</span>
                  <span
                    className={`${artisanData?.user?.emailConfirmed ? 'text-success-norm-3' : 'text-warning-norm-3'}`}
                  >
                    {artisanData?.user?.emailConfirmed ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <Button
                  size="large"
                  variant="secondary"
                  className="border border-pri-norm-1 text-pri-norm-1 flex items-center gap-2"
                  onClick={() => {
                    const location = artisan.location || 'Lagos, Nigeria';
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
                      '_blank'
                    );
                  }}
                >
                  <span>View location on map</span>
                  <Map size={18} className="text-pri-norm-1" />
                </Button>
              </div>

              <div>
                <span className="text-neu-norm-2 block mb-4">Work Photos</span>
                {artisan.workPhotos && artisan.workPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {artisan.workPhotos.map((photo, index) => (
                      <div key={index} className="h-[100px] bg-gray-200 rounded-lg">
                        <img
                          src={photo}
                          alt={`work-photo-${index}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-neu-norm-2 text-center py-8 bg-neu-light-1 rounded-lg">
                    No work photos available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl p-7 h-fit">
            <div className="flex items-center justify-between">
              <h3 className="font-manrope text-xl font-semibold">Recent Reviews</h3>
              <Button variant="secondary" rightIcon={<ChevronRight size={20} />}>
                View All
              </Button>
            </div>

            <div className="h-0.25 bg-neu-light-3 my-5.5"></div>

            <div className="">
              {artisan.reviews?.length > 0 ? (
                artisan.reviews.map((review, index) => (
                  <div key={index} className="">
                    <div className="flex items-center gap-5.5">
                      <p className="flex-1">{review.comment}</p>
                      <div className="flex items-center gap-2 px-4 py-3.25 bg-neu-light-1 rounded-full">
                        <GoStarFill size={22} className="text-warning-norm-1" />
                        <p className="font-semibold">{review.rating.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="flex-1 text-neu-norm-2">{review.user}</p>
                    </div>

                    {index !== (artisan.reviews?.length || 0) - 1 && (
                      <div className="h-0.25 bg-neu-light-3 my-5.5"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-neu-norm-2 text-center py-8">No reviews available yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerArtisanDetails;
