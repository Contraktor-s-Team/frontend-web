import React, { useState } from 'react';
import { MapPin, Bell, ChevronDown, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import TextInput from '../Form/TextInput';
import Button from '../Button/Button';
import avatar from '/img/avatar1.jpg';

const TopBar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [userLocation] = useState('Ikeja GRA, Lagos');
  const location = useLocation();

  return (
    <header className="font-inter bg-white border-b border-gray-100 px-6 py-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full sm:max-w-md">
          <TextInput
            placeholder="Search for artisans, services, etc"
            leadingIcon={<Search className="h-4 w-4 text-gray-400" />}
            className="w-full"
            inputClassName="rounded-full"
          />
        </div>

        <div className="flex items-center gap-9 w-full sm:w-auto">
          {/* Location */}
          <div className="">
            <Button variant="secondary" size="small" leftIcon={<MapPin size={20} />}>
              {userLocation}
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Link
              to="/notifications"
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

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center justify-between gap-2 p-1.5 w-[269px] pr-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="flex items-center gap-4">
                <img className="h-8 w-8 rounded-full border border-gray-200" src={avatar} alt="User avatar" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight">Muhamad Aharasa</p>
                  <p className="text-xs text-gray-500 leading-tight">muhamad@example.com</p>
                </div>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            {isProfileOpen && (
              <div
                className="origin-top-right absolute right-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 py-1"
                style={{
                  boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)'
                }}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Muhamad Aharasa</p>
                  <p className="text-xs text-gray-500 mt-1">muhamad@example.com</p>
                </div>
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
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
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </a>
                </div>
                <div className="py-1 border-t border-gray-100">
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
