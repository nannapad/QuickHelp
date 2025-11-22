import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

// Export the context for direct use in hooks
export { LanguageContext };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then browser language, then default to English
    const savedLang = localStorage.getItem("language");
    if (savedLang) return savedLang;

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith("th")) return "th";
    return "en";
  });

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
