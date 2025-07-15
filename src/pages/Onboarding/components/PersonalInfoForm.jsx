import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { TextInput } from "../../../components/Form";
import LoaderComp from "../../../assets/animation/loader";

const PersonalInfo = ({
    formData,
    onFormChange,
    onNext, 
    userData,
    isLoading,
    error
}) => {
    const { 
        firstName = '', 
        lastName = '', 
        phoneNumber = '', 
    } = formData || {};

   const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validation rules
    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'firstName':
                if (!value.trim()) {
                    error = 'First name is required';
                } else if (value.trim().length < 2) {
                    error = 'First name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                    error = 'First name can only contain letters, spaces, hyphens, and apostrophes';
                } else if (value.trim().length > 50) {
                    error = 'First name cannot exceed 50 characters';
                }
                break;
                
            case 'lastName':
                if (!value.trim()) {
                    error = 'Last name is required';
                } else if (value.trim().length < 2) {
                    error = 'Last name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                    error = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
                } else if (value.trim().length > 50) {
                    error = 'Last name cannot exceed 50 characters';
                }
                break;
                
            case 'phoneNumber':
                if (!value.trim()) {
                    error = 'Phone number is required';
                } else {
                    // Remove all non-digit characters for validation
                    const cleanPhone = value.replace(/\D/g, '');
                    
                    if (cleanPhone.length < 10) {
                        error = 'Phone number must be at least 10 digits';
                    } else if (cleanPhone.length > 15) {
                        error = 'Phone number cannot exceed 15 digits';
                    } else if (!/^\+?[\d\s\-\(\)]+$/.test(value)) {
                        error = 'Phone number format is invalid';
                    }
                }
                break;
                
            default:
                break;
        }
        
        return error;
    };

    // Validate all fields
    const validateForm = () => {
        const newErrors = {};
        
        newErrors.firstName = validateField('firstName', firstName);
        newErrors.lastName = validateField('lastName', lastName);
        newErrors.phoneNumber = validateField('phoneNumber', phoneNumber);
        
        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) {
                delete newErrors[key];
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for phone number formatting
        let formattedValue = value;
        if (name === 'phoneNumber') {
            // Allow only digits, spaces, parentheses, hyphens, and plus sign
            formattedValue = value.replace(/[^\d\s\-\(\)\+]/g, '');
        }
        
        // Update form data
        onFormChange(name, formattedValue);
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Validate field in real-time if it was previously touched
        if (touched[name]) {
            const fieldError = validateField(name, formattedValue);
            setErrors(prev => ({
                ...prev,
                [name]: fieldError
            }));
        }
    };

    // Handle field blur (when user leaves field)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        
        // Validate field
        const fieldError = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: fieldError
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({
            firstName: true,
            lastName: true,
            phoneNumber: true
        });
        
        // Validate form
        if (validateForm()) {
            onNext(e);
        }
    };

    // Check if form is valid
    const isFormValid = () => {
        return firstName.trim() && 
               lastName.trim() && 
               phoneNumber.trim() &&
               Object.keys(errors).length === 0;
    };

    // Auto-populate from user data if available
    useEffect(() => {
        if (!firstName || !lastName || !phoneNumber) {
            
            if (!firstName) {
                onFormChange('firstName', firstName);
            }
            if (!lastName) {
                onFormChange('lastName', lastName);
            }
            if (!phoneNumber) {             
                onFormChange('phoneNumber', phoneNumber);
            }
        }
    }, [firstName, lastName, phoneNumber]);
    return ( 
        <div className="">
            <div className="space-y-2">
                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Finish creating account</h3>
                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">
                  Add your name and phone number to finish creating your account
                </p>
            </div>
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    </div>
                    <div className="ml-3">
                        <div className="mt-2 text-sm text-red-700">
                        <p>{error.data.message}</p>
                        </div>
                    </div>
                </div>
                </div>
            )}       
            <form className="mt-[36px]">
                <TextInput
                    id="street-address"
                    name="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                    className="mb-[40px]"
                    value={firstName}
                    onChange={handleChange}
                    isError={touched.firstName && errors.firstName}
                    errorMessage={errors.firstName}
                />
                <TextInput
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    className="mb-[40px]"
                    value={lastName}
                    onChange={handleChange}
                    isError={touched.lastName && errors.lastName}
                    errorMessage={errors.lastName}
                />

                <TextInput
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    className="mb-[40px]"
                    value={phoneNumber}
                    onChange={handleChange}
                    isError={touched.phoneNumber && errors.phoneNumber}
                    errorMessage={errors.phoneNumber}
                />

            </form>
            
            <Button
                size='large'
                variant="secondary" 
                className="w-full mt-[38px] py-[11px]" 
                disabled={isLoading}
                loading={isLoading}
                onClick={handleSubmit}
            >
                {isLoading ? (
                    <LoaderComp/>
                ) : (
                    "Create Account"
                )}  
            </Button>
        </div>
    );
}
 
export default PersonalInfo;