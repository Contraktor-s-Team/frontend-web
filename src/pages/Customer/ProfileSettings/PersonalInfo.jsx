import React, { useState, useEffect, useRef } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import axios from 'axios';

const InfoRow = ({ label, value }) => (
  <>
    <div>
      <h3 className="text-sm font-medium text-black mb-1">{label}</h3>
      <p className="text-neu-norm-1 text-sm">{value || 'Not provided'}</p>
    </div>
    <div className="border-b-2 border-neu-light-2 my-7"></div>
  </>
);

const ProfilePicture = ({ userImage, onFileSelect, uploading }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col items-center w-full max-w-xs sm:max-w-none">
      <h1 className="capitalize mb-4 text-sm">Profile Picture</h1>
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 overflow-hidden mb-2">
        <img
          src={userImage || '/img/avatar1.jpg'}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => { e.target.src = '/img/avatar1.jpg'; }}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
        <div className="absolute bottom-1 right-1">
          <Button
            variant="primary"
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-2 border-white"
            onClick={() => fileInputRef.current.click()}
            iconOnly
            leftIcon={<Pencil size={20} />}
          />
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onFileSelect}
          />
        </div>
      </div>
      <div className="w-full text-center">
        <p className="text-sm text-gray-400 mt-2">
          JPG or PNG file, no larger
          <br />
          than 2MB. (400×400px)
        </p>
      </div>
    </div>
  );
};

const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // ✅ Local preview state
  const { fetchCurrentUser, state: userState } = useUser();
  const navigate = useNavigate();

  const userData = userState.user.data;
  const userLoading = userState.user.loading;
  const userError = userState.user.error;
  const user = userData?.data || userData;
  
  // Debug: Log the full user data structure
  console.log('🔍 Full userState:', userState);
  console.log('🔍 userData:', userData);
  console.log('🔍 Final user object:', user);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: ''
  });

  useEffect(() => {
    if (user) {
      console.log('🔍 User data structure:', user);
      console.log('🔍 Available user fields:', Object.keys(user));
      console.log('🔍 DOB fields check:', {
        dateOfBirth: user.dateOfBirth,
        dob: user.dob,
        dateOfBirthType: typeof user.dateOfBirth,
        dobType: typeof user.dob,
        dateOfBirthFormatted: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'null'
      });
      
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      // Helper function to format date from API response
      const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        try {
          // Handle API response format (ISO timestamp like "2025-08-14T01:52:51.592Z")
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Not provided';
          
          // Format as readable date (e.g., "August 14, 2025")
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch (error) {
          console.error('Error formatting date:', error);
          return 'Not provided';
        }
      };

      setFormData({
        fullName: fullName || 'Not provided',
        email: user.email || 'Not provided',
        phone: user.phoneNumber || 'Not provided',
        dob: formatDate(user.dateOfBirth || user.dob || user.DateOfBirth || user.DOB)
      });
    }
  }, [user]);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (!authData) return;

    try {
      const parsedAuth = JSON.parse(authData);
      const hasToken = !!parsedAuth?.token;
      const hasUserData = userData?.data?.id || userData?.id || (userData && Object.keys(userData).length > 0);
      if (hasToken && !hasUserData && !userLoading) {
        fetchCurrentUser().catch(console.error);
      }
    } catch (error) {
      console.error('PersonalInfo: Error parsing auth data:', error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('🔍 Saving data:', formData);
    console.log('🔍 Current user object:', user);
    console.log('🔍 User data structure:', JSON.stringify(user, null, 2));
    setIsEditing(false);
    navigate(-1);
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ✅ File size check
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    // ✅ File type check
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG or PNG allowed");
      return;
    }

    // ✅ Ensure user has an ID
    if (!user?.id) {
      alert("User ID is missing. Please refresh and try again.");
      console.error("User object is missing ID:", user);
      return;
    }

    const formData = new FormData();
    formData.append("UserId", user.id);
    formData.append("Image", file);

    // ✅ Show preview immediately
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    try {
      setUploading(true);
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      await axios.post(
        "https://distrolink-001-site1.anytempurl.com/api/Users/upload-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // ❗ Let Axios handle Content-Type
          },
        }
      );

      // ✅ Refresh user data from backend so changes persist
      await fetchCurrentUser();
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="bg-white p-4 sm:p-8 rounded-lg">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pri-norm-1 mx-auto mb-4"></div>
            <p>Loading profile information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (userError && Object.keys(userError).length > 0) {
    return (
      <div className="bg-white p-4 sm:p-8 rounded-lg">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load profile information</p>
            <Button variant="primary" onClick={() => fetchCurrentUser()} className="px-6 py-2">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg">
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16 lg:gap-28">
        <div className="w-full md:w-auto flex-shrink-0 flex justify-center md:justify-start">
          <ProfilePicture
            userImage={previewImage || user?.imageUrl || user?.profilePicture} // ✅ Show preview instantly
            onFileSelect={handleProfilePictureUpload}
            uploading={uploading}
          />
        </div>
        <div className="w-full max-w-2xl">
          {isEditing ? (
            <div className="w-full max-w-132 space-y-10">
              <TextInput
                className="text-sm"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextInput
                className="text-sm"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextInput
                className="text-sm"
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <TextInput
                className="text-sm"
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                disabled={true}
                readOnly={true}
              />
              <Button onClick={handleSave} variant="primary" className="px-6 py-3.25 mt-14.5">
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-132">
              <InfoRow label="Full Name" value={formData.fullName} />
              <InfoRow label="Email Address" value={formData.email} />
              <InfoRow label="Phone Number" value={formData.phone} />
              <InfoRow label="Date of Birth" value={formData.dob} />
              <Button
                onClick={() => {
                  setIsEditing(true);
                  navigate('/customer/profile&settings/personalInfo/edit');
                }}
                variant="primary"
                className="px-6 py-3.25 mt-14.5"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;