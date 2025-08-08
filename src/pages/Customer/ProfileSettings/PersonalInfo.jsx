import React, { useState } from 'react';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Button/Button';
import { Pencil } from 'lucide-react';
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

const ProfilePicture = ({ onEdit }) => (
  <div className="flex flex-col items-center w-full max-w-xs sm:max-w-none">
    <h1 className="capitalize mb-4 text-sm">Profile Picture</h1>
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 overflow-hidden mb-2">
      <img src="/img/avatar1.jpg" alt="Profile" className="w-full h-full object-cover rounded-full" />
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
  const [formData, setFormData] = useState({
    fullName: 'Sooreoluwa Okeyode',
    email: 'sooreoluwa@gmail.com',
    phone: '080123456778',
    dob: '12 - 04 - 2001'
  });

  const navigate = useNavigate();

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

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg">
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16 lg:gap-28">
        <div className="w-full md:w-auto flex-shrink-0 flex justify-center md:justify-start">
          <ProfilePicture onEdit={() => setIsEditing(true)} />
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
