// src/pages/NotFound.jsx
import { useNavigate } from "react-router-dom";
import "./css/NotFound.css";
import { useTranslation } from "../utils/translations";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    // If can't go back, navigate to home instead
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="notfound">
      <div className="notfound-inner">
        <div className="notfound-badge">404</div>
        <h1 className="notfound-title">{t("notFoundPage.title")}</h1>
        <p className="notfound-sub">{t("notFoundPage.description")}</p>

        <div className="notfound-actions">
          <button className="notfound-btn primary" onClick={handleGoHome}>
            {t("notFoundPage.goHome")}
          </button>
          <button className="notfound-btn ghost" onClick={handleGoBack}>
            {t("notFoundPage.goBack")}
          </button>
        </div>

        <div className="notfound-hint">{t("notFoundPage.hint")}</div>
      </div>

      <div className="notfound-blob notfound-blob-left" />
      <div className="notfound-blob notfound-blob-right" />
    </div>
  );
};

export default NotFound;
