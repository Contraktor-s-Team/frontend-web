import React from 'react';
import Button from '../../../components/Button';

const EmailVerification = ({ 
  code, 
  onCodeChange, 
  onKeyDown, 
  onResendCode, 
  onNext,
  isCodeComplete 
}) => {
  return (
    <div className='mt-[61px]'>
      <div className="md:w-[422px]">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Verify Your Email Address</h3>
        <p className="font-inter font-medium text-[#101928] mt-4">
          We've sent a 4-digit code to your inbox. Enter it here to activate your account.
        </p>
      </div>

      <div className="md:w-[546px] mt-[61px]">
      <div className="flex space-x-3">
        {[...Array(4)].map((_, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength="1"
            value={code[index] || ''}
            onChange={(e) => onCodeChange(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className="w-[82px] h-[80px] md:w-[126px] md:h-[123px] text-center text-3xl font-semibold border-[2px] border-[#DFE2E7] rounded-[10px] focus:border-[#0091F0] focus:outline-none transition-colors"
          />
        ))}
      </div>
      
      <div className="mt-[44px] text-left font-inter font-medium text-[#101928] text-base">
        <span className="">Didn't receive a code? </span>
        <button 
          type="button"
          onClick={onResendCode}
          className="text-blue-500 hover:text-blue-700 font-medium transition-colors focus:outline-none"
        >
          Resend Code
        </button>
      </div>
      
      <Button 
        size='large'
        variant="secondary" 
        className="w-full mt-[38px] py-[11px]" 
        onClick={onNext}
        disabled={!isCodeComplete}
      >
        Verify Email
      </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
