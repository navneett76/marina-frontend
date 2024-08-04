// LazyLoadImage.tsx
import React from 'react';
import useLazyLoadImage from './LazyLoading';

interface LazyLoadImageProps {
    src: string;
    alt: string;
    className: string;
}

const LazyLoadImage: React.FC<LazyLoadImageProps> = ({ src, alt, className }) => {
    const [imgRef, isVisible] = useLazyLoadImage(src);

    return (
        <img
            ref={imgRef}
            src={isVisible ? src : ''}
            alt={alt}
            className={className}
        />
    );
};

export default LazyLoadImage;
