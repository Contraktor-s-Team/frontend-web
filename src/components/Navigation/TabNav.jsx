import React from 'react';
import { Link } from 'react-router-dom';

const TabNav = ({ tabs, activeTab, basePath, navClassName, preventDefaultOnActive = true }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className={navClassName || "flex flex-wrap items-center gap-10"}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={`${basePath}/${tab.id}`}
            className={`cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-center w-full max-w-[141px] text-sm ${
              activeTab === tab.id
                ? 'border-pri-norm-1 text-pri-norm-1'
                : 'border-transparent text-neu-dark-1 hover:text-neu-dark-2 hover:border-neu-dark-2'
            }`}
            onClick={(e) => {
              // Only prevent default if we're already on this tab and preventDefaultOnActive is true
              if (preventDefaultOnActive && activeTab === tab.id) {
                e.preventDefault();
              }
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default TabNav;
