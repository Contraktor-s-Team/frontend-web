import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable side panel component for authentication pages (Login/Signup)
 * @param {Object} props - Component props
 * @param {string} [className=""] - Additional CSS classes for the container
 * @param {number} [currentSlide=0] - The index of the currently active slide
 * @returns {JSX.Element} A styled side panel with logo, content slider, and footer
 */
const AuthSidePanel = ({ className = '', currentSlide: externalCurrentSlide = null }) => {
  const [internalCurrentSlide, setInternalCurrentSlide] = useState(0);

  // Use externalCurrentSlide if provided, otherwise use internal state
  const currentSlide = externalCurrentSlide !== null ? externalCurrentSlide : internalCurrentSlide;

  const slides = [
    {
      title: 'Verified Artisans, Always Within Reach',
      description: 'Connect with skilled, locally vetted professionals',
      image: '/Verified Arts.png'
    },
    {
      title: 'Post a Job in Just a Few Clicks',
      description: 'Easily describe your need, choose a time, and get connected with trusted artisans',
      image: '/post-a-job.png' // Would be replaced with actual image component
    },
    {
      title: 'Your Money is Protected',
      description: 'With escrow payments, funds are only released when the job is done to your satisfaction.',
      image: '/money-protected.png' // Would be replaced with actual image component
    }
  ];

  // Auto-advance slides every 5 seconds (only if not controlled externally)
  useEffect(() => {
    if (externalCurrentSlide === null) {
      const timer = setInterval(() => {
        setInternalCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [externalCurrentSlide, slides.length]);

  return (
    <div
      className={`hidden md:flex w-[40%] flex-col justify-between bg-[url('/onboarding-bg.png')] bg-cover bg-center md:p-[30px] xl:p-[54px] text-white rounded-[20px] h-full ${className}`}
    >
      {/* Logo */}
      <div className="font-manrope font-bold text-white text-4xl">Contraktor</div>

      {/* Slider Content */}
      <div className="flex flex-col items-center space-y-7">
        {/* Image Placeholder - Replace with actual image component */}
        {/* <div className="w-[168px] h-[96px] bg-gray-300 rounded"></div> */}
        <img src={slides[currentSlide]?.image} alt={slides[currentSlide]?.title} className="w-70" />

        {/* Current Slide Content */}
        <h2 className="font-manrope font-bold md:text-2xl text-center text-white">{slides[currentSlide]?.title}</h2>
        <p className="font-inter font-normal leading-6 text-center text-neu-light-2 max-w-[400px]">
          {slides[currentSlide]?.description}
        </p>

        {/* Slide Indicators */}
        <div className="flex justify-center items-center space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setInternalCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-3 h-3 bg-pri-norm-1' : 'w-2 h-2 bg-neu-light-2/40 hover:bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-2">
        <p className="font-inter font-medium text-[#98A2B3] text-sm">©2025 Contraktor Inc. All rights reserved</p>
        <p className="font-inter font-medium text-[#98A2B3] text-sm inline-flex items-center">
          Privacy <span className="text-4xl text-[#DFE2E766] px-3">·</span> Term & Conditions
        </p>
      </div>
    </div>
  );
};

AuthSidePanel.propTypes = {
  /** Array of objects containing title and description for each slide */
  sliderItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.node
    })
  ),
  /** Additional CSS classes */
  copyrightText: PropTypes.string,
  /** Additional CSS classes for the container */
  className: PropTypes.string
};

export default AuthSidePanel;
