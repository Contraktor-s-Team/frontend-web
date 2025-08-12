import { useState } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Trash2 } from 'lucide-react';

function SecurityAndLogin() {
  const [enabled, setEnabled] = useState(true);

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

      <Button variant="destructive-sec" rightIcon={<Trash2 size={20} />} className="capitalize mt-15 p-4">
        delete my account
      </Button>
    </div>
  );
}

export default SecurityAndLogin;
