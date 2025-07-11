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
        fullName: '',
        phoneNumber: '',
        selectedServices: []
    });
    
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

    const handleCodeChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...formData.code];
            newCode[index] = value;
            
            setFormData(prev => ({
                ...prev,
                code: newCode
            }));

            // Auto-focus next input
            if (value && index < 3) {
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

    const nextStep = () => {
        if (step < 6) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // TODO: Implement form submission logic
        nextStep(); // Move to success step
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
        <div className="flex h-screen bg-white p-[27px] gap-14">
            <AuthSidePanel className="hidden md:flex" />
            <div className="flex flex-1 flex-col px-6 lg:px-8">
            <ProgressBar currentStep={step} totalSteps={6} />
            <div className=" overflow-y-auto scrollbar-hidden">
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
                        onNext={nextStep}
                        onBack={prevStep}
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
                        onNext={nextStep}
                        onBack={prevStep}
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

                {/* Step 5: Profile Setup */}
                {step === 5 && (
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
                        onNext={handleSubmit}
                        onBack={prevStep}
                        isFormValid={isFormValid}
                    />
                )}

                {/* Step 6: Success Message */}
                {step === 6 && (
                    <SuccessMessage 
                        role={formData.role}
                        onGetStarted={() => navigate('/dashboard')}
                    />
                )}
            </div>
            </div>
        </div>
    );
}

export default Signup;