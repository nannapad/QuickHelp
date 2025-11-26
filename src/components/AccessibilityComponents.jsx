import React from "react";

// Skip link component
export const SkipLink = ({
  href = "#main-content",
  children = "Skip to main content",
}) => {
  return (
    <a
      href={href}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        zIndex: 999999,
        padding: "8px 16px",
        background: "#000",
        color: "#fff",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "bold",
      }}
      onFocus={(e) => {
        e.target.style.left = "0";
        e.target.style.top = "0";
      }}
      onBlur={(e) => {
        e.target.style.left = "-9999px";
        e.target.style.top = "-9999px";
      }}
    >
      {children}
    </a>
  );
};

// Screen reader only utility component
export const ScreenReaderOnly = ({ children, as: Component = "span" }) => {
  return (
    <Component
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </Component>
  );
};
