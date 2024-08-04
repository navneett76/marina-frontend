// useLazyLoadImage.ts
import { useState, useEffect, useRef, RefObject } from 'react';

const useLazyLoadImage = (src: string): [RefObject<HTMLImageElement>, boolean] => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [imgRef]);

    return [imgRef, isVisible];
};

export default useLazyLoadImage;
