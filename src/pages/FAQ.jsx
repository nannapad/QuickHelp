import React from "react";
import { useTranslation } from "../utils/translations";
import "./css/FAQ.css";

const FAQ = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      q: t("faq.questions.access.q"),
      a: t("faq.questions.access.a"),
    },
    {
      q: t("faq.questions.request.q"),
      a: t("faq.questions.request.a"),
    },
    {
      q: t("faq.questions.update.q"),
      a: t("faq.questions.update.a"),
    },
    {
      q: t("faq.questions.categories.q"),
      a: t("faq.questions.categories.a"),
    },
  ];

  return (
    <main className="faq-page">
      <div className="faq-inner">
        <header className="faq-header">
          <h1 className="faq-title">{t("faq.title")}</h1>
          <p className="faq-subtitle">{t("faq.subtitle")}</p>
        </header>

        <div className="faq-content">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3 className="faq-question">{faq.q}</h3>
              <p className="faq-answer">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FAQ;
