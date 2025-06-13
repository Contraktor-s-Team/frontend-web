import { useState, useRef } from "react";
import { FiEye, FiMail, FiMapPin, FiSearch, FiUpload } from "react-icons/fi";
import { TiSpanner } from "react-icons/ti";
import Button from "../../components/Button";
import { TbCircleCheckFilled } from "react-icons/tb";
import { Checkbox, TextInput } from "../../components/Form";
import google from "../../assets/img/google.png";
import facebook from "../../assets/img/facebook.png";
import profile from '../../assets/img/profile.png';
import { FaMapPin, FaRegMap } from "react-icons/fa";

const Signup = () => {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState("");
    const [code, setCode] = useState(['', '', '', '']);
    const [streetAddress, setStreetAddress] = useState('');
    const [nearbyLandmark, setNearbyLandmark] = useState('');
    const [areaLocality, setAreaLocality] = useState('');
    const [poBox, setPoBox] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const services = [
        'Carpentry', 'Banking', 'Interior', 'Gas works', 'Plumbing', 'AC/Refrigeration',
        'Beauty/Salon', 'Bricklaying / POP', 'Catering', 'Cleaning', 'Fumigation',
        'DSTV/CCTV', 'Generator Repair', 'Haulage/Movers', 'Painter', 'Photographer',
        'Electrician'
    ];
    const nextStep = () => {
        if (step < 6) {
            if (selectedRole) {
                setStep(step + 1);
            }
        }
    }
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
    const handleResendCode = () => {
        // Handle resend code logic here
        console.log('Resending code...');
    };
    const handleCreateAccount = () => {
        const verificationCode = code.join('');
        if (verificationCode.length === 6) {
        console.log('Creating account with code:', verificationCode);
        }
    };
    const isCodeComplete = code.every(digit => digit !== '');
    const handleSetLocationOnMap = () => {
        // Handle setting location on map
        console.log('Opening map for location selection...');
    };
    const handleSetLocation = () => {
        const locationData = {
        streetAddress,
        nearbyLandmark,
        areaLocality,
        poBox
        };
        console.log('Setting location:', locationData);
    };
    const handleImageUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
        // Check file size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            alert('File size should be less than 2MB');
            return;
        }

        setProfileImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        } else {
        alert('Please select a valid image file');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
        handleImageUpload(file);
        }
    };

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
        setProfileImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
    };

    const toggleService = (service) => {
        setSelectedServices(prev => 
        prev.includes(service) 
            ? prev.filter(s => s !== service)
            : [...prev, service]
        );
    };

    const handleSaveAndContinue = () => {
        const profileData = {
        profileImage,
        selectedServices
        };
        console.log('Saving profile:', profileData);
    };

    const isFormValid = selectedServices.length > 0;
    return ( 
        <div className="relative flex items-center h-screen w-full bg-white p-[27px]">
            <div className="hidden bg-bg-primary p-[54px] rounded-[20px] w-[55%] h-full md:flex flex-col justify-between">
                <p className="font-manrope font-bold text-white text-4xl">ContraKtor</p>
                <div className="space-y-2">
                    <p className="font-inter font-medium text-[#98A2B3]">©2025 Contraktor Inc. All rights reserved</p>
                    <p className="font-inter font-medium text-[#98A2B3]">Privacy <span className="text-6xl text-[#DFE2E766] px-3">.</span> Term & Conditions</p>
                </div>
            </div>
            <div className="relative p-1 md:p-[76px] w-full h-full">
                {/* Progress bar section Start*/}
                <div className="flex gap-2 mb-8 w-full">
                    <div className={`w-100/5 h-1.5 ${step >= 1 ? "bg-blue-500" : "bg-gray-200"} rounded`}></div>
                    <div className={`w-100/5 h-1.5 ${step >= 2 ? "bg-blue-500" : "bg-gray-200"} rounded`}></div>
                    <div className={`w-100/5 h-1.5 ${step >= 3 ? "bg-blue-500" : "bg-gray-200"} rounded`}></div>
                    <div className={`w-100/5 h-1.5 ${step >= 4 ? "bg-blue-500" : "bg-gray-200"} rounded`}></div>
                    <div className={`w-100/5 h-1.5 ${step >= 5 ? "bg-blue-500" : "bg-gray-200"} rounded`}></div>
                    <div className={`w-100/5 h-1.5 ${step >= 6 ? "bg-blue-500" : "bg-gray-200"} rounded`}></div>
                </div>
                {/* Progress bar section Ends*/}
                {/* Steps form section Start*/}
                {step === 1 && (
                    <div>
                        <div className="">
                            <div className="space-y-2">
                                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-4xl">Let’s Set You Up Right</h3>
                                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Choose how you’d like to sign up on contraktor</p>
                            </div>
                            <div className="mt-8 flex flex-col md:flex-row gap-4 ">
                                <div 
                                    onClick={() => setSelectedRole('client')} 
                                    className={`relative w-full h-[89px] md:h-[238px] px-[22px] rounded-2xl flex md:flex-col items-center md:justify-center space-x-5 md:space-y-4 transition-all duration-200 ${
                                            selectedRole === 'client'
                                            ? 'border border-[#0091F0]'
                                            : 'border border-[#DFE2E7]'
                                    }`}
                                >
                                    {selectedRole === 'client' && <TbCircleCheckFilled className="absolute md:top-4 right-1 text-2xl md:text-3xl text-[#0091F0]"/>}
                                    <div className={`w-[46px] h-[46px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center ${selectedRole === 'client' ? 'bg-[#E6F4FE]' : 'bg-[#FDF1DC]'}`}>
                                        <FiSearch className={`text-xl md:text-3xl ${selectedRole === 'client' ? 'text-[#006DB4]' : 'text-[#F3A218]'}`}/>
                                    </div>
                                    <p className="font-inter font-medium text-[#727A86] text-base md:text-lg">I want to Find an Artisan</p>
                                </div>
                                <div 
                                    onClick={() => setSelectedRole('artisan')} 
                                    className={`relative w-full h-[89px] md:h-[238px] px-[22px] rounded-2xl flex md:flex-col items-center md:justify-center space-x-5 md:space-y-4 transition-all duration-200 ${
                                            selectedRole === 'artisan'
                                            ? 'border border-[#0091F0]'
                                            : 'border border-[#DFE2E7]'
                                    }`}
                                >
                                    {selectedRole === 'artisan' && <TbCircleCheckFilled className="absolute md:top-4 right-1 text-2xl md:text-3xl text-[#0091F0]"/>}
                                    <div className={`w-[46px] h-[46px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center ${selectedRole === 'artisan' ? 'bg-[#E6F4FE]' : 'bg-[#FDF1DC]'}`}>
                                        <TiSpanner className={`text-xl md:text-3xl ${selectedRole === 'artisan' ? 'text-[#006DB4]' : 'text-[#F3A218]'}`}/>
                                    </div>
                                    <p className="font-inter font-medium text-[#727A86] text-base md:text-lg">I want to become an artisan</p>
                                </div>
                            </div>
                            <Button 
                                variant="secondary" 
                                className="w-full absolute md:relative bottom-0 mt-[44px] py-[11px]" 
                                onClick={nextStep}
                            >
                            Select Role
                            </Button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <div>
                            <div className="space-y-2">
                                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-4xl">Create Your Account</h3>
                                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Sign up in seconds by entering your basic details</p>
                            </div>
                            <form className="mt-[48px]">
                                <TextInput
                                    id="default-text"
                                    label="Email Address"
                                    placeholder="Enter your email address"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />

                               <TextInput
                                    id="password-text"
                                    label="Password"
                                    placeholder="Create a strong password"
                                    type="password"
                                    // value={passwordValue}
                                    // onChange={(e) => setPasswordValue(e.target.value)}
                                    className="mb-[40px]"
                                    trailingIcon={<FiEye className="text-[#98A2B3] text-xl" />}
                                />
                                <div>
                                    <Checkbox
                                    label="I agree to the Terms & Conditions and Privacy Policy"
                                />
                                </div>
                        
                                <Button 
                                    variant="secondary" 
                                    className="w-full mt-[38px] py-[11px]" 
                                    onClick={nextStep}
                                >
                                    Create Account
                                </Button>

                                <hr className="mt-[38px] md:mt-[41px] mb-[38px] text-[#DFE2E7]" data-content="OR"></hr>

                                <div className="md:flex md:justify-between md:gap-4">
                                    <button className="w-full flex items-center justify-center gap-2 border border-[#DFE2E7] rounded-[50px] py-[19px] mb-[14px]">
                                        <img src={google} alt="Google" className="w-5 h-5" />
                                        <span className="font-inter font-medium text-[#101928] text-SM">Google</span>
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 border border-[#DFE2E7] rounded-[50px] py-[19px] mb-[14px]">
                                        <img src={facebook} alt="Facebook" className="w-5 h-5" />
                                        <span className="font-inter font-medium text-[#101928] text-SM">Facebook</span>
                                    </button>
                                </div>
                            </form>
                            
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <div>
                            <div className="space-y-2">
                                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-4xl">Verify Your Email Address</h3>
                                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">We’ve sent a 4-digit code to your inbox. Enter it here to activate your account.</p>
                            </div>
                            <div className="flex space-x-3 mt-[61px]">
                                {code.map((digit, index) => (
                                    <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-[82px] h-[80px] md:w-[126px] md:h-[123px] text-center text-xl font-semibold border-[2px] border-[#DFE2E7] rounded-[10px] focus:border-[#0091F0] focus:outline-none transition-colors"
                                    />
                                ))}
                            </div>
                             <div className="mt-[44px] text-left font-inter font-medium text-[#101928] text-base">
                                <span className="">Didn't receive a code? </span>
                                <button 
                                    onClick={handleResendCode}
                                    className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Resend Code
                                </button>
                            </div>
                            <Button 
                                variant="secondary" 
                                className="w-full absolute md:relative bottom-0 mt-[38px] py-[11px]" 
                                onClick={nextStep}
                            >
                                Verify Email
                            </Button>
                        
                        </div>
                    </div>
                )}
                {step === 4  && (
                    <div>
                        <div>
                            <div className="space-y-2">
                                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-4xl">Allow Location Access</h3>
                                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Add your location or enter it manually with your address details</p>
                            </div>
                            <button
                                onClick={handleSetLocationOnMap}
                                className="mt-[52px] w-full py-3 px-4 border-2 border-[#0091F0] text-sm text-[#0091F0] rounded-[50px] font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                                >
                                <span>Set Location on map</span>
                                <FaRegMap size={20} />
                            </button>
                            <form className="mt-[36px]">
                                <TextInput
                                    id="default-text"
                                    label="Street Address"
                                    placeholder="e.g., 23 Adeyemi Street"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />

                                 <TextInput
                                    id="default-text"
                                    label="Nearby Landmark"
                                    placeholder="e.g., Close to Yaba Tech Gate"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />

                                 <TextInput
                                    id="default-text"
                                    label="Area / Locality"
                                    placeholder="e.g., Yaba"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />

                                 <TextInput
                                    id="default-text"
                                    label="PO Box"
                                    placeholder="e.g., P.O. Box 12345"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />
                            </form>
                            <Button 
                                variant="secondary" 
                                className="w-full absolute md:relative bottom-0 mt-[38px] py-[11px]" 
                                onClick={nextStep}
                            >
                                Set Location
                            </Button>
                        
                        </div>
                    </div>
                )}
                {step === 5  && (
                    <div>
                        <div>
                            <div className="space-y-2">
                                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-4xl">Finish creating account</h3>
                                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Add your name and phone number to finish creating your account</p>
                            </div>
                            <form className="mt-[36px]">
                                <TextInput
                                    id="default-text"
                                    label="First Name"
                                    placeholder="Enter your first name"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />

                                 <TextInput
                                    id="default-text"
                                    label="Last Name"
                                    placeholder="Enter your last name"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />

                                 <TextInput
                                    id="default-text"
                                    label="Phone Number"
                                    placeholder="Enter your phone number"
                                    className="mb-[40px]"
                                    // value={textInputValue}
                                    // onChange={(e) => setTextInputValue(e.target.value)}
                                />
                            </form>
                            <Button 
                                variant="secondary" 
                                className="w-full absolute md:relative bottom-0 mt-[38px] py-[11px]" 
                                onClick={nextStep}
                            >
                                Create Account
                            </Button>
                        
                        </div>
                    </div>
                )}
                {step === 6  && (
                    <div>
                        <div>
                            <div className="space-y-2">
                                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-4xl">Almost There — Complete Your Profile</h3>
                                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Tell us a bit more about you so we can personalize your experience.</p>
                            </div>
                            <div className="mt-[45px]">
                                <label className="block text-sm font-medium font-inter text-[#101928] mb-[20px]">
                                    Profile Picture
                                </label>     
                                <div className="flex items-center space-x-4">
                                    {/* Profile Image Preview */}
                                    <div className="relative">
                                    {imagePreview ? (
                                        <div className="relative">
                                        <img 
                                            src={imagePreview} 
                                            alt="Profile preview" 
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        {/* <button
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X size={12} />
                                        </button> */}
                                        </div>
                                    ) : (
                                        <div className="rounded-full flex items-center justify-center">
                                            <img 
                                                src={imagePreview || profile} 
                                                alt="Profile preview" 
                                                className="w-30 h-30 rounded-full object-cover"
                                            />
                                        </div>
                                    )}
                                    </div>

                                    {/* Upload Area */}
                                    <div className="">
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        className={`p-4 text-center transition-colors flex flex-col-reverse md:flex-row md:justify-between md: gap-9
                                            ${
                                            dragOver 
                                                ? 'border-blue-400 bg-blue-50' 
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        />
                                        <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-[20px] md:mt-[0px] text-[#0091F0] text-sm font-inter font-medium border border-[#0091F0] px-[12px] py-[8px] rounded-[50px] hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
                                        >
                                        <FiUpload size={16} />
                                        <span>Upload picture</span>
                                        </button>
                                        <p className="text-sm font-inter font-medium text-[#98A2B3] mt-2">
                                            JPG or PNG file, no larger than 2MB.<br></br> (400x400px) with a clean background.
                                        </p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[59px]">
                                <label className="block text-sm font-medium font-inter text-[#101928] mb-3">
                                    Service Interests
                                </label>
                                
                                <div className="flex flex-wrap gap-2">
                                    {services.map((service) => (
                                    <button
                                        key={service}
                                        onClick={() => toggleService(service)}
                                        className={`px-[18px] py-[14px] rounded-full text-sm font-medium font-inter text-[#667185] border transition-colors ${
                                        selectedServices.includes(service)
                                            ? 'bg-[#E6F4FE]  border-[#0074C0]'
                                            : 'bg-white border-[#DFE2E7] hover:border-[#F7D7BA]'
                                        }`}
                                    >
                                        {service}
                                    </button>
                                    ))}
                                </div>
                            </div>
                            <Button 
                                variant="secondary" 
                                className="w-full absolute md:relative bottom-0 mt-[38px] py-[11px]" 
                                onClick={nextStep}
                            >
                                Create Account
                            </Button>
                        
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Signup;