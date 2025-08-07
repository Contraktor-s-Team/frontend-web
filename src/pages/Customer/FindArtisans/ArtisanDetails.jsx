import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Map,
  MessageSquareText,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { GoStarFill } from 'react-icons/go';
import Button from '../../../components/Button/Button';
import Avatar from '/img/avatar1.jpg';
import { FaRegBookmark } from 'react-icons/fa6';
import { connect, useDispatch } from 'react-redux';
import { setArtisanDetails } from '../../../redux/slices/hireArtisanSlice';
import { getArtisanIdAction } from '../../../redux/Artisan/ArtisanAction';

const ArtisanDetails = ({
  getArtisan,
  data,
  loading: artisanLoading,
  error
}) => {
  const { artisanId, tab } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Transform API data to match UI expectations
  const transformArtisanData = (apiData) => {
    if (!apiData || !apiData.user) return null;

    const user = apiData.user;
    const subcategories = apiData.subcategories?.result || [];
    
    // Get primary specialty from first subcategory
    const primarySpecialty = subcategories.length > 0 
      ? subcategories[0].subcategory.name 
      : 'General Services';

    // Get all service names
    const services = subcategories.map(sub => sub.subcategory.name);

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      specialty: primarySpecialty,
      rating: 4.5, // Default rating - you might want to fetch this from another endpoint
      reviewCount: 0, // Default - you might want to fetch this from another endpoint
      location: user.address || 'Location not specified',
      available: user.isActive,
      phoneNumber: user.phoneNumber || '------------',
      email: user.email,
      languages: ['English'], // Default - you might want to add this to your API
      image: user.imageUrl || Avatar,
      about: `Professional ${primarySpecialty} with years of experience in the field.`, // Default bio
      priceRange: '₦5,000 - ₦50,000', // Default - you might want to add this to your API
      availabilitySchedule: 'Monday - Saturday, 8AM - 6PM', // Default
      services: services,
      serviceAreas: 'Lagos, Nigeria', // Default - you might want to add this to your API
      workPhotos: [], // Default empty array - you might want to add this to your API
      reviews: [] // Default empty array - you might want to fetch from another endpoint
    };
  };

  // Get transformed artisan data
  const artisan = data ? transformArtisanData(data) : null;

  useEffect(() => {
    if (artisanId) {
      getArtisan(artisanId);
    }
  }, [artisanId, getArtisan]);

  console.log('API Data:', data);
  console.log('Transformed Artisan:', artisan);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle hiring the artisan
  const handleHireArtisan = () => {
    if (artisan) {
      dispatch(setArtisanDetails({
        id: artisan.id,
        name: artisan.name,
        specialty: artisan.specialty,
        rating: artisan.rating,
        image: artisan.image,
        location: artisan.location,
        availability: artisan.available ? "Available" : "Not Available",
        languages: Array.isArray(artisan.languages) ? artisan.languages.join(', ') : artisan.languages
      }));
    }
    
    navigate(`/customer/artisans/${tab}/${artisanId}/hire-artisan/describe`);
  };

  if (artisanLoading) {
    return <div className="p-6">Loading artisan details...</div>;
  }
  const hasError = error && (
    error.message || 
    error.error || 
    (typeof error === 'string' && error.length > 0)
  );

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
          <Link to={`/customer/artisans/${artisanId}`}>{artisanId === '1' ? 'all artisans' : 'saved artisans'}</Link> /{' '}
          <span className="text-black">artisan details</span>
        </p>
      </div>

      <div className="flex items-center justify-between my-6.25 ">
        <h3 className="font-manrope text-2xl font-semibold">Artisan Details</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className='capitalize' onClick={handleHireArtisan}>hire this artisan</Button>
          <Button variant="grey-sec" rightIcon={<FaRegBookmark size={20} />} className='capitalize'>
            save for later
          </Button>
          <Button variant="destructive-sec" className='capitalize'>report artisan</Button>
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
                  { label: 'Phone Number', value: artisan.phoneNumber },
                  { label: 'Email', value: artisan.email },
                  { label: 'Languages', value: artisan.languages?.join(', ') || 'English' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-6">
                    <span className="text-neu-norm-2">{item.label}</span>
                    {item.custom ? item.render() : <span>{item.value}</span>}
                  </div>
                ))}
              </div>

              {/* Right side - Image */}
              <div className="relative">
                <img
                  src={artisan.image}
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
                {artisan.about}
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
                  {artisan.services.length > 0 ? (
                    artisan.services.map((service, index) => (
                      <span key={index} className="bg-neu-light-1 text-neu-dark-1 px-4 py-2 rounded-full text-sm">
                        {service}
                      </span>
                    ))
                  ) : (
                    <span className="text-neu-norm-2">No specific services listed</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-neu-norm-2 block mb-4">Service Areas</span>
                <p className="">{artisan.serviceAreas}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-8">
                  <span className="text-neu-norm-2">Base Location</span>
                  <span className="">{artisan.location}</span>
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
                {artisan.workPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {artisan.workPhotos.map((photo, index) => (
                      <div key={index} className="h-[100px] bg-gray-200 rounded-lg">
                        <img src={photo} alt={`work-photo-${index}`} className="w-full h-full object-cover rounded-lg" />
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

                    {index !== artisan.reviews.length - 1 && <div className="h-0.25 bg-neu-light-3 my-5.5"></div>}
                  </div>
                ))
              ) : (
                <div className="text-neu-norm-2 text-center py-8">
                  No reviews available yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStoreToProps = (state) => {
  console.log('Redux State:', state);
  return {
    loading: state?.artisan?.loading,
    data: state?.artisan?.data,
    error: state?.artisan?.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtisan: (id) => dispatch(getArtisanIdAction(id)),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(ArtisanDetails);