import React, { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import Button from '../../../components/Button';
import { Checkbox, TextInput } from '../../../components/Form';
import LoaderComp from '../../../assets/animation/loader';
import google from '../../../assets/google.png';
import facebook from '../../../assets/facebook.png';
import PasswordChecker from '../../../components/Form/PasswordChecker';
import { connect } from 'react-redux';
import { externalRegister } from '../../../redux/Auth/Register/RegisterAction';
const CreateAccountForm = ({ 
  onNext, 
  onInputChange, 
  loading, 
  error, 
  formData,
  isError,
  externalRegister
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [touched, setTouched] = useState({});
  console.log("this is error", error)
  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character";
    return "";
  };

  const handleInputChange = (field, value) => {
    onInputChange(field, value);
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate the field
    let error = "";
    if (field === "email") {
      error = validateEmail(value);
    } else if (field === "password") {
      error = validatePassword(value);
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

   // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email || "");
    const passwordError = validatePassword(formData.password || "");
    const termsError = !isTermsAccepted ? "You must accept the Terms & Conditions" : "";

    const newErrors = {
      email: emailError,
      password: passwordError,
      terms: termsError
    };

    setValidationErrors(newErrors);
    setTouched({ email: true, password: true, terms: true });

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    
    if (!hasErrors) {
      onNext(e);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      isTermsAccepted &&
      !validationErrors.email &&
      !validationErrors.password
    );
  };
  
  console.log("CreateAccountForm Rendered with error:", error);
  return (
    <div className=''>
      <div className="space-y-2">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Create Your Account</h3>
        <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Sign up in seconds by entering your basic details</p>
      </div>

      {isError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              {/* <h3 className="text-sm font-medium text-red-800">
                {typeof error === 'string' ? error : 'An error occurred'}
              </h3> */}
              {/* {typeof error === 'object' && error.data.message && ( */}
                <div className="text-sm text-red-700">
                  <p>{error}</p>
                </div>
              {/* )} */}
              {/* {typeof error === 'object' && error.errors && (
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(error.errors).map(([field, messages]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
      <form className="mt-[48px] w-full" >
        <TextInput
          id="email"
          label="Email Address"
          placeholder="Enter your email address"
          className="mb-[40px]"
          onChange={(e) => handleInputChange("email", e.target.value)}
          type="email"
          required
          value={formData.email || ""}
          isError={touched.email && validationErrors.email}
          errorMessage={validationErrors.email}
        />

        <TextInput
          id="password"
          label="Password"
          placeholder="Create a strong password"
          type="password"
          className="mb-[10px]"
          trailingIcon={<FiEye className="text-[#98A2B3] text-xl" />}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
          value={formData.password || ""}
          isError={touched.password && validationErrors.password}
          errorMessage={validationErrors.password}
        />
         {formData.password && (
          <PasswordChecker password={formData.password} />
        )}
        <div className="mt-6">
          <div className='flex items-center gap-2'>
            <Checkbox
              id="terms"
              
              checked={isTermsAccepted}
              onChange={(e) => {
                setIsTermsAccepted(e.target.checked);
                setTouched(prev => ({ ...prev, terms: true }));
                if (e.target.checked) {
                  setValidationErrors(prev => ({ ...prev, terms: "" }));
                } else {
                  setValidationErrors(prev => ({ ...prev, terms: "You must accept the Terms & Conditions" }));
                }
              }}
              required
            />
            <p className='font-inter text-sm text-[#98A2B3] font-medium'>I agree to the <span className='text-[#0091F0]'>Terms & Conditions</span> and <span className='text-[#0091F0]'>Privacy Policy</span></p>
          </div>
          {touched.terms && validationErrors.terms && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.terms}</p>
          )}
        </div>
  
        <Button 
          size='large'
          variant="secondary" 
          className="w-full mt-[38px] py-[11px] h-[52px]" 
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isFormValid()}
        >
          {loading ? (
            <LoaderComp/>
          ) : (
            "Create Account"
          )}  
        </Button>

        <hr className="mt-[38px] md:mt-[41px] mb-[38px] text-[#DFE2E7]" data-content="OR"></hr>

        <div className="md:flex md:justify-between md:gap-4">
          <Button
            size='large'
            variant="grey-sec"
            type="button"
            className="w-full justify-center gap-2 py-3 mb-[14px]"
            onClick={() => externalRegister("Google")}
          >
            <img src={google} alt="Google" className="w-5 h-5" />
            <span>Google</span>
          </Button>
          <Button
            size='large'
            variant="grey-sec"
            type="button"
            className="w-full justify-center gap-2 py-3 mb-[14px]"
            onClick={() => externalRegister("Facebook")}  
          >
            <img src={facebook} alt="Facebook" className="w-5 h-5" />
            <span>Facebook</span>
          </Button>
        </div>
      </form>
    </div>
  );
};


const mapStoreToProps = (state) => {
    console.log(state)
    return {
        loading: state?.register?.loading,
        error: state?.register?.error,
        data: state?.register?.data,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
      externalRegister: (providerName) => dispatch(externalRegister(providerName)),
    };
};

export default connect(mapStoreToProps, mapDispatchToProps)(CreateAccountForm);
