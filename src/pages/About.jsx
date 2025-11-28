import "./css/About.css";
import { useTranslation } from "../utils/translations";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <div className="about-inner">
        <div className="about-hero">
          <h1 className="about-title">{t("about.title")}</h1>
          <p className="about-subtitle">{t("about.subtitle")}</p>
        </div>

        <div className="about-grid">
          <section className="about-card">
            <h2>❓{t("about.whatIsQuickHelp.title")}</h2>
            <p>{t("about.whatIsQuickHelp.body1")}</p>
            <p>{t("about.whatIsQuickHelp.body2")}</p>
          </section>

          <section className="about-card">
            <h2>⁉️{t("about.whyWeBuiltIt.title")}</h2>
            <p>{t("about.whyWeBuiltIt.body1")}</p>
            <ul>
              <li>{t("about.whyWeBuiltIt.point1")}</li>
              <li>{t("about.whyWeBuiltIt.point2")}</li>
              <li>{t("about.whyWeBuiltIt.point3")}</li>
            </ul>
          </section>

          <section className="about-card">
            <h2>👤{t("about.whoIsItFor.title")}</h2>
            <p>{t("about.whoIsItFor.body")}</p>
            <ul>
              <li>{t("about.whoIsItFor.roleUser")}</li>
              <li>{t("about.whoIsItFor.roleCreator")}</li>
              <li>{t("about.whoIsItFor.roleAdmin")}</li>
            </ul>
          </section>

          <section className="about-card">
            <h2>🔐{t("about.keyFeatures.title")}</h2>
            <ul className="about-feature-list">
              <li>{t("about.keyFeatures.search")}</li>
              <li>{t("about.keyFeatures.bookmark")}</li>
              <li>{t("about.keyFeatures.version")}</li>
              <li>{t("about.keyFeatures.comments")}</li>
              <li>{t("about.keyFeatures.roleBased")}</li>
              <li>{t("about.keyFeatures.i18n")}</li>
            </ul>
          </section>

          <section className="about-card">
            <h2>⚙️{t("about.techAndArchitecture.title")}</h2>
            <p>{t("about.techAndArchitecture.body1")}</p>
            <ul>
              <li>{t("about.techAndArchitecture.frontend")}</li>
              <li>{t("about.techAndArchitecture.state")}</li>
              <li>{t("about.techAndArchitecture.data")}</li>
              <li>{t("about.techAndArchitecture.i18n")}</li>
            </ul>
            <p>{t("about.techAndArchitecture.body2")}</p>
          </section>

          <section className="about-card">
            <h2>📋{t("about.projectContext.title")}</h2>
            <p>{t("about.projectContext.body1")}</p>{" "}
            <p>{t("about.projectContext.body2")}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
