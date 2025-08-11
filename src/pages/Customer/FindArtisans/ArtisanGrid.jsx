import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoStarFill } from 'react-icons/go';
import { MapPin } from 'lucide-react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import Button from '../../../components/Button/Button';
import FallbackImage from '../../../components/FallbackImage';

const ArtisanGrid = ({
  artisans = [],
  activeTab,
  searchQuery = '',
  categoryFilter = '',
  locationFilter = '',
  onClearFilters
}) => {
  const navigate = useNavigate();

  if (artisans.length === 0) {
    return (
      <div className="text-center py-10 w-full col-span-full">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No artisans found</h3>
        <p className="text-gray-500">
          {searchQuery || categoryFilter || locationFilter
            ? 'Try adjusting your search or filter criteria.'
            : 'There are currently no artisans available. Please check back later.'}
        </p>
        {(searchQuery || categoryFilter || locationFilter) && onClearFilters && (
          <button onClick={onClearFilters} className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {artisans.map((artisan) => (
        <div key={artisan.id} className="flex flex-col gap-3.5 bg-white rounded-lg shadow-md p-4">
          <div className="relative group">
            <Link to={`/customer/artisans/${activeTab}/${artisan.id}`} className="cursor-pointer">
              <FallbackImage src={artisan.image} alt={artisan.name} className="w-full h-45.5 object-cover rounded-xl" />

              <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 shadow-sm flex items-center gap-2">
                <GoStarFill size={12} className="text-warning-norm-1" />
                <span className="text-xs font-medium text-gray-900">{artisan.rating}</span>
              </div>

              <div className="absolute top-0 left-0 w-full h-full rounded-xl group-hover:bg-pri-norm-1/50"></div>
            </Link>

            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 cursor-pointer"
              onClick={() => navigate(`/customer/hire-artisan/${activeTab}/${artisan.id}`)}
            >
              <h3 className="capitalize text-white text-2xl">hire</h3>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full">
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <div className="">
                  <h3 className="font-semibold">{artisan.name}</h3>
                  <p className="text-sm">{artisan.specialty}</p>
                </div>

                <button className="cursor-pointer flex flex-col justify-center items-center text-pri-norm-1 border border-neu-light-3 h-8 w-8 rounded-full hover:text-pri-norm-2 hover:border-pri-norm-2 active:scale-95 transition-all">
                  {artisan.saved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
                </button>
              </div>

              <div className="flex gap-2.25 flex-wrap items-center">
                {artisan.services.slice(0, 3).map((service) => (
                  <span
                    key={service}
                    className="inline-flex text-xs text-neu-dark-1 bg-neu-light-1 px-3 py-1.5 rounded-full whitespace-nowrap"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6.5 space-y-6.5">
              <div className="flex gap-2.5 items-center">
                <MapPin size={16} className="text-pri-norm-1" />
                <p className="text-sm text-pri-dark-2">{artisan.location}</p>
              </div>

              <div className="flex gap-2">
                <div
                  className={`flex items-center gap-2 ${
                    artisan.available ? 'bg-success-light-1' : 'bg-warning-light-1'
                  } px-4.25 py-2 w-fit rounded-full`}
                >
                  <div
                    className={`w-3.5 h-3.5 ${
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

                <Button
                  variant="primary"
                  className="w-fit px-5 py-2.5"
                  onClick={() => navigate(`/customer/hire-artisan/${activeTab}/${artisan.id}`)}
                >
                  Hire
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtisanGrid;
