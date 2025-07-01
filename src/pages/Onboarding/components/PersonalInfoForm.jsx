import Button from "../../../components/Button";
import { TextInput } from "../../../components/Form";

const PersonalInfo = ({
    formData,
    onFormChange,
    onNext, 
}) => {
    const { 
        firstName = '', 
        lastName = '', 
        phoneNumber = '', 
    } = formData || {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormChange(name, value);
    };
    return ( 
        <div className="mt-[37px] md:mt-[100px] pb-6 w-full">
            <div className="space-y-2">
                <h3 className="font-manrope font-bold text-[#101928] text-2xl md:text-3xl">Finish creating account</h3>
                <p className="font-inter font-medium text-[#101928] text-sm md:text-base">
                  Add your name and phone number to finish creating your account
                </p>
            </div>
            
            
            <form className="mt-[36px]">
                <TextInput
                id="street-address"
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
                className="mb-[40px]"
                value={firstName}
                onChange={handleChange}
                />

                <TextInput
                id="lastName"
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                className="mb-[40px]"
                value={lastName}
                onChange={handleChange}
                />

                <TextInput
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter your phone number"
                className="mb-[40px]"
                value={phoneNumber}
                onChange={handleChange}
                />

            </form>
            
            <Button
                size='large'
                variant="secondary" 
                className="w-full mt-[38px] py-[11px]" 
                onClick={onNext}
            >
                Create Account
            </Button>
        </div>
    );
}
 
export default PersonalInfo;