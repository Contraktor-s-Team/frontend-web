import React from 'react'
import { ButtonDemo, CtaButtonDemo, ChipDemo } from "./components/Button";
import { FormDemo } from "./components/Form";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <ButtonDemo />
      <CtaButtonDemo />
      <ChipDemo />
      <FormDemo />
    </div>
  );
}

export default App