import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { TextInput } from "../../components/Form";
import AuthSidePanel from "../../components/Layout/AuthSidePanel";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Reset password for:", email);
  };

  return (
    <div className="flex h-screen bg-white p-[27px] gap-14">
      <AuthSidePanel className="hidden md:flex" />
      
      <div className="px-6 py-12 lg:px-8 sm:w-full sm:max-w-[526px]">
        <div className="w-full max-w-[350px] mb-[71px]">
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 font-manrope">
            Reset Your Password
          </h2>
          <p className="mt-4 font-inter">
          Enter the email linked to your account and we’ll send you a reset code.
          </p>
        </div>

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
                variant="secondary"
                className="w-full py-3 font-semibold"
              >
                Send Reset Code
              </Button>
            </div>
          </form>

          <p className="font-medium">
          Remember your password?{" "}
            <Link
              to="/login"
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

export default ForgotPassword;
