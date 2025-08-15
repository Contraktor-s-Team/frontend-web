import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { IoCheckmarkDone } from 'react-icons/io5';
import { FaMapMarkedAlt } from 'react-icons/fa';

import AuthSidePanel from '../../components/Layout/AuthSidePanel';
import ProgressBar from './components/ProgressBar';
import RoleSelection from './components/RoleSelection';
import CreateAccountForm from './components/CreateAccountForm';
import EmailVerification from './components/EmailVerification';
import LocationForm from './components/LocationForm';
import ProfileSetup from './components/ProfileSetup';
import SuccessMessage from './components/SuccessMessage';
import Button from '../../components/Button';
import TextInput from '../../components/Form/TextInput';
import Checkbox from '../../components/Form/Checkbox';
import PersonalInfo from './components/PersonalInfoForm';
import VerifyIdentify from './components/VerifyIdentity';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useUser } from '../../contexts/UserContext.jsx';

const Signup = () => {
  const { register, validateEmail, confirmEmail, login, state: authState } = useAuth();
  const { fetchCurrentUser, updateUser, state: userState } = useUser();
  const navigate = useNavigate();

  // Define loading and error states from context
  const loading = authState.register.loading;
  const error = authState.register.error;
  const data = authState.register.data;
  const confirmLoading = authState.confirmEmail.loading;
  const confirmError = authState.confirmEmail.error;
  const confirmData = authState.confirmEmail.data;
  const isUpdateLoading = userState.updateUser?.loading || false;
  const updateError = userState.updateUser?.error;
  const user = userState.user.data;
  const userEmail = userState.userEmail?.data;
  const validateEmailerror = authState.validateEmail.error;

  const [step, setStep] = useState(1);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [errors, setErrors] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    code: ['', '', '', ''],
    streetAddress: '',
    nearbyLandmark: '',
    areaLocality: '',
    poBox: '',
    profileImage: null,
    imagePreview: null,
    firstName: '',
    lastName: '',
    location: '',
    phoneNumber: '',
    dob: '',
    selectedServices: []
  });
  const [validationErrors, setValidationErrors] = useState({});
  // ...existing code...
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const services = [
    'Carpentry',
    'Banking',
    'Interior',
    'Gas works',
    'Plumbing',
    'AC/Refrigeration',
    'Beauty/Salon',
    'Bricklaying / POP',
    'Catering',
    'Cleaning',
    'Fumigation',
    'DSTV/CCTV',
    'Generator Repair',
    'Haulage/Movers',
    'Painter',
    'Photographer',
    'Electrician'
  ];

  const handleInputChange = (name, value) => {
    console.log('🔍 Signup - handleInputChange called:', { name, value });
    
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value
      };
      
      // Special logging for DOB field
      if (name === 'dob') {
        console.log('🔍 Signup - DOB updated in formData:', {
          previousDOB: prev.dob,
          newDOB: value,
          fullFormData: newFormData
        });
      }
      
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(false); // Clear any previous errors

    try {
      const userData = {
        role: formData.role,
        email: formData.email,
        password: formData.password
      };

      console.log('Starting registration with data:', { email: userData.email, role: userData.role });

      await register(
        userData,
        () => {
          // After successful registration, proceed to email verification
          console.log('✅ Registration successful, proceeding to email verification...');
          nextStep();
        },
        () => {
          console.error('❌ Registration failed');
          setErrors(true);
        }
      );
    } catch (error) {
      console.error('❌ Registration request failed:', error);
      setErrors(true);
    }
  };
  const handleConfirmEmail = async (e) => {
    e.preventDefault();
    setErrors(false); // Clear any previous errors

    try {
      const userData = {
        code: formData.code.join(''),
        email:
          formData.email ||
          userState.user.data?.email ||
          authState.register.data?.email ||
          userState.userEmail.data?.email
      };

      console.log('Starting email confirmation with data:', userData);

      // First confirm email
      await new Promise((resolve, reject) => {
        confirmEmail(
          userData,
          () => {
            console.log('✅ Email confirmed successfully');
            resolve();
          },
          (error) => {
            console.error('❌ Email confirmation failed:', error);
            setErrors(true);
            reject(error);
          }
        );
      });

      // Then login to get auth token
      console.log('✅ Email confirmed, logging user in...');
      await new Promise((resolve, reject) => {
        login(
          {
            email: userData.email,
            password: formData.password
          },
          () => {
            console.log('✅ User logged in successfully after email confirmation');
            resolve();
          },
          (error) => {
            console.error('❌ Login failed after email confirmation:', error);
            setErrors(true);
            reject(error);
          }
        );
      });

      // Finally fetch current user and move to next step
      console.log('✅ Login successful, fetching current user...');
      try {
        const fetchedUserData = await fetchCurrentUser();
        console.log('✅ Current user data fetched successfully:', fetchedUserData);
      } catch (error) {
        console.error('❌ Failed to fetch current user data:', error);
        // Continue anyway since login was successful
      }

      console.log('✅ Moving to next step...');
      console.log('📊 Current step before nextStep call:', step);
      nextStep();
      console.log('📊 nextStep() called successfully');
    } catch (error) {
      console.error('❌ Email confirmation process failed:', error);
      setErrors(true);
    }
  };
  const handleResendCode = async (e) => {
    e.preventDefault();
    const emailToUse = formData?.email || userState.user.data?.email || authState.register.data?.email;
    if (!emailToUse) {
      console.error('No email found to resend code');
      return;
    }
    try {
      await validateEmail({ email: emailToUse });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors(false); // Clear any previous errors

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.location,
        dateOfBirth: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null
      };

      // Use user data from fetchCurrentUser (stored in userState.user.data)
      const userData = userState.user.data;
      const userId = userData?.data?.id || userData?.id;

      console.log('🔍 Starting user update with data:', updateData);
      console.log('🔍 Using userId:', userId);
      console.log('🔍 FormData DOB value:', formData.dob);
      console.log('🔍 UpdateData DOB value:', updateData.dateOfBirth);
      console.log('🔍 Full formData object:', formData);
      console.log('🔍 User data before update:', userData);

      if (!userId) {
        console.error('❌ No user ID found for update');
        console.log('Available user data:', userData);
        setErrors(true);
        return;
      }

      await updateUser(
        userId,
        updateData,
        () => {
          console.log('✅ User updated successfully, moving to next step...');
          console.log('🔍 After update - Fetching updated user data...');
          
          // Fetch the updated user data to confirm DOB was saved
          fetchCurrentUser().then((updatedUserData) => {
            console.log('🔍 After update - Updated user data:', updatedUserData);
            console.log('🔍 After update - DOB in updated data:', {
              dateOfBirth: updatedUserData?.dateOfBirth,
              dob: updatedUserData?.dob,
              fullUserData: updatedUserData
            });
          }).catch((error) => {
            console.error('🔍 After update - Failed to fetch updated user data:', error);
          });
          
          nextStep();
        },
        () => {
          console.error('❌ User update failed');
          setErrors(true);
        }
      );
    } catch (error) {
      console.error('❌ Update user request failed:', error);
      setErrors(true);
    }
  };

  const handleCustomerComplete = async (e = null) => {
    if (e) e.preventDefault();
    setErrors(false); // Clear any previous errors

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.location,
        dateOfBirth: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null
      };

      // Use user data from fetchCurrentUser (stored in userState.user.data)
      const userData = userState.user.data;
      const userId = userData?.data?.id || userData?.id;

      console.log('Starting customer completion with data:', updateData);
      console.log('Using userId:', userId);

      if (!userId) {
        console.error('❌ No user ID found for customer completion');
        console.log('Available user data:', userData);
        setErrors(true);
        return;
      }

      await updateUser(
        userId,
        updateData,
        () => {
          console.log('✅ Customer profile updated successfully');
          setIsProfileCompleted(true);
          // Redirect to appropriate dashboard or success page using correct route structure
          navigate('/customer/dashboard/posted', { replace: true });
        },
        () => {
          console.error('❌ Customer profile update failed');
          setErrors(true);
        }
      );
    } catch (error) {
      console.error('❌ Customer completion request failed:', error);
      setErrors(true);
    }
  };

  const handleProfileSetupComplete = () => {
    console.log('🎯 Profile setup complete called');
    console.log('🔍 Current user data at profile completion:', {
      user: userState.user.data,
      role: formData.role,
      userRole: userState.user.data?.role || userState.user.data?.data?.role
    });
    setIsProfileCompleted(true);

    if (formData.role === 'artisan') {
      // For artisans, go to identity verification (step 7)
      nextStep();
    } else {
      // For customers, complete the signup process immediately
      console.log('🚀 Customer role detected, navigating to dashboard...');
      navigate('/customer/dashboard/posted', { replace: true });
    }
  };

  const handleArtisanComplete = () => {
    console.log('✅ Artisan signup completed, redirecting to dashboard...');
    setIsProfileCompleted(true);
    navigate('/artisan/dashboard/new', { replace: true });
  };

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...formData.code];
      newCode[index] = value;

      setFormData((prev) => ({
        ...prev,
        code: newCode
      }));

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          profileImage: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const toggleService = (service) => {
    setFormData((prev) => {
      const newServices = prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service];

      return {
        ...prev,
        selectedServices: newServices
      };
    });
  };

  const nextStep = () => {
    console.log('🔄 nextStep called - Moving from step', step, 'to step', step + 1);
    console.log('📊 Current state before step change:', {
      step,
      hasUserData: !!userState.user.data,
      authToken: !!localStorage.getItem('authToken')
    });
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isCodeComplete = formData.code.every((digit) => digit !== '');

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLocationChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSetLocationOnMap = () => {
    console.log('Opening map for location selection...');
    // TODO: Implement map location selection
  };
  const isFormValid = formData.selectedServices.length > 0;

  // Profile user function for image upload
  const profileUser = async (data, onSuccess, onError) => {
    try {
      // Implementation for profile image upload
      // This would typically call a user context method
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Profile update failed:', error);
      if (onError) onError(error);
    }
  };

  useEffect(() => {
    // If there's existing login data with a token (user completed email verification),
    // fetch their current user data
    const hasLoginToken =
      authState.login.data?.token || (localStorage.getItem('auth') && JSON.parse(localStorage.getItem('auth'))?.token);

    if (hasLoginToken && !userState.user.data && !userState.user.loading) {
      console.log('Signup: Fetching current user with token validation');
      fetchCurrentUser().catch((error) => {
        console.error('Failed to fetch current user on login:', error);
      });
    }
  }, [authState.login.data, userState.user.data, userState.user.loading, fetchCurrentUser]);
  useEffect(() => {
    // console.log('📍 Step changed to:', step, '| Profile completed:', isProfileCompleted);
  }, [step, isProfileCompleted]);

  useEffect(() => {
    // Skip if profile is already completed to prevent step resets
    if (isProfileCompleted) {
      console.log('🚫 Skipping fetchCurrentUser - profile already completed');
      return;
    }

    // Only fetch if we don't have user data, we're not currently loading, and we have auth token
    const hasUserData = userState.user.data?.data?.id || userState.user.data?.id;
    const isLoading = userState.user.loading;

    // Check for valid auth token in the login response structure
    let hasValidAuthToken = false;
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        hasValidAuthToken = !!parsedAuth?.token;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }

    // Only fetch user data for steps 4 and 5, and avoid fetching if we're in later steps
    if ((step === 4 || step === 5) && !hasUserData && !isLoading && hasValidAuthToken) {
      console.log('useEffect: Fetching current user data for step:', step);
      fetchCurrentUser().catch((error) => {
        console.error('useEffect: Failed to fetch current user:', error);
      });
    }
  }, [step, userState.user.loading, isProfileCompleted]); // Added isProfileCompleted dependency
  return (
    <div className="flex h-screen bg-white px-[18px] py-[27px] md:p-[27px] gap-14">
      <AuthSidePanel className="hidden md:flex" />
      <div className="w-[100%] md:w-[50%] overflow-y-auto scrollbar-hidden">
        <ProgressBar currentStep={step} totalSteps={formData.role === 'artisan' ? 7 : 6} />

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <RoleSelection
            selectedRole={formData.role}
            setSelectedRole={(role) => handleInputChange('role', role)}
            onNext={nextStep}
          />
        )}

        {/* Step 2: Create Account */}
        {step === 2 && (
          <CreateAccountForm
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleSubmit}
            onBack={prevStep}
            loading={loading}
            error={error}
            isError={errors}
            setErrors={setErrors}
            setStep={setStep}
          />
        )}

        {/* Step 3: Email Verification */}
        {step === 3 && (
          <EmailVerification
            code={formData.code}
            email={formData.email}
            onCodeChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onResendCode={handleResendCode}
            onNext={handleConfirmEmail}
            onBack={prevStep}
            confirmEmail={confirmEmail}
            isConfirmLoading={confirmLoading}
            isError={errors}
            confirmError={confirmError}
            isCodeComplete={isCodeComplete}
          />
        )}

        {/* Step 4: Location Access */}
        {step === 4 && (
          <LocationForm
            formData={formData}
            onInputChange={handleLocationChange}
            onSetLocationOnMap={handleSetLocationOnMap}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 5 && (
          <PersonalInfo
            formData={formData}
            onFormChange={handleInputChange}
            onNext={handleUpdate}
            onBack={prevStep}
            isLoading={isUpdateLoading || userState.user.loading}
            isError={errors}
            error={updateError}
          />
        )}

        {/* Step 6: Profile Setup - For both customers and artisans */}
        {step === 6 && (
          <ProfileSetup
            formData={formData}
            services={services}
            dragOver={dragOver}
            fileInputRef={fileInputRef}
            onImageUpload={handleImageUpload}
            onFormChange={handleInputChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemoveImage={removeImage}
            onToggleService={toggleService}
            onNext={handleProfileSetupComplete}
            onBack={prevStep}
            isFormValid={isFormValid}
            selectedServices={formData.selectedServices}
            profileUser={profileUser}
            profileLoading={isUpdateLoading}
            profileError={updateError}
          />
        )}

        {/* Step 7: Identity Verification - Only for Artisans */}
        {step === 7 && formData.role === 'artisan' && (
          <VerifyIdentify user={userState.user} onNext={handleArtisanComplete} onBack={prevStep} />
        )}

        {/* Step 6: Success Message */}
        {/* {step === 6 && (
                        <SuccessMessage 
                            role={formData.role}
                            onGetStarted={() => navigate('/dashboard')}
                        />
                    )} */}
      </div>
    </div>
  );
};

export default Signup;
