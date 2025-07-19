import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { TextInput } from "../../components/Form";
import AuthSidePanel from "../../components/Layout/AuthSidePanel";
import google from "../../assets/google.png";
import facebook from "../../assets/facebook.png";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserEmailQuery, useLoginMutation } from "../../store/api/apiSlice";
import LoaderComp from "../../assets/animation/loader";
import { loginaction } from "../../redux/Auth/Login/LoginAction";
import { connect } from "react-redux";
import { userAction } from "../../redux/User/UserAction";

const Login = ({
  loginAction, 
  userAction,
  userLoading,
  loading: isLoading,
  user,
  data,
  error
}) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(false)
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

  const handleSubmit = async (e) => {
    setErrors(false)
    e.preventDefault();
    try{
      const userData ={
        email: email,
        password: password,
      }
      await loginAction(userData, ()=>{
        console.log("i got here in login")
      },()=>{
        setErrors(true);
      });
      }
    catch (error) {
        console.error('Registration failed:', error);
    }
  };
  useEffect(() => {
    if (data && data.userId) {
      userAction(data.userId);
    }
  }, [data]);
  // useEffect(() => {
  //   if(data.userId){
  //     if (user && user?.data) {
  //       if (!user.data.emailConfirmed) {
  //         navigate('/signup');
  //       } 
  //     } 
  //   } else{
  //     navigate('/dashboard');
  //   }
  // }, [user, data]);
  useEffect(() => {
    if (!data) return;

    // Case 1: Email is NOT confirmed
    if (data?.userId) {
      navigate("/signup");
      return;
    }

    // Case 2: Email is confirmed (via token or nested user)
    if (data?.token) {
      navigate("/dashboard");
      return;
    }

  }, [data]);
  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <AuthSidePanel className="hidden md:flex gap-8" />
      <div className="px-2 py-6 lg:px-8 lg:py-[24px] w-full md:w-[45%] overflow-y-scroll custom-scrollbar-hide">
        <div> 
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-[#101928] font-manrope">
            Welcome Back! <span role="img" aria-label="wave">👋</span>
          </h2>
          <p className="mt-4 font-inter font-medium text-[#101928] lg:text-sm xl:text-base">
            Log in to find trusted artisans, manage your<br></br> tasks, and track your payments securely.
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

        <div className="mt-[30px]">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                variant="primary"
                className="w-full mt-6 py-[14px] font-manrope font-semibold"
                  
              >
                {isLoading ? (
                  <LoaderComp/>
                ) : (
                  "Login"
                )}  
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

          <p className="mt-8 font-inter font-medium">
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

const mapStoreToProps = (state) => {
  console.log(state)
    return {
        loading: state?.login?.loading,
        error: state?.login?.error,
        data: state?.login?.data,
        user: state?.user?.data,
        userLoading: state?.user?.loading
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (poststate, history,errors) => dispatch(loginaction(poststate, history, errors)),
        userAction: (id) => dispatch(userAction(id))
    };
};

export default connect(mapStoreToProps, mapDispatchToProps)(Login);
