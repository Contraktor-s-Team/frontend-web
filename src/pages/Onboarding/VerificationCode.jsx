import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import AuthSidePanel from '../../components/Layout/AuthSidePanel';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoaderComp from '../../assets/animation/loader';

const VerificationCode = () => {
  const { forgotPassword, validate, state: authState } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    setErrors(false);
    try {
      const userData = {
        email: email,
        code: verificationCode
      };
      await validate(
        userData,
        () => {
          navigate('/create-new-password', { state: { email, verificationCode } });
        },
        () => {
          setErrors(true);
        }
      );
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    const emailToUse = { email };
    if (!emailToUse) {
      console.error('No email found to resend code');
      return;
    }
    try {
      await forgotPassword(emailToUse);
    } catch (error) {
      console.error('Resend code failed:', error);
    }
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

  const isCodeComplete = code.every((digit) => digit !== '');

  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <AuthSidePanel
        className="hidden md:flex"
        currentSlide={1} // Set to 1 for second step (0-indexed)
      />

      <div className="px-2 py-6 lg:px-8 lg:py-[24px] xl:py-[60px] w-full md:w-[40%]">
        <div className="w-full mb-10">
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900">Enter Verification Code</h2>
          <p className="font-inter mt-4 font-medium text-[#101928] lg:text-sm xl:text-base  ">
            We've sent a 6-digit code to <span className="font-semibold">example@email.com</span>.
          </p>
          <p className="font-inter">Enter it below to continue.</p>
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
        <div className="w-full max-w-[546px] mt-[40px]">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <div className="flex space-x-3 mb-10">
                {[0, 1, 2, 3, 4, 5].map((index) => (
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
                        className="w-[50px] h-[50px] lg:w-[50px] lg:h-[50px] xl:w-[83px] xl:h-[80px]  absolute inset-0 text-center text-3xl font-semibold border border-gray-300 rounded-lg focus:border-blue-500 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 box-border"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-left font-inter font-medium text-[#101928] text-base">
                <span className="">Didn't receive a code? </span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-blue-500 hover:text-blue-700 font-medium transition-colors focus:outline-none"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="text-gray-500">Resend in {countdown}s</span>
                )}
              </div>
            </div>

            <Button
              size="large"
              type="submit"
              variant="primary"
              className="w-full py-3 font-semibold"
              disabled={!isCodeComplete || authState.validate.loading}
            >
              {authState.validate.loading ? <LoaderComp /> : ' Verify Code'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStoreToProps = (state) => {
  console.log(state);
  return {
    loading: state?.reValidate?.loading,
    error: state?.reValidate?.error,
    data: state?.reValidate.data
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: (poststate, history, errors) => dispatch(forgotPasswordAction(poststate, history, errors)),
    validate: (poststate, history, errors) => dispatch(validateAction(poststate, history, errors))
  };
};

export default VerificationCode;
