import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import AuthSidePanel from '../../components/Layout/AuthSidePanel';
import { TextInput } from '../../components/Form';
import SuccessModal from '../../components/Modal/SuccessModal';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoaderComp from '../../assets/animation/loader';

const CreateNewPassword = () => {
  const { resetPassword, state: authState } = useAuth();
  const [errors, setErrors] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const code = location.state?.verificationCode;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setErrors(false);
    try {
      const userData = {
        email: email,
        code: code,
        newPassword
      };
      await resetPassword(
        userData,
        () => {
          navigate('/');
        },
        () => {
          setErrors(true);
        }
      );
    } catch (error) {
      console.error('Reset password failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <AuthSidePanel className="hidden md:flex" />

      <div className="x-2 py-6 lg:px-8 lg:py-[24px] xl:py-[60px] w-full md:w-[40%]">
        <div className="w-full mb-10">
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900">Create a New Password</h2>
          <p className="font-inter mt-4">Set a strong password you haven't used before.</p>
        </div>
        {errors && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="w-full max-w-[546px] mt-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput
              id="new-password"
              name="newPassword"
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter a new password"
              className="w-full"
            />

            <TextInput
              id="confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full justify-center"
                loading={isLoading}
                disabled={!newPassword || !confirmPassword || authState.resetPassword.loading}
              >
                {authState.resetPassword.loading ? <LoaderComp /> : 'Reset Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Password Reset Successful!"
        message="You can now log in with your new password."
        primaryButtonText="Browse Artisans"
        onPrimaryButtonClick={() => navigate('/dashboard')}
      />
    </div>
  );
};

const mapStoreToProps = (state) => {
  console.log(state);
  return {
    loading: state?.resetPassword?.loading,
    error: state?.resetPassword?.error,
    data: state?.resetPassword.data
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (poststate, history, errors) => dispatch(resetPasswordAction(poststate, history, errors))
  };
};

export default CreateNewPassword;
