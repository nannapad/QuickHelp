import { useEffect, useState } from "react";

// Hook for managing focus
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState(null);

  const saveFocus = () => {
    setFocusedElement(document.activeElement);
  };

  const restoreFocus = () => {
    if (focusedElement && typeof focusedElement.focus === "function") {
      focusedElement.focus();
    }
  };

  const trapFocus = (containerElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    containerElement.addEventListener("keydown", handleTabKey);

    return () => {
      containerElement.removeEventListener("keydown", handleTabKey);
    };
  };

  return {
    saveFocus,
    restoreFocus,
    trapFocus,
  };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (onEscape, onEnter) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onEscape) {
        onEscape();
      }
      if (e.key === "Enter" && onEnter) {
        onEnter();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, onEnter]);
};

// Hook for screen reader announcements
export const useAnnouncer = () => {
  const announce = (message, priority = "polite") => {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.setAttribute("class", "sr-only");
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  return { announce };
};

// Hook for managing ARIA attributes
export const useAriaAttributes = (initialAttributes = {}) => {
  const [attributes, setAttributes] = useState(initialAttributes);

  const updateAttribute = (key, value) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeAttribute = (key) => {
    setAttributes((prev) => {
      const newAttributes = { ...prev };
      delete newAttributes[key];
      return newAttributes;
    });
  };

  const getAriaProps = () => {
    return Object.entries(attributes).reduce((props, [key, value]) => {
      props[`aria-${key}`] = value;
      return props;
    }, {});
  };

  return {
    attributes,
    updateAttribute,
    removeAttribute,
    getAriaProps,
  };
};

// Utility for generating unique IDs
let idCounter = 0;
export const generateId = (prefix = "id") => {
  return `${prefix}-${++idCounter}`;
};

// Hook for auto-generating IDs
export const useId = (prefix) => {
  const [id] = useState(() => generateId(prefix));
  return id;
};

// Color contrast utility
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if colors meet WCAG contrast requirements
export const meetsContrastRequirement = (
  color1,
  color2,
  level = "AA",
  size = "normal"
) => {
  const ratio = getContrastRatio(color1, color2);
  if (!ratio) return false;

  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };

  return ratio >= requirements[level][size];
};
