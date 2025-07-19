import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { TextInput } from "../../components/Form";
import AuthSidePanel from "../../components/Layout/AuthSidePanel";
import { connect } from "react-redux";
import { forgotPasswordAction } from "../../redux/Auth/Login/LoginAction";
import LoaderComp from "../../assets/animation/loader";

const ForgotPassword = ({forgotPassword, loading, error, data}) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState(false)
  const navigate = useNavigate();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle forgot password logic here
  //   console.log("Reset password for:", email);
  // };
  const handleSubmit = async (e) => {
    setErrors(false)
    e.preventDefault();
    try{
      const userData ={
        email: email,
      }
      await forgotPassword(userData, ()=>{
        console.log("i got here in login")
        navigate("/verify-code", { state: { email } })
      },()=>{
        setErrors(true);
      });
      }
    catch (error) {
        console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <AuthSidePanel className="hidden md:flex" />
      
      <div className="px-2 py-6 lg:px-8 lg:py-[24px] xl:py-[60px] w-full md:w-[40%]">
        <div className="w-full max-w-[350px] mb-[71px]">
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 font-manrope">
            Reset Your Password
          </h2>
          <p className="mt-4 font-inter font-medium text-[#101928] lg:text-sm xl:text-base">
          Enter the email linked to your account and we’ll send you a reset code.
          </p>
        </div>
        {errors && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="">
          <form className="space-y-6 mb-[146px]" onSubmit={handleSubmit}>
            <TextInput
              id="email"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              className="w-full"
            />

            <div>
              <Button
                type="submit"
                size='large'
                variant="primary"
                className="w-full py-3 font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <LoaderComp/>
                ) : (
                  "Send Reset Code"
                )}  
              </Button>
            </div>
          </form>

          <p className="font-medium">
          Remember your password?{" "}
            <Link
              to="/"
              className="leading-6 text-[#0091F0] hover:text-[#006DB4]"
            >
              Go back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


const mapStoreToProps = (state) => {
  console.log(state)
    return {
        loading: state?.forgotPassword?.loading,
        error: state?.forgotPassword?.error,
        data: state?.forgotPassword?.data,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        forgotPassword: (poststate, history,errors) => dispatch(forgotPasswordAction(poststate, history, errors)),
    };
};
export default connect(mapStoreToProps, mapDispatchToProps)(ForgotPassword);
