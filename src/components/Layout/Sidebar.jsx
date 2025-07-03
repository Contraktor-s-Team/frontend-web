import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, FileText, MessageSquareText, Disc, Headset } from 'lucide-react';
import logo from '/img/logo.png';

const Sidebar = () => {
  const location = useLocation();
  // Check if the current path starts with the given path to support nested routes
  const isActive = path => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      icon: <Home size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <Search size={20} strokeWidth={isActive('/artisans') ? 2.5 : 2} />,
      label: 'Find Artisans',
      path: '/artisans'
    },
    {
      icon: <FileText size={20} strokeWidth={isActive('/jobs') ? 2.5 : 2} />,
      label: 'My Jobs',
      path: '/jobs'
    },
    {
      icon: <MessageSquareText size={20} strokeWidth={isActive('/messages') ? 2.5 : 2} />,
      label: 'Messages',
      path: '/messages',
      notification: 1
    }
  ];

  const bottomNavItems = [
    {
      icon: <Disc size={20} strokeWidth={isActive('/settings') ? 2.5 : 2} />,
      label: 'Profile & Settings',
      path: '/settings'
    },
    {
      icon: <Headset size={20} strokeWidth={isActive('/help') ? 2.5 : 2} />,
      label: 'Help Centre',
      path: '/help'
    }
  ];

  const renderNavItem = item => (
    <Link
      key={item.path}
      to={item.path}
      className={`relative hidden md:flex items-center pl-9 pr-4 py-5 font-medium transition-colors ${
        isActive(item.path) ? 'text-pri-dark-3 bg-pri-light-1 font-semibold' : 'hover:bg-pri-light-2 font-medium'
      }`}
    >
      {isActive(item.path) && <div className="absolute left-0 top-0 bottom-0 w-1 bg-pri-norm-1 rounded-r"></div>}
      <span className={`mr-3 ${isActive(item.path) ? 'text-pri-norm-1' : 'text-gray-500'}`}>{item.icon}</span>
      <span>{item.label}</span>
      {item.notification && (
        <span className="font-manrope flex items-center justify-center ml-auto bg-sec-norm-1 text-white font-semibold h-6 w-6 rounded-full">
          {item.notification}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex font-inter w-[280px] bg-white h-screen flex-col border-r border-gray-100">
        {/* Logo */}
        <div className="my-8 px-[30px]">
          <div className="flex items-center">
            <img src={logo} alt="Contraktor" className="h-8 w-auto" />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="">{navItems.map(renderNavItem)}</nav>

        {/* Bottom Navigation */}
        <div className="mt-auto">{bottomNavItems.map(renderNavItem)}</div>

        {/* Gradient Decoration */}
        <div className="h-[264px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mt-3 m-3"></div>
      </div>

      {/* Responsive Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 h-20">
        <div className="flex justify-around items-center w-full h-full px-1 md:px-4">
          {navItems.concat(bottomNavItems.filter(item => item.label !== 'Help Centre')).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`
          flex items-center justify-center w-full h-full
          flex-col
          transition-colors
          ${isActive(item.path) ? 'text-pri-norm-1' : 'text-gray-500'}
        `}
            >
              <div className="relative p-2 rounded-lg hover:bg-gray-50">
                {React.cloneElement(item.icon, {
                  size: 24,
                  strokeWidth: isActive(item.path) ? 2.5 : 2
                })}
                {item.notification && (
                  <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 h-4 w-4 bg-sec-norm-1 text-white text-[10px] rounded-full flex items-center justify-center">
                    {item.notification}
                  </span>
                )}
              </div>
              <span className="block text-[10px] mt-1 font-medium">
                {item.label === 'Profile & Settings' ? 'Profile' : item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
