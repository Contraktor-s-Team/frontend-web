import React, { useState, useEffect } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Pencil } from 'lucide-react';
import SelectField from '../../../components/Form/Select';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

const InfoRow = ({ label, value }) => (
  <>
    <div>
      <h3 className="text-sm font-medium text-black mb-1">{label}</h3>
      <p className="text-neu-norm-1 text-sm">{value}</p>
    </div>
    <div className="border-b-2 border-neu-light-2 my-7"></div>
  </>
);

const ProfilePicture = ({ onEdit, userImage }) => (
  <div className="flex flex-col items-center w-full max-w-xs sm:max-w-none">
    <h1 className="capitalize mb-4 text-sm">Profile Picture</h1>
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 overflow-hidden mb-2">
      <img
        src={userImage || '/img/avatar1.jpg'}
        alt="Profile"
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          e.target.src = '/img/avatar1.jpg';
        }}
      />
      <div className="absolute bottom-1 right-1">
        <Button
          variant="primary"
          className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-2 border-white"
          onClick={onEdit}
          iconOnly
          leftIcon={<Pencil size={20} />}
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
const PersonalInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { fetchCurrentUser, state: userState } = useUser();
  const navigate = useNavigate();

  // Get user data from context
  const userData = userState.user.data;
  const userLoading = userState.user.loading;
  const userError = userState.user.error;

  // Extract user information with fallbacks
  const user = userData?.data || userData;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: ''
  });

  // Populate form data when user data is available
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setFormData({
        fullName: fullName || 'Not provided',
        email: user.email || 'Not provided',
        phone: user.phoneNumber || 'Not provided',
        dob: user.dateOfBirth || 'Not provided'
      });
    }
  }, [user]);

  // Fetch user data on component mount only if needed
  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (!authData) {
      console.log('🚫 PersonalInfo: No auth token found, skipping fetchCurrentUser');
      return;
    }

    try {
      const parsedAuth = JSON.parse(authData);
      const hasToken = !!parsedAuth?.token;
      const hasUserData = userData?.data?.id || userData?.id || (userData && Object.keys(userData).length > 0);
      const isLoading = userLoading;

      if (hasToken && !hasUserData && !isLoading) {
        console.log('🚀 PersonalInfo: Fetching current user with valid token');
        fetchCurrentUser().catch((error) => {
          console.error('PersonalInfo: Failed to fetch user data:', error);
        });
      } else {
        console.log('🚫 PersonalInfo: Skipping fetchCurrentUser -', {
          hasToken,
          hasUserData: !!hasUserData,
          isLoading
        });
      }
    } catch (error) {
      console.error('PersonalInfo: Error parsing auth data:', error);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saving data:', formData);
    setIsEditing(false);
    navigate(-1);
  };

  // Show loading state
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

  // Show error state
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
          <ProfilePicture onEdit={() => setIsEditing(true)} userImage={user?.imageUrl || user?.profilePicture} />
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
              <SelectField
                className="text-sm"
                labelClassName="text-sm"
                dropdownClassName="text-sm"
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                options={[
                  { value: '12 - 04 - 2001', label: '12 - 04 - 2001' },
                  { value: '01 - 01 - 1990', label: '01 - 01 - 1990' },
                  { value: '15 - 06 - 1995', label: '15 - 06 - 1995' }
                ]}
                placeholder="Select date of birth"
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
              <InfoRow label="Date of birth" value={formData.dob} />
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
