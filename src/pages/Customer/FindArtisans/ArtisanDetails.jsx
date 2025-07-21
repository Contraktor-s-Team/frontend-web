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
import { useDispatch } from 'react-redux';
import { setArtisanDetails } from '../../../redux/slices/hireArtisanSlice';

const ArtisanDetails = () => {
  const { artisanId, tab } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanDetails = async () => {
      try {
        // In a real app, you would fetch data from an API with the artisanId
        const response = await fetch('/artisans.json');
        const artisans = await response.json();
        console.log('Artisans data:', artisans);
        console.log('Looking for artisanId:', artisanId, 'type:', typeof artisanId);

        // Find the artisan with matching ID (convert string ID from URL to number for comparison)
        const foundArtisan = artisans.find((a) => a.id === parseInt(artisanId, 10));

        setArtisan(foundArtisan || null);
      } catch (error) {
        console.error('Error fetching artisan details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanDetails();
  }, [artisanId]);

  console.log(artisan, artisanId);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle hiring the artisan
  const handleHireArtisan = () => {
    // Set the selected artisan in Redux store
    if (artisan) {
      dispatch(setArtisanDetails({
        id: artisan.id,
        name: artisan.name,
        specialty: artisan.specialty,
        rating: artisan.rating,
        image: artisan.image || Avatar,
        location: artisan.location,
        availability: artisan.availability || "Available",
        languages: Array.isArray(artisan.languages) ? artisan.languages.join(', ') : artisan.languages
      }));
    }
    
    // Navigate to the hire artisan workflow with the new route structure
    navigate(`/artisans/${tab}/${artisanId}/hire-artisan/describe`);
  };

  if (loading) {
    return <div className="p-6">Loading artisan details...</div>;
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
                        <span className="text-gray-400">({artisan.reviewCount || '52'} reviews)</span>
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
                  { label: 'Phone Number', value: artisan.phoneNumber || '------------' },
                  { label: 'Email', value: artisan.email || '-------------' },
                  { label: 'Languages', value: artisan.languages?.join(', ') || 'English, Igbo' }
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
                  src={artisan.image || Avatar}
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
                  {artisan.services.map((service, index) => (
                    <span key={index} className="bg-neu-light-1 text-neu-dark-1 px-4 py-2 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-neu-norm-2 block mb-4">Service Areas</span>
                <p className="">{artisan.serviceAreas || 'Yaba, Surulere, Mushin, Ikeja'}</p>
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
                    const location = artisan.location || 'Yaba, Lagos';
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
                <div className="grid grid-cols-3 gap-3">
                  {(artisan.workPhotos || Array(3).fill('/img/placeholder.jpg')).map((photo, index) => (
                    <div key={index} className="h-[100px] bg-gray-200 rounded-lg">
                      <img src={photo} alt={`work-photo-${index}`} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
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
              {artisan.reviews?.map((review, index) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanDetails;
