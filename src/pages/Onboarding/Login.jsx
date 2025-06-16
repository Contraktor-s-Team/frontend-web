import React, { useState } from "react";
import Button from "../../components/Button";
import { TextInput } from "../../components/Form";
import AuthSidePanel from "../../components/Layout/AuthSidePanel";
import google from "/img/google.png";
import facebook from "/img/facebook.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <AuthSidePanel className="hidden md:flex gap-8" />
      <div className="px-6 py-12 lg:px-8 sm:w-full sm:max-w-[526px]">
        <div>
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 font-manrope">
            Welcome Back! <span role="img" aria-label="wave">👋</span>
          </h2>
          <p className="mt-4 font-inter">
            Log in to find trusted artisans, manage your tasks, and track your payments securely.
          </p>
        </div>

        <div className="mt-10 ">
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <div className="space-y-1">
              <TextInput
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
                className="w-full"
                onTrailingIconClick={handlePasswordToggle}
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm font-medium text-[#0091F0] hover:text-[#006DB4]">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                size='large'
                variant="secondary"
                className="w-full text-white py-[14px] font-manrope font-semibold"
              >
                Login
              </Button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <div className="w-full border-t border-gray-200" />
            <div className="px-2 text-sm text-gray-500 font-manrope font-medium">OR</div>
            <div className="w-full border-t border-gray-200" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              size='large'
              variant="grey-sec"
              type="button"
              className="w-full justify-center gap-2 py-3"
            >
              <img src={google} alt="Google" className="h-5 w-5" />
              <span>Google</span>
            </Button>
            <Button
            size='large'
              variant="grey-sec"
              type="button"
              className="w-full justify-center gap-2 py-3"
            >
              <img src={facebook} alt="Facebook" className="h-5 w-5" />
              <span>Facebook</span>
            </Button>
          </div>

          <p className="mt-10 font-inter font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="leading-6 text-[#0091F0] hover:text-[#006DB4]"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
