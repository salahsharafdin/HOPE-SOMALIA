import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function ImageWithFallback({ src, alt, className = '', fallbackSrc = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80', ...props }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Hope Somalia Foundation'}
      onError={handleError}
      className={className}
      {...props}
    />
  );
}
