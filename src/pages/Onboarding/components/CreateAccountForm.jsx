import React from 'react';
import { FiEye } from 'react-icons/fi';
import Button from '../../../components/Button';
import { Checkbox, TextInput } from '../../../components/Form';

const CreateAccountForm = ({ onNext }) => {
  return (
    <div className='mt-[61px] pb-6'>
      <div className="space-y-2">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Create Your Account</h3>
        <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Sign up in seconds by entering your basic details</p>
      </div>
      <form className="mt-[48px] w-full md:max-w-[595px]">
        <TextInput
          id="email"
          label="Email Address"
          placeholder="Enter your email address"
          className="mb-[40px]"
          type="email"
          required
        />

        <TextInput
          id="password"
          label="Password"
          placeholder="Create a strong password"
          type="password"
          className="mb-[40px]"
          trailingIcon={<FiEye className="text-[#98A2B3] text-xl" />}
          required
        />
        
        <div>
          <Checkbox
            id="terms"
            label="I agree to the Terms & Conditions and Privacy Policy"
            required
          />
        </div>
  
        <Button 
          size='large'
          variant="secondary" 
          className="w-full mt-[38px] py-[11px]" 
          type="button"
          onClick={onNext}
        >
          Create Account
        </Button>

        <hr className="mt-[38px] md:mt-[41px] mb-[38px] text-[#DFE2E7]" data-content="OR"></hr>

        <div className="md:flex md:justify-between md:gap-4">
          <Button
            size='large'
            variant="grey-sec"
            type="button"
            className="w-full justify-center gap-2 py-3 mb-[14px]"
          >
            <img src="/img/google.png" alt="Google" className="w-5 h-5" />
            <span>Google</span>
          </Button>
          <Button
            size='large'
            variant="grey-sec"
            type="button"
            className="w-full justify-center gap-2 py-3 mb-[14px]"
          >
            <img src="/img/facebook.png" alt="Facebook" className="w-5 h-5" />
            <span>Facebook</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountForm;
