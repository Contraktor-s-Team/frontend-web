import React, { useState } from "react";
import Button from "../../components/Button";
import AuthSidePanel from "../../components/Layout/AuthSidePanel";
import { Link } from "react-router-dom";

const VerificationCode = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isResending, setIsResending] = useState(false);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle verification logic here
    const verificationCode = code.join('');
    console.log("Verification code:", verificationCode);
  };

  const handleResendCode = () => {
    setIsResending(true);
    // Handle resend code logic here
    console.log("Resending verification code...");
    
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <AuthSidePanel 
        className="hidden md:flex" 
        currentSlide={1} // Set to 1 for second step (0-indexed)
      />
      
      <div className="px-6 py-12 lg:px-8 sm:w-full sm:max-w-[526px]">
        <div className="w-full mb-10">
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Enter Verification Code
          </h2>
          <p className="font-inter mt-4">
            We've sent a 6-digit code to <span className="font-semibold">example@email.com</span>.
          </p>
          <p className="font-inter">Enter it below to continue.</p>

        </div>

        <div className="w-full max-w-[546px] mt-[69px]">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="w-full">
                    <div className="relative pb-[100%] w-full">
                      <input
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={code[index]}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="absolute inset-0 w-full h-full text-center text-3xl font-semibold border border-gray-300 rounded-lg focus:border-blue-500 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 box-border"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                >
                  {isResending ? 'Sending...' : "Didn't receive a code? "}
                  {!isResending && (
                    <span className="text-[#0091F0] hover:underline font-medium">
                      Resend Code
                    </span>
                  )}
                </button>
              </div>
            </div>

            <Button
            size='large'
              type="submit"
              variant="secondary"
              className="w-full py-3 font-semibold"
              disabled={!isCodeComplete}
            >
              Verify Code
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
