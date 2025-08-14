import { useState } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Trash2 } from 'lucide-react';
import ActionModel from '../../../components/Modal/ActionModel';
import axios from 'axios';

function SecurityAndLogin() {
  const [enabled, setEnabled] = useState(true);

  const [showActionModel, setShowActionModel] = useState(false);

  // Password form state including confirmPassword
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success or error message

  // Update input values in state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Cancel resets the form and message
  const handleCancel = () => {
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setMessage(null);
  };

  // Submit handler with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Basic validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    try {
      setLoading(true);

      // Get token from localStorage (adjust if needed)
      const authData = JSON.parse(localStorage.getItem('auth'));
      const token = authData?.token;

      await axios.put(
        'https://distrolink-001-site1.anytempurl.com/api/Users/update-password',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update password.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[451px]">
      <h1 className="font-semibold capitalize">Change your password</h1>

      <div className="w-full my-5 border-b-2 border-neu-light-2"></div>

      <form onSubmit={handleSubmit} className="space-y-5.5">
        <TextInput
          label="Current Password"
          type="password"
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
        />
        <TextInput
          label="New Password"
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleChange}
          placeholder="Enter your new password"
        />
        <TextInput
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
        />

        {message && (
          <p className={`mt-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            variant="grey-sec"
            className="capitalize px-6 py-3.5"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="capitalize px-6 py-3.5"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>

      <div className="py-10 border-y-2 border-neu-light-2 my-10">
        <div className="flex items-center justify-between w-full max-w-md px-4 py-2">
          <span>Two-Factor Authentication</span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEnabled(!enabled)}
              type="button"
              aria-pressed={enabled}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                enabled ? 'bg-success-norm-1' : 'bg-neu-norm-1'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <span className="text-gray-900 text-sm font-medium">{enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>

      <Button
        variant="destructive-sec"
        rightIcon={<Trash2 size={20} />}
        className="capitalize mt-15 p-4"
        type="button"
      >
        Delete my account
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