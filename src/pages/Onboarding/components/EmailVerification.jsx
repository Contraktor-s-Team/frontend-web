import React, { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import LoaderComp from '../../../assets/animation/loader';

const EmailVerification = ({ 
  code, 
  onCodeChange, 
  onKeyDown, 
  onResendCode, 
  isCodeComplete,
  onNext,
  isError,
  confirmLoading,
  confirmError
}) => {
  const [countdown, setCountdown] = useState(40);
  const [canResend, setCanResend] = useState(false);
  console.log('EmailVerification component rendered with code:', confirmError);
  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (isCodeComplete) {
      onNext(e);
    }
  }
  const handleResend = (e) => {
    onResendCode(e);
    setCountdown(40); // Restart countdown
    setCanResend(false);
  };
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  return (
    <div className=''>
      <div className="">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl xl:text-3xl">Verify Your Email Address</h3>
        <p className="font-inter font-medium text-[#101928] text-sm md:text-base t5 mt-4">
          We've sent a 4-digit code to your inbox. Enter it here to activate your account.
        </p>
      </div>
      {isError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>{confirmError}</p>
                </div>  
            </div>
          </div>
        </div>
      )}
      <div className="mt-[61px]">
      <div className="flex space-x-3">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength="1"
            value={code[index] || ''}
            onChange={(e) => onCodeChange(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className="w-[50px] h-[50px] lg:w-[50px] lg:h-[50px] xl:w-[83px] xl:h-[80px] text-center text-3xl font-semibold border-[2px] border-[#DFE2E7] rounded-[10px] focus:border-[#0091F0] focus:outline-none transition-colors"
          />
        ))}
      </div>
      
      <div className="mt-[44px] text-left font-inter font-medium text-[#101928] text-base">
        <span className="">Didn't receive a code? </span>
        {canResend ? (
          <button 
            type="button"
            onClick={handleResend}
            className="text-blue-500 hover:text-blue-700 font-medium transition-colors focus:outline-none"
          >
            Resend Code
          </button>
        ) : (
          <span className="text-gray-500">Resend in {countdown}s</span>
        )}
      </div>
      
      <Button 
        size='large'
        variant="secondary" 
        className="w-full mt-[38px] py-[11px] h-[52px]" 
        onClick={handleSubmit}
        disabled={!isCodeComplete || confirmLoading}
      >
        {confirmLoading ? (
          <LoaderComp/>
        ) : (
          "Verify Email"
        )}  
      </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
