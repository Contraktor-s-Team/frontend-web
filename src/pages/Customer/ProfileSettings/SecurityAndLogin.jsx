import React, { useState } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Trash2 } from 'lucide-react';
import ActionModel from '../../../components/Modal/ActionModel';

const sessions = [
  {
    browser: 'Brave',
    os: 'Mac OS',
    location: 'Lagos, Nigeria',
    status: 'Current Session',
    icon: '/browserIcon.png',
    countryIcon: '/nigeriaIcon.png'
  },
  {
    browser: 'Chrome',
    os: 'Windows 11 PC',
    location: 'Abuja, Nigeria',
    status: '2 days ago',
    icon: '/chromeIcon.png',
    countryIcon: '/nigeriaIcon.png'
  },
  {
    browser: 'Safari',
    os: 'Mac OS',
    location: 'Lagos, Nigeria',
    status: '1 month ago',
    last_active: '1 month ago',
    icon: '/safariIcon.png',
    countryIcon: '/nigeriaIcon.png'
  }
];

function SecurityAndLogin() {
  const [enabled, setEnabled] = useState(true);

  const [showActionModel, setShowActionModel] = useState(false);

  return (
    <div className="w-full max-w-203.75">
      <h1 className="font-semibold capitalize">change your password</h1>

      <div className="w-full my-5 border-b-2 border-neu-light-2"></div>

      <div className="space-y-5.5">
        <TextInput label="Current Password" type="password" placeholder="Enter your current password" />
        <TextInput label="New Password" type="password" placeholder="Enter your new password" />
      </div>

      <div className="flex gap-3 mt-8.75">
      <Button variant="grey-sec" className="capitalize px-6 py-3.5">
          cancel
        </Button>

        <Button variant="primary" className="capitalize px-6 py-3.5">
          save changes
        </Button>
      </div>

      <div className="py-10 border-y-2 border-neu-light-2 my-10">
        <div className="flex items-center justify-between w-full max-w-md px-4 py-2">
          <span className="">Two-Factor Authentication</span>

          <div className="flex items-center space-x-2">
            {/* Toggle Switch */}
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-11 h-6 flex items-center bg-${
                enabled ? 'success-norm-1' : 'neu-norm-1'
              } rounded-full p-1 transition-colors duration-300`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>

            {/* Status Label */}
            <span className="text-gray-900 text-sm font-medium">{enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>

      <div className="">
        <h3 className="font-semibold capitalize mb-5">your sessions</h3>

        <div className="flex flex-col">
          {sessions.map((session, index) => (
            <div key={index} className="py-5 border-y-2 border-neu-light-2">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <div className="bg-neu-light-2 flex h-12 w-12 rounded-lg">
                    <img src={session.icon} alt="" className="h-9 w-9 object-cover mx-auto my-auto" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      {session.browser} on {session.os}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3 ">
                    <div className="w-7 h-7 rounded-full bg-green-900">
                      <img src={session.countryIcon} alt="" className="w-full h-full object-cover rounded-full" />
                    </div>

                    <p>{session.location}</p>
                  </div>

                  <div className="">
                    <p className="font-normal italic">{session.status}</p>
                  </div>

                  <Button variant="text-destructive" iconOnly leftIcon={<Trash2 size={20} />} className=""></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="destructive-sec" rightIcon={<Trash2 size={20} />} className="capitalize mt-15 p-4" onClick={() => setShowActionModel(true)}>
        delete my account
      </Button>

      <ActionModel
        isOpen={showActionModel}
        onClose={() => setShowActionModel(false)}
        isSuccess={false}
        title="Delete Account"
        message="This action will permanently remove your account and all associated data. Are you sure you want to proceed?"
        primaryButtonText="Delete Account"
        // onPrimaryButtonClick={}
      />
    </div>
  );
}

export default SecurityAndLogin;
