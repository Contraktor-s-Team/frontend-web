import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { TextInput } from "../../../components/Form";
import { FaUpload } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { navigate } from "@storybook/addon-links";
import ActionModel from "../../../components/Modal/ActionModel";

const VerifyIdentify = ({
    formData,
    user,
    onFormChange,
    onNext, 
    userData,
    isLoading,
    error
}) => {
    const [selectedIdType, setSelectedIdType] = useState('National ID Card');
    const [showActionModel, setShowActionModel] = useState(false);
    const [frontSideFile, setFrontSideFile] = useState(null);
    const [backSideFile, setBackSideFile] = useState(null);
    const Navigate = useNavigate();
    const idTypes = [
        { id: 'national-id', label: 'National ID Card', active: true },
        { id: 'nin-slip', label: 'NIN Slip', active: false },
        { id: 'drivers-license', label: "Driver's License", active: false },
        { id: 'voter-card', label: 'Voter Card', active: false }
    ];

  const handleFileUpload = (side, file) => {
    if (side === 'front') {
      setFrontSideFile(file);
    } else {
      setBackSideFile(file);
    }
  };

    const FileUploadArea = ({ side, file, onFileChange }) => (
        <div className="border-2 border-dashed border-[#D0D5DD] rounded-[16px] p-20 text-center bg-[#FFFFFF] hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center w-18 h-18 bg-blue-100 rounded-full mb-2">
                <MdOutlineFileUpload className="w-8 h-8 text-blue-500" />
            </div>      
            <div className="text-blue-500 font-medium">
            Click to upload <span className="text-gray-500">or drag and drop</span>
            </div>
            <div className="text-gray-400 text-sm">PDF, JPG, PNG (max. 10MB)</div>
        </div>
        <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onFileChange(e.target.files[0])}
            className="hidden"
        />
        </div>
    );
    
    const handleContinue = () => {
        setShowActionModel(true);
    }
    const handleSkip = () => {
        setShowActionModel(true);
    }

  return (
    <div className="">
      <div className="space-y-2">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Verify Your Identity</h3>
        <p className="font-inter font-medium text-[#101928] text-sm md:text-base">
          we need to confirm who you are. Your information is secure
        </p>
      </div>
      {/* ID Type Selection */}
      <div className="mb-8 mt-[40px]">
        <p className="font-inter text-sm text-[#101928] mb-[21px]">Verify my identity using</p>
        <div className="flex flex-wrap gap-2">
          {idTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedIdType(type.label)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedIdType === type.label
                  ? 'bg-[#E6F4FE] text-sm font-semibold md:text-base text-[#101928]  border-[#0091F0]'
                  : 'bg-white text-sm text-[#7A828F] border-[#DFE2E7] hover:border-gray-400'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload Areas */}
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-3">Front Side</label>
          <FileUploadArea side="front" file={frontSideFile} onFileChange={(file) => handleFileUpload('front', file)} />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-3">Back Side</label>
          <FileUploadArea side="back" file={backSideFile} onFileChange={(file) => handleFileUpload('back', file)} />
        </div>
      </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
            <button className="flex-1 py-3 px-6 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors" onClick={handleSkip}>
                Skip
            </button>
            <button className="flex-2 py-3 px-6 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors" onClick={handleContinue}>
                Continue
            </button>
            </div>
            <ActionModel
              isOpen={showActionModel}
              onClose={() => setShowActionModel(false)}
              title="You’re All Set!"
              message="You’ve successfully created your account and Ready to find the right artisan for the job"
              primaryButtonText="Browse Artisans"
              onPrimaryButtonClick={() => Navigate(`${formData?.role === 'user' || user?.data?.role === "User" ? '/' : '/'}`, {state: {message: "Signup Successful! Please log in to continue."} })}
            />
        </div>
    );
}
 
export default VerifyIdentify;
