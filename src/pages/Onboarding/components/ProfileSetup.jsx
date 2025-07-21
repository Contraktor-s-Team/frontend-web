import React, { useRef, useCallback } from 'react';
import { FiUpload } from 'react-icons/fi';
import Button from '../../../components/Button';
import { TextInput } from '../../../components/Form';
import SelectField from '../../../components/Form/Select';
import profile from "../../../assets/profile.png"
import SuccessModal from '../../../components/Modal/SuccessModal';
import { useNavigate } from 'react-router-dom';
import TextAreaInput from '../../../components/Form/TextAreaInput';


const options = [
  { value: 'plumbing', label: 'Plumber' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'acrepair', label: 'AC Repair'},
];

const ProfileSetup = ({ 
  onNext,
  onImageUpload,
  onRemoveImage,
  onFormChange,
  formData,
  selectedServices = [],
  onToggleService
}) => {
  const Navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const { firstName = '', lastName = '', phoneNumber = '' } = formData;
  console.log("ProfileSetup formData", formData);
  const [selectedService, setSelectedService] = React.useState('');

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const services = [
    'Carpentry', 'Banking', 'Interior', 'Gas works', 'Plumbing', 'AC/Refrigeration',
    'Beauty/Salon', 'Bricklaying / POP', 'Catering', 'Cleaning', 'Fumigation',
    'DSTV/CCTV', 'Generator Repair', 'Haulage/Movers', 'Painter', 'Photographer',
    'Electrician'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleSuccess = (e) => {
    setShowSuccessModal(true);
    onNext();
  }

  return (
    <div className=''>
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
                    <div className="">
                      {formData.imagePreview ? (
                          <div className="">
                            <img 
                                src={formData.imagePreview} 
                                alt="Profile preview" 
                                className="w-30 h-30 md:w-45 md:h-45 object-cover rounded-full"
                            />
                          </div>
                      ) : (
                        <div className="flex items-center justify-center">
                            <img 
                                src={formData.imagePreview || profile} 
                                alt="Profile preview" 
                                className="w-30 h-30 md:w-45 md:h-45 object-cover"
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
                        <span>Upload picture</span>
                        <FiUpload size={20} />
                        </button>
                        <p className="text-sm font-inter font-medium text-[#98A2B3] mt-2">
                            JPG or PNG file, no larger than 2MB.<br></br> (400x400px) with a clean background.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
            {formData.role === 'user' && (
              <div className="mt-[59px]">
                  <label className="block text-sm font-medium font-inter text-[#101928] mb-3">
                      Service Interests
                  </label>
                  
                  <div className="flex flex-wrap gap-3 mt-[35px]">
                      {services.map((service) => (
                      <button
                          key={service}
                          onClick={() => onToggleService(service)}
                          className={`px-[18px] py-[14px] rounded-full text-sm font-medium font-inter text-[#8992A1] border transition-colors ${
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
            )}
            {formData.role === 'artisan' && (
              <div className="mt-[59px]">
                <div>
                  <TextInput
                    id="businessName"
                    name="businessName"
                    label="Business Name (Optional)"
                    type="text"
                    required
                    // value={email}
                    // onChange={handleEmailChange}
                    placeholder="Enter your business name"
                    className="w-full mb-[43px]"
                  />
                  <div className='flex justify-between items-center gap-4'>
                      <SelectField
                        label="Service Category"
                        value={selectedService}
                        onChange={handleServiceChange}
                        options={options}
                        placeholder="e.g., Plumbing, Cleaning, AC Repair"
                       
                      />
                      <SelectField
                        label="Years of experience"
                        value={selectedService}
                        onChange={handleServiceChange}
                        options={options}
                        placeholder="Select your years of experience"
                        
                      />
                  </div>
                </div>
                <div className="mt-[44px]">
                  <label className="block text-sm font-medium font-inter text-[#101928] mb-3">
                      Sub Categories
                  </label>
                  <div className="flex flex-wrap gap-3 mt-[35px]">
                      {services.map((service) => (
                      <button
                          key={service}
                          onClick={() => onToggleService(service)}
                          className={`px-[18px] py-[14px] rounded-full text-sm font-medium font-inter text-[#8992A1] border transition-colors ${
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
                <div className='mt-[44px]'>
                   <TextAreaInput
                    id="serviceDescription"
                    name="serviceDescription"
                    label="Service Description"
                    type="text"
                    required
                    // value={email}
                    // onChange={handleEmailChange}
                    placeholder="Describe your services"
                    className="w-full mb-[43px]"
                  />
                </div>
              </div>
            )}
            <Button 
                variant="primary" Add commentMore actions
                className="w-full absolute md:relative bottom-0 mt-[38px] py-[11px]" 
                onClick={(e)=> handleSuccess(e)}
            >
                Create Account
            </Button>
            <SuccessModal
              isOpen={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              title="You’re All Set!"
              message="You’ve successfully created your account and Ready to find the right artisan for the job"
              buttonText="Browse Artisans"
              onButtonClick={() => Navigate('/')}
            />
        </div>
    </div>
  );
};

export default ProfileSetup;
