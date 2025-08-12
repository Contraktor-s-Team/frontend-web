import React, { useState } from 'react';

const FallbackImage = ({ src, alt, className = '', fallbackSrc = '/img/avatarnew.png', ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    // Reset error state if image loads successfully
    setHasErrored(false);
  };

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default FallbackImage;
