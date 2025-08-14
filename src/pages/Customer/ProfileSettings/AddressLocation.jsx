import React, { useState, useEffect } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Map, Pencil } from 'lucide-react';
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

const AddressLocation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { fetchCurrentUser, state: userState } = useUser();
  const navigate = useNavigate();

  const userData = userState.user.data;
  const userLoading = userState.user.loading;
  const userError = userState.user.error;
  const user = userData?.data || userData;

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        address: user.address || user.streetAddress || 'Not provided',
        city: user.city || 'Not provided',
        state: user.state || user.stateProvince || 'Not provided',
        country: user.country || 'Not provided',
        postalCode: user.postalCode || user.zipCode || 'Not provided'
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
      console.error('AddressLocation: Error parsing auth data:', error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saving address data:', formData);
    setIsEditing(false);
    navigate(-1);
  };

  if (userLoading) {
    return (
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pri-norm-1 mx-auto mb-4"></div>
            <p>Loading address information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (userError && Object.keys(userError).length > 0) {
    return (
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load address information</p>
            <Button variant="primary" onClick={() => fetchCurrentUser()} className="px-6 py-2">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg">
      <div className="">
        {isEditing ? (
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20 lg:gap-28">
            <div className="w-full max-w-full md:max-w-2xl space-y-6 md:space-y-10">
              <TextInput
                className="text-sm"
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your street address"
              />
              <TextInput
                className="text-sm"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
              <TextInput
                className="text-sm"
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state/province"
              />

              <SelectField
                className="text-sm"
                labelClassName="text-sm"
                dropdownClassName="text-sm"
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                options={[
                  { value: 'Nigeria', label: 'Nigeria' },
                  { value: 'Ghana', label: 'Ghana' },
                  { value: 'South Africa', label: 'South Africa' },
                  { value: 'Kenya', label: 'Kenya' }
                ]}
                placeholder="Select country"
              />
              <TextInput
                className="text-sm"
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
              />
              <div className="flex flex-col sm:flex-row gap-4 pt-6 sm:pt-8">
                <Button onClick={handleSave} variant="primary" className="px-6 py-3.25">
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              <Button variant="secondary" className="w-full md:w-60 capitalize py-4" rightIcon={<Map />}>
                set location on map
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-full md:max-w-2xl">
            <InfoRow label="Street Address" value={formData.address} />
            <InfoRow label="City" value={formData.city} />
            <InfoRow label="State/Province" value={formData.state} />
            <InfoRow label="Country" value={formData.country} />
            <InfoRow label="Postal Code" value={formData.postalCode} />
            <Button
              onClick={() => {
                setIsEditing(true);
                navigate('/customer/profile&settings/addressLocation/edit');
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
  );
};

export default AddressLocation;
