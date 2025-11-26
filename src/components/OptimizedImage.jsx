import React, { useState, useRef, useEffect } from "react";
import { useIntersectionObserver } from "../utils/dataUtils";

const OptimizedImage = ({
  src,
  alt,
  className,
  style,
  placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Loading...</text></svg>',
  loading = "lazy",
  onLoad,
  onError,
  sizes,
  srcSet,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(
    loading === "eager" ? src : placeholder
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const { ref: intersectionRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  // Combine refs
  useEffect(() => {
    if (intersectionRef.current && imgRef.current) {
      intersectionRef.current = imgRef.current;
    }
  }, [intersectionRef]);

  // Load image when it comes into view (for lazy loading)
  useEffect(() => {
    if (loading === "lazy" && hasIntersected && imageSrc === placeholder) {
      setImageSrc(src);
    }
  }, [hasIntersected, loading, src, imageSrc, placeholder]);

  // Load image immediately for eager loading
  useEffect(() => {
    if (loading === "eager") {
      setImageSrc(src);
    }
  }, [loading, src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(false);
    // Fallback to placeholder or default image
    setImageSrc(placeholder);
    if (onError) onError(e);
  };

  const imageStyles = {
    opacity: isLoaded ? 1 : 0.7,
    transition: "opacity 0.3s ease",
    ...style,
  };

  const ErrorFallback = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f0f0",
        color: "#666",
        fontSize: "0.875rem",
        minHeight: "100px",
        ...style,
      }}
      className={className}
    >
      Failed to load image
    </div>
  );

  if (hasError && imageSrc !== placeholder) {
    return <ErrorFallback />;
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? "loaded" : ""}`}
      style={imageStyles}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      sizes={sizes}
      srcSet={srcSet}
      {...props}
    />
  );
};

// Higher-order component for image optimization
export const withImageOptimization = (Component) => {
  return React.forwardRef((props, ref) => {
    return <Component ref={ref} {...props} />;
  });
};

// Utility for generating responsive image sizes
export const generateSizes = (breakpoints = {}) => {
  const defaultBreakpoints = {
    mobile: "(max-width: 768px) 100vw",
    tablet: "(max-width: 1024px) 50vw",
    desktop: "25vw",
  };

  const merged = { ...defaultBreakpoints, ...breakpoints };

  return Object.values(merged).join(", ");
};

// Utility for generating srcSet for responsive images
export const generateSrcSet = (baseSrc, widths = [400, 800, 1200]) => {
  return widths
    .map((width) => {
      const src = baseSrc.replace(/\.(jpg|jpeg|png|webp)$/i, `_${width}w.$1`);
      return `${src} ${width}w`;
    })
    .join(", ");
};

export default OptimizedImage;
