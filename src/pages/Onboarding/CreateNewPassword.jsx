import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import AuthSidePanel from "../../components/Layout/AuthSidePanel";
import { TextInput } from "../../components/Form";
import SuccessModal from "../../components/Modal/SuccessModal";

const CreateNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    // TODO: Implement password reset logic
    console.log("New password:", newPassword);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success modal instead of navigating directly
      setShowSuccessModal(true);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <AuthSidePanel 
        className="hidden md:flex" 
      />
      
      <div className="px-6 py-12 lg:px-8 sm:w-full sm:max-w-[526px]">
        <div className="w-full mb-10">
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Create a New Password
          </h2>
          <p className="font-inter mt-4">
            Set a strong password you haven't used before.
          </p>
        </div>

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
                disabled={!newPassword || !confirmPassword || isLoading}
              >
                Reset Password
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
        buttonText="Browse Artisans"
        onButtonClick={() => navigate('/')}
      />
    </div>
  );
};

export default CreateNewPassword;
