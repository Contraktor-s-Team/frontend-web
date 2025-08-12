import React, { useState } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Map, Pencil } from 'lucide-react';
import SelectField from '../../../components/Form/Select';
import { useNavigate } from 'react-router-dom';

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
  const [formData, setFormData] = useState({
    address: '123 Main Street, Victoria Island',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    postalCode: '100001'
  });

  const navigate = useNavigate();

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
