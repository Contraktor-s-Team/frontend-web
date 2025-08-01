import React from 'react';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { FiSearch } from 'react-icons/fi';
import { TiSpanner } from 'react-icons/ti';
import Button from '../../../components/Button';

const RoleSelection = ({ selectedRole, setSelectedRole, onNext }) => {
  return (
    <div className=''>
      <div className="">
        <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Let's Set You Up Right</h3>
        <p className="font-inter font-medium text-sm md:text-base text-[#101928] mt-4">Choose how you'd like to sign up on contraktor</p>
      </div>
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div 
          onClick={() => setSelectedRole('user')} 
          className={`relative w-full h-[89px] lg:h-[200px] xl:h-[238px] px-[22px] rounded-2xl flex md:flex-col items-center md:justify-center space-x-5 md:space-y-4 transition-all duration-200 ${
            selectedRole === 'user'
              ? 'border border-pri-norm-1'
              : 'border border-neu-light-3'
          }`}
        >
          {selectedRole === 'user' && <TbCircleCheckFilled className="absolute md:top-4 right-1 text-2xl md:text-3xl text-pri-norm-1"/>}
          <div className={`w-[46px] h-[46px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center ${selectedRole === 'user' ? 'bg-[#E6F4FE]' : 'bg-[#FDF1DC]'}`}>
            <FiSearch className={`text-xl md:text-3xl ${selectedRole === 'user' ? 'text-[#006DB4]' : 'text-[#F3A218]'}`}/>
          </div>
          <p className="font-manrope font-semibold capitalize text-[#727A86] text-base lg:text-sm xl:text-lg">I want to Find an Artisan</p>
        </div>
        <div 
          onClick={() => setSelectedRole('artisan')} 
          className={`relative w-full h-[89px] lg:h-[200px] xl:h-[238px] px-[22px] rounded-2xl flex md:flex-col items-center md:justify-center space-x-5 md:space-y-4 transition-all duration-200 ${
            selectedRole === 'artisan'
              ? 'border border-pri-norm-1'
              : 'border border-neu-light-3'
          }`}
        >
          {selectedRole === 'artisan' && <TbCircleCheckFilled className="absolute md:top-4 right-1 text-2xl md:text-3xl text-pri-norm-1"/>}
          <div className={`w-[46px] h-[46px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center ${selectedRole === 'artisan' ? 'bg-[#E6F4FE]' : 'bg-[#FDF1DC]'}`}>
            <TiSpanner className={`text-xl md:text-3xl ${selectedRole === 'artisan' ? 'text-[#006DB4]' : 'text-[#F3A218]'}`}/>
          </div>
          <p className="font-manrope font-semibold capitalize text-[#727A86] text-base lg:text-sm xl:text-lg">I want to register as an artisan</p>
        </div>
      </div>
      <Button 
        size='large'
        variant="primary" 
        className="w-full mt-[44px] py-[11px]" 
        onClick={onNext}
        disabled={!selectedRole}
      >
        Proceed
      </Button>
    </div>
  );
};

export default RoleSelection;
