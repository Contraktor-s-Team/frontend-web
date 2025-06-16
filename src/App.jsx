import React from 'react'
import { ButtonDemo, CtaButtonDemo, ChipDemo } from "./components/Button";
import { FormDemo } from "./components/Form";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Onboarding/Signup';
import Login from './pages/Onboarding/Login';
import ForgotPassword from './pages/Onboarding/ForgotPassword';
import VerificationCode from './pages/Onboarding/VerificationCode';
import CreateNewPassword from './pages/Onboarding/CreateNewPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerificationCode />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
      </Routes>
    </Router>
  );
}

export default App