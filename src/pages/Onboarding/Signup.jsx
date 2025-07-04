import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaMapMarkedAlt } from "react-icons/fa";

import AuthSidePanel from "../../components/Layout/AuthSidePanel";
import ProgressBar from "./components/ProgressBar";
import RoleSelection from "./components/RoleSelection";
import CreateAccountForm from "./components/CreateAccountForm";
import EmailVerification from "./components/EmailVerification";
import LocationForm from "./components/LocationForm";
import ProfileSetup from "./components/ProfileSetup";
import SuccessMessage from "./components/SuccessMessage";
import Button from "../../components/Button";
import TextInput from "../../components/Form/TextInput";
import Checkbox from "../../components/Form/Checkbox";
import PersonalInfo from "./components/PersonalInfoForm";
import { useDispatch } from "react-redux";
import { useConfirmEmailMutation, useGetUserEmailQuery, useRegisterMutation, useUpdateUserMutation, useValidateEmailMutation } from "../../store/api/apiSlice";
import VerifyIdentify from "./components/VerifyIdentity";

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
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
        selectedServices: []
    }); 
    const [validationErrors, setValidationErrors] = useState({})
    const dispatch = useDispatch()
    const [register, { isLoading, error }] = useRegisterMutation()
    const [validateEmail, { isValidateLoading, validateError }] = useValidateEmailMutation()
    const [confirmEmail, { isLoading:isConfirmLoading, error:confirmError }] = useConfirmEmailMutation()
     // Only fetch user data when we have an email and shouldFetchUser is true
    const { 
        data: userData, 
        isLoading: isUserLoading, 
        error: userError,
        refetch: refetchUser 
    } = useGetUserEmailQuery(formData.email, {
        skip: !formData.email, // Skip if no email or not ready to fetch
    });
    const [updateUser, { isLoading:isUpdateLoading, error:updateError }] = useUpdateUserMutation()
    // const { isAuthenticated, error: authError } = useAppSelector((state) => state.auth)
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    
    const services = [
        'Carpentry', 'Banking', 'Interior', 'Gas works', 'Plumbing', 'AC/Refrigeration',
        'Beauty/Salon', 'Bricklaying / POP', 'Catering', 'Cleaning', 'Fumigation',
        'DSTV/CCTV', 'Generator Repair', 'Haulage/Movers', 'Painter', 'Photographer',
        'Electrician'
    ];

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const userData ={
                role: formData.role,
                email: formData.email,
                password: formData.password,
            }
            const response = await register(userData).unwrap();
            if(response.isSuccess){
                validateEmail(formData.email);
                nextStep();
            }
        }
        catch (error) {
            console.error('Registration failed:', error);
        }
    };
    const handleConfirmEmail = async (e) => {
        e.preventDefault();
        try{
            const userData ={
                code: formData.code.join(''),
                email: formData.email,
            }
            const response = await confirmEmail(userData).unwrap();
            console.log('Registration response:', userData, response);
            if(response.isSuccess){
                await refetchUser(); 
                nextStep();
            }
        }
        catch (error) {
            console.error('Registration failed:', error);
        }
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        try{
            const data ={
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.location,     
            }
            console.log('User data:', userData);
            const response = await updateUser({ id: userData.data.id, userData: data }).unwrap();
            if(response.isSuccess){
                // validateEmail(formData.email);
                nextStep();
            }
        }
        catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...formData.code];
            newCode[index] = value;
            
            setFormData(prev => ({
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

    const handleResendCode = () => {
        console.log('Resending code...');
        // TODO: Implement resend code logic
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
                setFormData(prev => ({
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
        setFormData(prev => {
            const newServices = prev.selectedServices.includes(service)
                ? prev.selectedServices.filter(s => s !== service)
                : [...prev.selectedServices, service];
            
            return {
                ...prev,
                selectedServices: newServices
            };
        });
    };

    const nextStep = (e) => {
        if (step < 6 || formData.role === 'artisan') {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };


    const isCodeComplete = formData.code.every(digit => digit !== '');

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
        setFormData(prev => ({
            ...prev,
            profileImage: null,
            imagePreview: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleLocationChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSetLocationOnMap = () => {
        console.log('Opening map for location selection...');
        // TODO: Implement map location selection
    };

    const isFormValid = formData.selectedServices.length > 0;

    return ( 
        <div className="flex h-screen bg-white px-[18px] py-[27px] md:p-[27px] gap-14">
            <AuthSidePanel className="hidden md:flex" />
            <div className="flex w-full md:w-[60%] flex-col lg:py-[20px] xl:py-[50px] lg:px-8">
                <ProgressBar currentStep={step} totalSteps={6} />
                <div className="w-[100%] xl:w-[90%] overflow-y-auto scrollbar-hidden">
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
                            loading = {isLoading}
                            error={error}
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
                            isConfirmLoading={isConfirmLoading}
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
                            isLoading={isUpdateLoading}
                            error={updateError}
                        />
                    )}

                    {/* Step 5: Profile Setup */}
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
                            onNext={nextStep}
                            onBack={prevStep}
                            isFormValid={isFormValid}
                        />
                    )}

                    {step === 7 && (
                        <VerifyIdentify/>
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
        </div>
    );
}

export default Signup;