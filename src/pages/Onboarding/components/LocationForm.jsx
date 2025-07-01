import React from 'react';
import { FaRegMap } from 'react-icons/fa';
import Button from '../../../components/Button';
import { TextInput } from '../../../components/Form';

const LocationForm = ({ 
  onSetLocationOnMap, 
  onNext,
  formData,
  onFormChange 
}) => {
  const { 
    streetAddress = '', 
    nearbyLandmark = '', 
    areaLocality = '', 
    poBox = '' 
  } = formData || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <div className="mt-[37px] md:mt-[100px] pb-6 w-full">
      <div className="space-y-2">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Allow Location Access</h3>
        <p className="font-inter font-medium text-[#101928] text-sm md:text-base">
          Add your location or enter it manually with your address details
        </p>
      </div>
      
      <button
        type="button"
        onClick={onSetLocationOnMap}
        className="mt-[52px] w-full py-3 px-4 border-2 border-[#0091F0] text-sm text-[#0091F0] rounded-[50px] font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
      >
        <span>Set Location on map</span>
        <FaRegMap size={20} />
      </button>
      
      <form className="mt-[36px]">
        <TextInput
          id="street-address"
          name="streetAddress"
          label="Street Address"
          placeholder="e.g., 23 Adeyemi Street"
          className="mb-[40px]"
          value={streetAddress}
          onChange={handleChange}
        />

        <TextInput
          id="landmark"
          name="nearbyLandmark"
          label="Nearby Landmark"
          placeholder="e.g., Close to Yaba Tech Gate"
          className="mb-[40px]"
          value={nearbyLandmark}
          onChange={handleChange}
        />

        <TextInput
          id="locality"
          name="areaLocality"
          label="Area / Locality"
          placeholder="e.g., Yaba"
          className="mb-[40px]"
          value={areaLocality}
          onChange={handleChange}
        />

        <TextInput
          id="po-box"
          name="poBox"
          label="PO Box"
          placeholder="e.g., P.O. Box 12345"
          className="mb-[40px]"
          value={poBox}
          onChange={handleChange}
        />
      </form>
      
      <Button 
        size='large'
        variant="secondary" 
        className="w-full mt-[38px] py-[11px]" 
        onClick={onNext}
      >
        Set Location
      </Button>
    </div>
  );
};

export default LocationForm;
