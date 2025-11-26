import { useState, useEffect } from "react";

// Breakpoints following modern responsive design standards
export const BREAKPOINTS = {
  xs: 320, // Small mobile
  sm: 576, // Large mobile
  md: 768, // Tablet
  lg: 992, // Desktop
  xl: 1200, // Large desktop
  xxl: 1400, // Extra large desktop
};

// Hook for responsive breakpoint detection
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("lg");
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);

      let newBreakpoint = "xs";
      if (newWidth >= BREAKPOINTS.xxl) newBreakpoint = "xxl";
      else if (newWidth >= BREAKPOINTS.xl) newBreakpoint = "xl";
      else if (newWidth >= BREAKPOINTS.lg) newBreakpoint = "lg";
      else if (newWidth >= BREAKPOINTS.md) newBreakpoint = "md";
      else if (newWidth >= BREAKPOINTS.sm) newBreakpoint = "sm";

      setBreakpoint(newBreakpoint);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    breakpoint,
    width,
    isMobile: breakpoint === "xs" || breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop:
      breakpoint === "lg" || breakpoint === "xl" || breakpoint === "xxl",
    isLarge: breakpoint === "xl" || breakpoint === "xxl",
  };
};

// Hook for media query matching
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

// Hook for detecting device orientation
export const useOrientation = () => {
  const [orientation, setOrientation] = useState("landscape");

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  return orientation;
};

// Hook for detecting reduced motion preference
export const usePrefersReducedMotion = () => {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
};

// Hook for detecting dark mode preference
export const usePrefersDarkMode = () => {
  return useMediaQuery("(prefers-color-scheme: dark)");
};

// Utility for responsive values based on breakpoint
export const getResponsiveValue = (values, currentBreakpoint) => {
  const breakpointOrder = ["xs", "sm", "md", "lg", "xl", "xxl"];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Find the closest value for current breakpoint or smaller
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  // Fallback to the smallest available value
  return (
    values[breakpointOrder.find((bp) => values[bp] !== undefined)] ||
    values.default
  );
};

// Component wrapper for responsive behavior
export const ResponsiveWrapper = ({
  children,
  breakpoints,
  fallback = null,
}) => {
  const { breakpoint } = useBreakpoint();

  if (breakpoints && !breakpoints.includes(breakpoint)) {
    return fallback;
  }

  return children;
};

// CSS-in-JS responsive utilities
export const createResponsiveStyles = (styles) => {
  return Object.entries(styles).reduce((acc, [key, value]) => {
    if (typeof value === "object" && value !== null) {
      // Convert responsive object to media queries
      Object.entries(value).forEach(([breakpointKey, breakpointValue]) => {
        if (BREAKPOINTS[breakpointKey]) {
          const mediaQuery = `@media (min-width: ${BREAKPOINTS[breakpointKey]}px)`;
          if (!acc[mediaQuery]) acc[mediaQuery] = {};
          acc[mediaQuery][key] = breakpointValue;
        }
      });
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};
