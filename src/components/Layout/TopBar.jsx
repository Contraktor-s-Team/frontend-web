import { useEffect, useState } from 'react';
import { MapPin, Bell, Search, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import TextInput from '../Form/TextInput';
import Button from '../Button/Button';
import avatar from '/img/avatarnew.png';

const TopBar = ({ logout, userType = 'customer', data }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [userLocation, setUserLocation] = useState('Detecting location...');
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const location = useLocation();

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const geoApiKey = import.meta.env.VITE_GEOLOCATION_KEY;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);
            // Fetch readable address from coordinates
            fetchLocationName(lat, lng);
          },
          (error) => {
            console.error('Error getting location:', error);
            setUserLocation('Location unavailable');
            setIsLocationLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      } else {
        setUserLocation('Location not supported');
        setIsLocationLoading(false);
      }
    } catch (error) {
      console.error('Error with geolocation:', error);
      setUserLocation('Location error');
      setIsLocationLoading(false);
    }
  };

  const fetchLocationName = async (lat, lng) => {
    if (!geoApiKey) {
      console.warn('Google Maps API key not found');
      setUserLocation('Location unavailable');
      setIsLocationLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geoApiKey}`
      );

      const data = await response.json();

      console.log('Geocoding response:', data);

      if (data.status === 'OK' && data.results.length > 0) {
        const locationString = extractReadableLocation(data.results);
        setUserLocation(locationString);
      } else {
        console.error('Geocoding failed:', data.status);
        setUserLocation('Location unavailable');
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setUserLocation('Location unavailable');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const extractReadableLocation = (results) => {
    for (const result of results) {
      const components = result.address_components;

      const locality = components.find(
        (comp) => comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
      );

      const state = components.find((comp) => comp.types.includes('administrative_area_level_1'));

      if (locality && state) {
        return `${locality.long_name}, ${state.long_name}`;
      }

      if (state) {
        const area = components.find(
          (comp) =>
            comp.types.includes('administrative_area_level_2') || comp.types.includes('administrative_area_level_3')
        );

        if (area) {
          return `${area.long_name}, ${state.long_name}`;
        }

        return state.long_name;
      }
    }

    const firstResult = results[0];
    let formatted = firstResult.formatted_address;

    const parts = formatted.split(',').slice(0, 2);
    return parts.join(',').trim();
  };

  return (
    <header className="font-inter bg-white border-b border-gray-100 px-2 sm:px-4 md:px-6 py-4 sm:py-5">
      <div className="flex w-full items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 justify-between">
        <div className="w-full max-w-full sm:w-72 md:w-96 lg:w-[420px]">
          <TextInput
            placeholder={
              userType === 'artisan' ? 'Search for jobs, clients, etc' : 'Search for artisans, services, etc'
            }
            leadingIcon={<Search className="h-4 w-4 text-gray-400" />}
            className="w-full"
            inputClassName="pr-10 rounded-full"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          <Button
            variant="secondary"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3.5 text-xs sm:text-base min-w-[120px]"
          >
            {isLocationLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Locating...</span>
              </>
            ) : (
              <>
                <MapPin size={20} />
                <span className="hidden sm:inline">{userLocation} State</span>
              </>
            )}
          </Button>

          <div className="relative flex-shrink-0">
            <Link
              to={`/${userType}/notifications`}
              state={{ backgroundLocation: location }}
              className="cursor-pointer relative p-1.5 rounded-full ring-2 ring-gray-200 hover:ring-gray-300 transition-colors block"
              onClick={() => {
                setHasUnread(false);
              }}
            >
              <Bell className="h-5 w-5 text-gray-500" />
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-sec-norm-1 rounded-full border-2 border-white"></span>
              )}
            </Link>
          </div>

          <div className="relative flex-shrink-0">
            <button
              className="flex items-center p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              <img
                className="h-8 w-8 min-w-[2rem] min-h-[2rem] rounded-full border border-gray-200 object-cover"
                src={data?.data?.imageUrl || avatar}
                alt="User avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = avatar;
                }}
              />
            </button>

            {/* Dropdown menu */}
            {isProfileOpen && (
              <div
                className="origin-top-right absolute right-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 py-1"
                style={{
                  boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)'
                }}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {data?.data?.firstName || 'User'} {data?.data?.lastName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{data?.data?.email}</p>
                </div>
                <div className="py-1">
                  <a
                    href={userType === 'artisan' ? '/artisan/profile&settings' : '/customer/profile&settings'}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </a>
                </div>
                <div
                  className="py-1 border-t border-gray-100"
                  onClick={() => {
                    logout();
                  }}
                >
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
