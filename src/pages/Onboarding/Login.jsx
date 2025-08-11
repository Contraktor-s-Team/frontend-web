import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { TextInput } from '../../components/Form';
import AuthSidePanel from '../../components/Layout/AuthSidePanel';
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import LoaderComp from '../../assets/animation/loader';
import { Info } from 'lucide-react';
import SuccessPopup from '../../components/Modal/SuccessPopup';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useUser } from '../../contexts/UserContext.jsx';

const Login = () => {
  const { login, externalLogin, state: authState } = useAuth();
  const { fetchCurrentUser, state: userState } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Helper function to get redirect path based on user role
  const getRedirectPath = (authData) => {
    try {
      const user = authData?.user || authData;
      const role = user?.role || user?.data?.role;

      if (role === 'artisan' || role === 'Artisan') {
        return '/artisan/dashboard/new';
      } else {
        return '/customer/dashboard/posted';
      }
    } catch (error) {
      console.error('Error determining redirect path:', error);
      return '/customer/dashboard/posted'; // Default fallback
    }
  };

  const handleSubmit = async (e) => {
    setErrors(false);
    e.preventDefault();
    try {
      const userData = {
        email: email,
        password: password
      };
      await login(
        userData,
        () => {
          // Get auth data from login response
          const authData = authState.login.data;
          const redirectPath = getRedirectPath(authData);
          navigate(redirectPath, { state: { email: userData.email } });
        },
        () => {
          setErrors(true);
        }
      );
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Only fetch current user if we have a valid token and no existing user data
  // Remove this useEffect - it's causing the infinite loop on login page
  // The user data will be fetched after successful login navigation

  // useEffect(() => {
  //   const authData = localStorage.getItem('auth');
  //   if (!authData) {
  //     return;
  //   }

  //   try {
  //     const parsedAuth = JSON.parse(authData);
  //     const hasToken = !!parsedAuth?.token;
  //     const hasUserData = userState.user.data?.data?.id || userState.user.data?.id;
  //     const isLoading = userState.user.loading;

  //     if (hasToken && !hasUserData && !isLoading) {
  //       fetchCurrentUser().catch((error) => {
  //         console.error('Login: Failed to fetch current user:', error);
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Login: Error parsing auth data:', error);
  //   }
  // }, []); // Empty dependency array - only run once on mount
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
    if (!authState.login.data) return;
    if (authState.login.data?.userId) {
      navigate('/signup');
      return;
    }
    // if (authState.login.data?.token) {
    //   navigate("/customer/dashboard");
    //   return;
    // }
  }, [authState.login.data]);
  useEffect(() => {
    if (location.state?.message) {
      setPopupMessage(location.state.message);
      setShowPopup(true);
      // Clear the state to prevent showing popup on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  return (
    <div className="flex h-screen bg-white p-[27px] gap-14 font-manrope">
      <SuccessPopup message={popupMessage} isVisible={showPopup} onClose={handleClosePopup} />
      <AuthSidePanel className="hidden md:flex gap-8" />
      <div className="px-2 py-6 lg:px-8 lg:py-[24px] w-full md:w-[45%] overflow-y-scroll custom-scrollbar-hide">
        <div>
          <h2 className="text-3xl font-bold leading-9 tracking-tight text-[#101928] font-manrope">
            Welcome Back!{' '}
            <span role="img" aria-label="wave">
              👋
            </span>
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
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm text-red-700">
                  <p>{authState.login.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-[50px] lg:mt-[30px] xl:mt-[44px]">
          <form className="" onSubmit={handleSubmit}>
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
              className="w-full lg:mb-[20px] xl:mb-[33px]"
            />

            <div className="space-y-1">
              <TextInput
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
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
                size="large"
                variant="primary"
                className="w-full mt-[33px] lg:mt-[20px] xl:mt-[20px] py-[14px] font-manrope font-semibold"
              >
                {authState.login.loading ? <LoaderComp /> : 'Login'}
              </Button>
            </div>
          </form>

          <div className="mt-[20px] flex items-center justify-center">
            <div className="w-full border-t border-gray-200" />
            <div className="px-2 text-sm text-gray-500 font-manrope font-medium">OR</div>
            <div className="w-full border-t border-gray-200" />
          </div>

          <div className="mt-[20px] grid grid-cols-2 gap-3">
            <Button
              size="large"
              variant="grey-sec"
              type="button"
              className="w-full justify-center gap-2 py-3"
              onClick={() =>
                externalLogin('Google', () => {
                  const authData = authState.login.data;
                  const redirectPath = getRedirectPath(authData);
                  navigate(redirectPath, { state: { email: authState.login.data?.email } });
                })
              }
            >
              <img src={google} alt="Google" className="h-5 w-5" />
              <span>Google</span>
            </Button>
            <Button size="large" variant="grey-sec" type="button" className="w-full justify-center gap-2 py-3">
              <img src={facebook} alt="Facebook" className="h-5 w-5" />
              <span>Facebook</span>
            </Button>
          </div>

          <div className="mt-[30px] flex justify-between items-center font-inter font-medium">
            <p className="text-sm">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-[#0091F0] hover:text-[#006DB4]">
                Sign Up
              </Link>
            </p>

            <Button variant="text-pri" size="small" leftIcon={<Info size={20} />} className="">
              Help Centre
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStoreToProps = (state) => {
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
    loginAction: (poststate, history, errors) => dispatch(loginaction(poststate, history, errors)),
    LoginExternal: (providerName, history) => dispatch(externalLogin(providerName, history)),
    userAction: () => dispatch(userAction())
  };
};

export default Login;
