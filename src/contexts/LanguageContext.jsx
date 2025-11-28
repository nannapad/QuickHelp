import React, { createContext, useContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default language is English
  const [language, setLanguage] = useState("en");

  // Load saved language preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "th") {
      setLanguage(saved);
    }
  }, []);

  // Save language preference whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
