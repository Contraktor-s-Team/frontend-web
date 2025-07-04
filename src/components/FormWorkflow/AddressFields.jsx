import React from 'react';
import TextInput from '../Form/TextInput';
// import TextInput from '../TextInput/TextInput';

/**
 * Reusable address fields component for collecting location information
 * @param {Object} props - Component props
 * @param {Object} props.address - Current address object
 * @param {function} props.onChange - Function to handle address changes
 * @param {boolean} props.required - Whether the address fields are required
 * @param {string} props.labelClasses - Classes to apply to labels
 */
const AddressFields = ({
  address = {},
  onChange,
  required = false
}) => {
  // Ensure address is always an object
  const addressData = address || {};

  // Handle changes to any field
  const handleChange = (field) => (e) => {
    onChange({
      ...addressData,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-800">
          Address Line 1 {required && <span className="text-err-norm-1">*</span>}
        </label>
        <TextInput
          id="addressLine1"
          placeholder="Street address"
          value={addressData.line1 || ''}
          onChange={handleChange('line1')}
          required={required}
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-800">
          Address Line 2
        </label>
        <TextInput
          id="addressLine2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={addressData.line2 || ''}
          onChange={handleChange('line2')}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="city" className="block text-sm font-medium text-gray-800">
            City {required && <span className="text-err-norm-1">*</span>}
          </label>
          <TextInput
            id="city"
            placeholder="City"
            value={addressData.city || ''}
            onChange={handleChange('city')}
            required={required}
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="state" className="block text-sm font-medium text-gray-800">
            State/Province {required && <span className="text-err-norm-1">*</span>}
          </label>
          <TextInput
            id="state"
            placeholder="State/Province"
            value={addressData.state || ''}
            onChange={handleChange('state')}
            required={required}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-800">
            Postal Code {required && <span className="text-err-norm-1">*</span>}
          </label>
          <TextInput
            id="postalCode"
            placeholder="Postal Code"
            value={addressData.postalCode || ''}
            onChange={handleChange('postalCode')}
            required={required}
          />
        </div>
        
        <div className="space-y-1">
          <label htmlFor="country" className="block text-sm font-medium text-gray-800">
            Country {required && <span className="text-err-norm-1">*</span>}
          </label>
          <TextInput
            id="country"
            placeholder="Country"
            value={addressData.country || ''}
            onChange={handleChange('country')}
            required={required}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFields;
