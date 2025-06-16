import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';

const SuccessMessage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Redirect to dashboard or home page
    navigate('/dashboard');
  };

  return (
    <div className="text-center py-10">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <FiCheckCircle className="text-green-500 text-5xl" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Created Successfully!</h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your account has been created successfully. You can now start using our platform to find the best artisans for your needs.
      </p>
      
      <div className="space-y-4 max-w-md mx-auto">
        <p className="text-sm text-gray-500">
          We've sent a verification link to your email. Please verify your email to unlock all features.
        </p>
        
        <Button 
          variant="secondary" 
          className="w-full mt-6"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
        
        <p className="text-sm text-gray-500">
          Didn't receive the email?{' '}
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => console.log('Resend verification email')}
          >
            Resend Email
          </button>
        </p>
      </div>
    </div>
  );
};

export default SuccessMessage;
