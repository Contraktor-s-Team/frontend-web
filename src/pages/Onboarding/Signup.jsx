import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TiSpanner } from "react-icons/ti";
import Button from "../../components/Button";
import { TbCircleCheckFilled } from "react-icons/tb";

const Signup = () => {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState("");
    const nextStep = () => {
        if (step < 5) {
            if (selectedRole) {
                setStep(step + 1);
            }
        }
    }
    return ( 
        <div className="relative flex items-center h-screen w-full bg-white p-[27px]">
            <div className="hidden bg-bg-primary p-[54px] rounded-[20px] w-[55%] h-full md:flex flex-col justify-between">
                <p className="font-manrope font-bold text-white text-4xl">ContraKtor</p>
                <div className="space-y-2">
                    <p className="font-inter font-medium text-[#98A2B3]">©2025 Contraktor Inc. All rights reserved</p>
                    <p className="font-inter font-medium text-[#98A2B3]">Privacy <span className="text-6xl text-[#DFE2E766] px-3">.</span> Term & Conditions</p>
                </div>
            </div>
            <div className="relative p-1 md:p-[76px] w-full h-full">
                {/* Progress bar section Start*/}
                <div className="flex mb-8 w-full">
                    <div className="w-100/5 h-1.5 bg-blue-500 rounded"></div>
                    <div className="w-100/5 h-1.5 bg-gray-200 rounded ml-2"></div>
                    <div className="w-100/5 h-1.5 bg-gray-200 rounded ml-2"></div>
                    <div className="w-100/5 h-1.5 bg-gray-200 rounded ml-2"></div>
                    <div className="w-100/5 h-1.5 bg-gray-200 rounded ml-2"></div>
                </div>
                {/* Progress bar section Ends*/}
                {/* Steps form section Start*/}
                {step === 1 && (
                    <div>
                        <div className="">
                            <div className="space-y-2">
                                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-4xl">Let’s Set You Up Right</h3>
                                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">Choose how you’d like to sign up on contraktor</p>
                            </div>
                            <div className="mt-8 flex flex-col md:flex-row gap-4 ">
                                <div 
                                    onClick={() => setSelectedRole('client')} 
                                    className={`relative w-full h-[89px] md:h-[238px] px-[22px] rounded-2xl flex md:flex-col items-center md:justify-center space-x-5 md:space-y-4 transition-all duration-200 ${
                                            selectedRole === 'client'
                                            ? 'border border-[#0091F0]'
                                            : 'border border-[#DFE2E7]'
                                    }`}
                                >
                                    {selectedRole === 'client' && <TbCircleCheckFilled className="absolute md:top-4 right-1 text-2xl md:text-3xl text-[#0091F0]"/>}
                                    <div className={`w-[46px] h-[46px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center ${selectedRole === 'client' ? 'bg-[#E6F4FE]' : 'bg-[#FDF1DC]'}`}>
                                        <FiSearch className={`text-xl md:text-3xl ${selectedRole === 'client' ? 'text-[#006DB4]' : 'text-[#F3A218]'}`}/>
                                    </div>
                                    <p className="font-inter font-medium text-[#727A86] text-base md:text-lg">I want to Find an Artisan</p>
                                </div>
                                <div 
                                    onClick={() => setSelectedRole('artisan')} 
                                    className={`relative w-full h-[89px] md:h-[238px] px-[22px] rounded-2xl flex md:flex-col items-center md:justify-center space-x-5 md:space-y-4 transition-all duration-200 ${
                                            selectedRole === 'artisan'
                                            ? 'border border-[#0091F0]'
                                            : 'border border-[#DFE2E7]'
                                    }`}
                                >
                                    {selectedRole === 'artisan' && <TbCircleCheckFilled className="absolute md:top-4 right-1 text-2xl md:text-3xl text-[#0091F0]"/>}
                                    <div className={`w-[46px] h-[46px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center ${selectedRole === 'artisan' ? 'bg-[#E6F4FE]' : 'bg-[#FDF1DC]'}`}>
                                        <TiSpanner className={`text-xl md:text-3xl ${selectedRole === 'artisan' ? 'text-[#006DB4]' : 'text-[#F3A218]'}`}/>
                                    </div>
                                    <p className="font-inter font-medium text-[#727A86] text-base md:text-lg">I want to become an artisan</p>
                                </div>
                            </div>
                            <Button 
                                variant="secondary" 
                                className="w-full absolute md:relative bottom-0 mt-[44px] py-[11px]" 
                                onClick={nextStep}
                            >
                            Select Role
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Signup;