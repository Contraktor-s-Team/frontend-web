import React from 'react';
import TabNav from '../../../components/Navigation/TabNav';
import { useParams } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
// Import other components when ready
import AddressLocation from './AddressLocation';
import SecurityAndLogin from './SecurityAndLogin';
import Notifications from './Notifications';
import PaymentSettings from './PaymentSettings';

const tabComponents = {
  personalInfo: PersonalInfo,
  addressLocation: AddressLocation,
  securityLogin: SecurityAndLogin,
  notifications: Notifications,
  paymentSettings: PaymentSettings
};

const ProfileSettings = () => {
  const { tab: activeTab = 'personalInfo' } = useParams();

  const tabs = [
    { id: 'personalInfo', label: 'Personal Information' },
    { id: 'addressLocation', label: 'Address & Location' },
    { id: 'securityLogin', label: 'Security & Login' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'paymentSettings', label: 'Payment Settings' }
  ];

  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="font-inter font-medium px-2 sm:px-4 md:px-8">
      <h1 className="font-manrope text-2xl font-semibold text-gray-900 mb-4">Profile & Settings</h1>

      <div className="w-full max-w-full md:max-w-4xl">
        <TabNav
          tabs={tabs}
          activeTab={activeTab}
          basePath="/customer/profile&settings"
          navClassName="flex flex-wrap items-center justify-between"
        />
      </div>

      <div className="mt-6 md:mt-8">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default ProfileSettings;
