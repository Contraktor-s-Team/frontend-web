import React from 'react'
import { ButtonDemo, CtaButtonDemo, ChipDemo } from "./components/Button";
import { FormDemo } from "./components/Form";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Onboarding/Signup';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>} />
      </Routes>
    </Router>
  );
}

export default App