import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoStarFill } from 'react-icons/go';
import { MapPin } from 'lucide-react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import Button from '../../components/Button/Button';

const ArtisanGrid = ({ artisans, activeTab }) => {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {artisans?.map((artisan) => (
        <div key={artisan.id} className="flex flex-col gap-3.5 bg-white rounded-lg shadow-md p-4">
          <Link to={`/artisans/${activeTab}/${artisan.id}`} className="relative group cursor-pointer">
            <img src={artisan.image} alt={artisan.name} className="w-full h-45.5 object-cover rounded-xl" />

            <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 shadow-sm flex items-center gap-2">
              <GoStarFill size={12} className="text-warning-norm-1" />
              <span className="text-xs font-medium text-gray-900">{artisan.rating}</span>
            </div>

            <div className="absolute top-0 left-0 w-full h-full rounded-xl group-hover:bg-pri-norm-1/50"></div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0">
              <h3 className="capitalize text-white text-2xl">hire</h3>
            </div>
          </Link>

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
                  <span key={service} className="inline-flex text-xs text-neu-dark-1 bg-neu-light-1 px-3 py-1.5 rounded-full whitespace-nowrap">
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
                  onClick={() => navigate(`/artisans/${activeTab}/${artisan.id}`)}
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
