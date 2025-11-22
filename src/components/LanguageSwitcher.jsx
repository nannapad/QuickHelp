import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "./css/LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === "en" ? "active" : ""}`}
        onClick={() => changeLanguage("en")}
        title="English"
      >
        EN
      </button>
      <button
        className={`lang-btn ${language === "th" ? "active" : ""}`}
        onClick={() => changeLanguage("th")}
        title="ภาษาไทย"
      >
        TH
      </button>
    </div>
  );
};

export default LanguageSwitcher;
