import React from 'react';
import CtaButton from './CtaButton';

const CtaButtonDemo = () => {
  return (
    <div className="p-10 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-12 text-center">CTA Button Showcase</h1>

      {/* Green CTA Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-green-400 mb-6">Green CTA Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Default</p>
            <CtaButton variant="green">Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Hover (Simulated)</p>
            <CtaButton variant="green" >Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Active/Focus (Simulated)</p>
            <CtaButton variant="green">Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Disabled</p>
            <CtaButton variant="green" disabled>Primary CTA</CtaButton>
          </div>
        </div>
      </section>

      {/* Orange CTA Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-orange-400 mb-6">Orange CTA Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Default</p>
            <CtaButton variant="orange">Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Hover (Simulated)</p>
            <CtaButton variant="orange">Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Active/Focus (Simulated)</p>
            <CtaButton variant="orange">Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Disabled</p>
            <CtaButton variant="orange" disabled>Primary CTA</CtaButton>
          </div>
        </div>
      </section>

      {/* Blue CTA Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-400 mb-6">Blue CTA Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Default</p>
            <CtaButton variant="blue">Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Hover (Simulated)</p>
            <CtaButton variant="blue" >Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Active/Focus (Simulated)</p>
            <CtaButton variant="blue" >Primary CTA</CtaButton>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Disabled</p>
            <CtaButton variant="blue" disabled>Primary CTA</CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CtaButtonDemo;
